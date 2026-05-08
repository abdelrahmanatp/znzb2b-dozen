"""bounce_handler.py — Accept a bounce event and update the prospect's contact_status.

Reads a bounce event either from CLI arguments or a JSON file, looks up the
prospect by email address in the "All Prospects" tab of the configured Google
Sheet, and updates ``contact_status`` (BOUNCED_HARD or BOUNCED_SOFT) plus
appends a timestamped entry to the ``notes`` field.

CLI usage:
    python tools/bounce_handler.py --email john@example.com --type hard --reason "Invalid address"
    python tools/bounce_handler.py --json bounce_event.json

JSON schema (SendGrid webhook compatible):
    {
        "email": "john@example.com",
        "bounce_type": "hard",
        "reason": "550 5.1.1 User unknown"
    }

Environment variables (resolved from .env two levels above this file):
    GOOGLE_SHEETS_CREDENTIALS       Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID    Google Sheets spreadsheet ID
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path
from typing import Any

_TOOLS_DIR = Path(__file__).resolve().parent
if str(_TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(_TOOLS_DIR))

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from sync_lead_state import SheetsWriter

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TOOL_NAME = "bounce_handler.py"
TAB_NAME = "All Prospects"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
# "All Prospects"!A:K — column K (index 10, 0-based) holds the email address
LOOKUP_RANGE = f"'{TAB_NAME}'!A:K"
EMAIL_COL_INDEX = 10  # K column (0-based)
PROSPECT_NO_COL_INDEX = 0  # A column (0-based)

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Email lookup
# ---------------------------------------------------------------------------


def _find_prospect_by_email(
    service: Any,
    spreadsheet_id: str,
    email: str,
) -> int | None:
    """Return the prospect_no for the given email, or None if not found.

    Reads column A through K from the "All Prospects" tab and performs a
    case-insensitive match against column K (index 10).

    Args:
        service: An authorised Google Sheets API service resource.
        spreadsheet_id: The target spreadsheet ID.
        email: The email address to search for.

    Returns:
        The integer prospect_no from column A, or None if no match is found.
    """
    try:
        result = (
            service.spreadsheets()
            .values()
            .get(spreadsheetId=spreadsheet_id, range=LOOKUP_RANGE)
            .execute()
        )
    except HttpError as exc:
        logger.error("Sheets API error during email lookup: %s", exc)
        raise

    rows: list[list[Any]] = result.get("values", [])
    normalised = email.strip().lower()

    for idx, row in enumerate(rows):
        if idx == 0:
            continue  # skip header row
        if len(row) <= EMAIL_COL_INDEX:
            continue
        cell_email = (str(row[EMAIL_COL_INDEX]) if row[EMAIL_COL_INDEX] is not None else "").strip().lower()
        if cell_email == normalised:
            try:
                return int(row[PROSPECT_NO_COL_INDEX])
            except (ValueError, IndexError):
                logger.warning(
                    "Row %d matched email but prospect_no in column A is not an integer: %r",
                    idx + 1,
                    row[PROSPECT_NO_COL_INDEX] if row else "",
                )
                return None

    return None


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------


def handle_bounce(
    email: str,
    bounce_type: str,
    reason: str,
    credentials_path: str,
    spreadsheet_id: str,
) -> int:
    """Process a single bounce event and update the prospect record.

    Args:
        email: The bounced email address.
        bounce_type: Either ``"hard"`` or ``"soft"`` (case-insensitive).
        reason: Human-readable bounce reason from the MTA or ESP.
        credentials_path: Filesystem path to the service account JSON key.
        spreadsheet_id: The target Google Sheets spreadsheet ID.

    Returns:
        Exit code: 0 on success or ignored event, 1 on unrecoverable error.
    """
    normalised_type = bounce_type.strip().lower()
    if normalised_type not in ("hard", "soft"):
        logger.error(
            "Invalid bounce_type %r — must be 'hard' or 'soft'. Aborting.", bounce_type
        )
        return 1

    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds, cache_discovery=False)

    prospect_no = _find_prospect_by_email(service, spreadsheet_id, email)
    if prospect_no is None:
        print(f"WARNING: No prospect found for {email!r} — bounce ignored.")
        logger.info("Bounce ignored: email %r not in All Prospects tab.", email)
        return 0

    contact_status = f"BOUNCED_{normalised_type.upper()}"
    note_text = f"Bounce ({normalised_type}): {reason}"

    writer = SheetsWriter(credentials_path, spreadsheet_id)

    try:
        writer.update_field(
            prospect_no=prospect_no,
            tab_name=TAB_NAME,
            field="contact_status",
            value=contact_status,
            triggered_by=TOOL_NAME,
        )
        writer.update_field(
            prospect_no=prospect_no,
            tab_name=TAB_NAME,
            field="notes",
            value=note_text,
            triggered_by=TOOL_NAME,
        )
    except Exception as exc:
        logger.error(
            "Failed to update prospect %d for bounce event on %r: %s",
            prospect_no,
            email,
            exc,
        )
        print(f"FAIL: {exc}")
        return 1

    print(
        f"OK: Prospect {prospect_no} marked as {contact_status} (email: {email})"
    )
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    """Parse and return command-line arguments."""
    parser = argparse.ArgumentParser(
        description=(
            "Accept a bounce event and update the prospect's contact_status "
            "in Google Sheets."
        )
    )
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument(
        "--json",
        metavar="FILE",
        help="Path to a JSON file containing bounce event data.",
    )
    source.add_argument(
        "--email",
        help="Bounced email address (use with --type and --reason).",
    )
    parser.add_argument(
        "--type",
        dest="bounce_type",
        choices=["hard", "soft"],
        help="Bounce type: 'hard' or 'soft'. Required when using --email.",
    )
    parser.add_argument(
        "--reason",
        default="",
        help="Human-readable bounce reason. Optional when using --email.",
    )
    return parser.parse_args()


def load_event_from_json(json_path: str) -> tuple[str, str, str]:
    """Load and validate a bounce event from a JSON file.

    Args:
        json_path: Path to the JSON file.

    Returns:
        Tuple of (email, bounce_type, reason).

    Raises:
        SystemExit: If the file cannot be read or required keys are missing.
    """
    try:
        with open(json_path, encoding="utf-8") as fh:
            data: dict[str, str] = json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"FAIL: Cannot read JSON file {json_path!r}: {exc}")
        sys.exit(1)

    missing = [k for k in ("email", "bounce_type") if not data.get(k)]
    if missing:
        print(f"FAIL: JSON file is missing required keys: {missing}")
        sys.exit(1)

    return (
        data["email"],
        data["bounce_type"],
        data.get("reason", ""),
    )


def main() -> None:
    """Entry point for the bounce_handler CLI."""
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    args = parse_args()

    if args.json:
        email, bounce_type, reason = load_event_from_json(args.json)
    else:
        if not args.bounce_type:
            print("FAIL: --type is required when using --email.")
            sys.exit(1)
        email = args.email
        bounce_type = args.bounce_type
        reason = args.reason

    credentials_path = os.environ.get("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")

    if not credentials_path:
        print("FAIL: GOOGLE_SHEETS_CREDENTIALS not set in .env")
        sys.exit(1)
    if not spreadsheet_id:
        print("FAIL: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env")
        sys.exit(1)

    exit_code = handle_bounce(
        email=email,
        bounce_type=bounce_type,
        reason=reason,
        credentials_path=credentials_path,
        spreadsheet_id=spreadsheet_id,
    )
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
