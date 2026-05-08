"""deduplicate_leads.py — Email deduplication tool for the ZNZB2B prospect list.

Must be run before every outreach batch. Reads the All Prospects tab from
Google Sheets and identifies duplicate email addresses (case-insensitive,
after stripping whitespace). Does NOT write to Sheets — report only by default.

Usage:
    python tools/deduplicate_leads.py [--flag-bounced] [--output-json]

Environment variables (loaded from .env):
    GOOGLE_SHEETS_CREDENTIALS       Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID    Google Sheets spreadsheet ID
    ALL_PROSPECTS_SHEET_NAME        Target tab name (default: All Prospects)
"""

import argparse
import json
import logging
import os
import sys
from collections import defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
EXPECTED_PROSPECT_COUNT = 521

# Column indices (0-based) in the All Prospects tab
COL_NO = 0
COL_EMAIL = 10        # K
COL_STATUS = 14       # O — contact_status

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Sheets read
# ---------------------------------------------------------------------------


def build_service(credentials_path: str):
    """Build a read-only authenticated Sheets API service."""
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def fetch_all_prospects(service, spreadsheet_id: str, sheet_name: str) -> list[dict]:
    """Fetch all data rows from the All Prospects tab.

    Returns a list of dicts with keys: no, email, contact_status, raw_row.
    Skips the header row. Rows with a blank email are included in the returned
    list but excluded from deduplication grouping.
    """
    result = (
        service.spreadsheets()
        .values()
        .get(
            spreadsheetId=spreadsheet_id,
            range=f"'{sheet_name}'!A1:U{EXPECTED_PROSPECT_COUNT + 1}",
        )
        .execute()
    )
    rows: list[list[Any]] = result.get("values", [])
    if not rows:
        return []

    # rows[0] is the header
    prospects = []
    for row in rows[1:]:
        no = _safe_int(_get(row, COL_NO))
        email_raw = _get(row, COL_EMAIL)
        email_norm = email_raw.strip().lower() if email_raw else ""
        status = _get(row, COL_STATUS)
        prospects.append(
            {
                "no": no,
                "email": email_raw,
                "email_norm": email_norm,
                "contact_status": status,
            }
        )
    return prospects


# ---------------------------------------------------------------------------
# Deduplication logic
# ---------------------------------------------------------------------------


def find_duplicates(prospects: list[dict]) -> dict[str, list[dict]]:
    """Return a mapping of normalised email → list of prospect dicts for groups with 2+ rows."""
    groups: dict[str, list[dict]] = defaultdict(list)
    for p in prospects:
        if not p["email_norm"]:
            continue  # blank emails are not deduplicated
        groups[p["email_norm"]].append(p)
    return {email: rows for email, rows in groups.items() if len(rows) >= 2}


def flag_bounced_cross_reference(
    duplicates: dict[str, list[dict]]
) -> dict[str, list[dict]]:
    """Narrow duplicates to only those groups containing at least one BOUNCED_HARD row."""
    return {
        email: rows
        for email, rows in duplicates.items()
        if any(p["contact_status"] == "BOUNCED_HARD" for p in rows)
    }


# ---------------------------------------------------------------------------
# Output formatting
# ---------------------------------------------------------------------------


def print_duplicates_table(duplicates: dict[str, list[dict]]) -> None:
    """Print a human-readable table of duplicate groups to stdout."""
    print(
        f"\nFound {len(duplicates)} duplicate email group(s) "
        f"across {sum(len(v) for v in duplicates.values())} rows:\n"
    )
    header = f"{'Email':<45}  {'No.':>5}  {'contact_status'}"
    print(header)
    print("-" * len(header))
    for email, rows in sorted(duplicates.items()):
        for i, p in enumerate(rows):
            email_display = email if i == 0 else ""
            print(
                f"{email_display:<45}  {str(p['no'] or '?'):>5}  {p['contact_status']}"
            )
        print()


def build_json_report(duplicates: dict[str, list[dict]]) -> dict:
    """Build the JSON structure for the dedup report file."""
    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_duplicate_groups": len(duplicates),
        "total_affected_rows": sum(len(v) for v in duplicates.values()),
        "duplicates": [
            {
                "email": email,
                "rows": [
                    {"no": p["no"], "contact_status": p["contact_status"]}
                    for p in rows
                ],
            }
            for email, rows in sorted(duplicates.items())
        ],
    }


def write_json_report(duplicates: dict[str, list[dict]], tools_dir: Path) -> Path:
    """Write the JSON dedup report to tools/dedup-report-YYYY-MM-DD.json."""
    today = date.today().isoformat()
    report_path = tools_dir / f"dedup-report-{today}.json"
    report = build_json_report(duplicates)
    report_path.write_text(json.dumps(report, indent=2))
    return report_path


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Identify duplicate emails in the All Prospects tab before outreach."
    )
    parser.add_argument(
        "--flag-bounced",
        action="store_true",
        help="Only report duplicate groups that contain at least one BOUNCED_HARD row.",
    )
    parser.add_argument(
        "--output-json",
        action="store_true",
        help="Write duplicate report to tools/dedup-report-YYYY-MM-DD.json.",
    )
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    args = parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    credentials_path = os.environ.get("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")
    sheet_name = os.getenv("ALL_PROSPECTS_SHEET_NAME", "All Prospects")

    if not credentials_path:
        print("FAIL: GOOGLE_SHEETS_CREDENTIALS not set in .env")
        sys.exit(1)
    if not spreadsheet_id:
        print("FAIL: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env")
        sys.exit(1)

    try:
        service = build_service(credentials_path)
    except Exception as exc:
        print(f"FAIL: Google Sheets auth failure: {exc}")
        sys.exit(1)

    try:
        prospects = fetch_all_prospects(service, spreadsheet_id, sheet_name)
    except HttpError as exc:
        print(f"FAIL: Sheets API error: {exc}")
        sys.exit(1)

    if not prospects:
        print("WARN: No rows returned from All Prospects tab.")
        sys.exit(1)

    duplicates = find_duplicates(prospects)

    if args.flag_bounced:
        duplicates = flag_bounced_cross_reference(duplicates)

    if not duplicates:
        mode_note = " (BOUNCED_HARD cross-reference)" if args.flag_bounced else ""
        print(
            f"No email duplicates found across {EXPECTED_PROSPECT_COUNT} prospects"
            f"{mode_note}. Safe to proceed."
        )
        sys.exit(0)

    print_duplicates_table(duplicates)

    if args.output_json:
        tools_dir = Path(__file__).parent
        report_path = write_json_report(duplicates, tools_dir)
        print(f"JSON report written to: {report_path}")

    # Exit 0 — duplicates are reported, not a fatal error for the caller.
    # The caller (outreach pipeline) decides whether to abort based on the report.
    sys.exit(0)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _get(row: list[Any], index: int) -> str:
    """Safely return a string value from a row by index, or empty string."""
    if index < len(row):
        val = row[index]
        return str(val).strip() if val is not None else ""
    return ""


def _safe_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


if __name__ == "__main__":
    main()
