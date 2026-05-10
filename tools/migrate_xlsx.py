"""migrate_xlsx.py — One-time migration tool for the ZNZB2B Dozen Lead Database.

Reads 521 prospect rows from the 'All Prospects' sheet of the source xlsx and
writes them to the Google Sheets workbook tab of the same name, appending 7
state columns with default values.

Usage:
    python tools/migrate_xlsx.py [--dry-run] [--force] [--verbose]

Environment variables (loaded from .env):
    PROSPECTS_XLSX_PATH         Path to xlsx file (default: ../Zanzibar Prospects - Consolidated.xlsx)
    GOOGLE_SHEETS_CREDENTIALS   Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID Google Sheets spreadsheet ID
    ALL_PROSPECTS_SHEET_NAME    Target tab name (default: All Prospects)
"""

import argparse
import logging
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import openpyxl
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EXPECTED_ROW_COUNT = 521
EXPECTED_HEADERS = [
    "No.",
    "Category",
    "Subcategory",
    "Company Name",
    "Trading Name",
    "Location",
    "Region",
    "Contact Person",
    "Position",
    "Phone",
    "Email",
    "Website",
    "Source",
    "Org Type (Raw)",
]
OUTPUT_HEADERS = EXPECTED_HEADERS + [
    "contact_status",
    "channel",
    "last_contacted",
    "conversation_id",
    "response_flag",
    "quote_requested",
    "notes",
]
STATE_DEFAULTS = {
    "contact_status": "NOT_CONTACTED",
    "channel": "",
    "last_contacted": "",
    "conversation_id": "",
    "response_flag": "FALSE",
    "quote_requested": "FALSE",
    "notes": "",
}
AUDIT_LOG_HEADERS = [
    "log_id",
    "timestamp",
    "prospect_no",
    "tab_name",
    "field_changed",
    "old_value",
    "new_value",
    "triggered_by_tool",
    "triggered_by_run_id",
    "notes",
]
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
MAX_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 2

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# xlsx reading
# ---------------------------------------------------------------------------


def load_xlsx_rows(xlsx_path: Path) -> list[list[Any]]:
    """Return all data rows (excluding header) from the 'All Prospects' sheet."""
    wb = openpyxl.load_workbook(xlsx_path, read_only=True, data_only=True)
    ws = wb["All Prospects"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    # rows[0] is the header row; data starts at rows[1]
    return rows


# ---------------------------------------------------------------------------
# Pre-flight validation
# ---------------------------------------------------------------------------


def validate_preflight(xlsx_path: Path, verbose: bool) -> list[list[Any]]:
    """Run all 8 pre-flight checks. Returns data rows on success, raises on failure."""
    _check(xlsx_path.exists(), f"FAIL: xlsx file not found at {xlsx_path}")
    _vprint(verbose, f"[PASS] file_exists: {xlsx_path}")

    try:
        rows = load_xlsx_rows(xlsx_path)
    except KeyError:
        print("FAIL: Sheet 'All Prospects' not found in xlsx")
        sys.exit(1)

    _vprint(verbose, "[PASS] sheet_exists: All Prospects")

    _check(len(rows) > 0, "FAIL: xlsx sheet 'All Prospects' is empty")

    # Separate header and data
    header = [str(c).strip() if c is not None else "" for c in rows[0]]
    data_rows = rows[1:]

    count = len(data_rows)
    _check(
        count == EXPECTED_ROW_COUNT,
        f"FAIL: Expected {EXPECTED_ROW_COUNT} data rows, found {count}",
    )
    _vprint(verbose, f"[PASS] row_count: {count}")

    _check(
        header == EXPECTED_HEADERS,
        f"FAIL: Header mismatch. Expected: {EXPECTED_HEADERS}. Found: {header}",
    )
    _vprint(verbose, "[PASS] header_match")

    nos = _extract_nos(data_rows)
    dups = [n for n in nos if nos.count(n) > 1]
    unique_dups = list(dict.fromkeys(dups))
    _check(not unique_dups, f"FAIL: Duplicate No. values found: {unique_dups}")
    _vprint(verbose, "[PASS] no_dup_no")

    expected_set = set(range(1, EXPECTED_ROW_COUNT + 1))
    actual_set = set(nos)
    missing = sorted(expected_set - actual_set)
    _check(not missing, f"FAIL: Gaps in No. sequence: missing values {missing}")
    _vprint(verbose, "[PASS] no_seq_gap")

    missing_company = [
        row[0]
        for row in data_rows
        if row[3] is None or str(row[3]).strip() == ""
    ]
    _check(
        not missing_company,
        f"FAIL: Rows with missing Company Name: No. {missing_company}",
    )
    _vprint(verbose, "[PASS] company_name_required")

    wrong_count = [row[0] for row in data_rows if len(row) != 14]
    _check(
        not wrong_count,
        f"FAIL: Rows with wrong field count: No. {wrong_count}",
    )
    _vprint(verbose, "[PASS] no_field_count")

    return data_rows


def _extract_nos(data_rows: list[list[Any]]) -> list[int]:
    """Extract No. values as integers from data rows."""
    result = []
    for row in data_rows:
        try:
            result.append(int(row[0]))
        except (TypeError, ValueError):
            result.append(-1)
    return result


def _check(condition: bool, message: str) -> None:
    if not condition:
        print(message)
        sys.exit(1)


def _vprint(verbose: bool, message: str) -> None:
    if verbose:
        print(message)


# ---------------------------------------------------------------------------
# Data transformation
# ---------------------------------------------------------------------------


def transform_row(raw_row: list[Any]) -> list[Any]:
    """Apply all transformation rules to one data row, returning 21-column output row."""
    fields = list(raw_row) + [None] * max(0, 14 - len(raw_row))

    no_val = int(fields[0])  # No. — integer
    text_fields = [_to_str(fields[i]) for i in range(1, 14)]

    # Email: strip + lowercase (index 10 in original, index 9 in text_fields slice)
    email_idx = 9  # position within text_fields (original column index 10 - 1 offset)
    text_fields[email_idx] = text_fields[email_idx].lower()

    # Phone is at index 8 in text_fields (original column index 9 - 1 offset)
    # Retained as-is from _to_str — no normalization needed.

    row: list[Any] = [no_val] + text_fields + list(STATE_DEFAULTS.values())
    return row


def _to_str(value: Any) -> str:
    """Convert xlsx cell value to a stripped string; None becomes empty string."""
    if value is None:
        return ""
    return str(value).strip()


# ---------------------------------------------------------------------------
# Sheets API helpers
# ---------------------------------------------------------------------------


def build_service(credentials_path: str):
    """Build and return an authenticated Sheets API service."""
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _api_call_with_backoff(call_fn, description: str) -> Any:
    """Execute a Sheets API call with exponential backoff on rate limit errors."""
    delay = INITIAL_BACKOFF_SECONDS
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return call_fn()
        except HttpError as e:
            if e.resp.status == 429 and attempt < MAX_RETRIES:
                logger.warning(
                    "Rate limit hit on %s (attempt %d/%d). Retrying in %ds.",
                    description,
                    attempt,
                    MAX_RETRIES,
                    delay,
                )
                time.sleep(delay)
                delay *= 2
            else:
                raise
    raise RuntimeError(
        f"FAIL: Sheets API rate limit exceeded after {MAX_RETRIES} retries on {description}"
    )


def read_sheet_values(service, spreadsheet_id: str, range_name: str) -> list[list[Any]]:
    """Read values from a sheet range."""
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    return result.get("values", [])


def clear_sheet(service, spreadsheet_id: str, sheet_name: str) -> None:
    """Clear all content from a sheet tab."""
    service.spreadsheets().values().clear(
        spreadsheetId=spreadsheet_id, range=sheet_name, body={}
    ).execute()
    logger.info("Cleared sheet: %s", sheet_name)


# ---------------------------------------------------------------------------
# Idempotency check
# ---------------------------------------------------------------------------


def check_existing_state(
    service, spreadsheet_id: str, sheet_name: str, verbose: bool
) -> str:
    """
    Return one of: 'empty', 'complete', 'partial'.
    'complete' means 521 data rows already present with correct No. sequence.
    """
    values = read_sheet_values(service, spreadsheet_id, f"'{sheet_name}'!A:A")
    # values[0] would be the header row if present
    data_count = max(0, len(values) - 1)
    _vprint(verbose, f"Existing row count (data only): {data_count}")

    if data_count == 0:
        return "empty"

    if data_count == EXPECTED_ROW_COUNT:
        nos = [int(row[0]) for row in values[1:] if row and row[0]]
        if sorted(nos) == list(range(1, EXPECTED_ROW_COUNT + 1)):
            return "complete"

    return "partial"


# ---------------------------------------------------------------------------
# Write to Sheets
# ---------------------------------------------------------------------------


def write_all_rows(
    service,
    spreadsheet_id: str,
    sheet_name: str,
    data_rows: list[list[Any]],
    verbose: bool,
) -> None:
    """
    Write header + all 521 data rows to the sheet in a single batch.

    Uses USER_ENTERED for the No. column so it stores as a numeric type.
    Uses RAW for all other columns to prevent auto-parsing.
    We achieve this by writing the whole sheet as USER_ENTERED but ensuring
    phone values are prefixed with ' to force string interpretation —
    except the spec says to use stringValue via the API.

    Strategy: write everything with USER_ENTERED. For the Phone column (index J,
    column 10 in 1-based), use batchUpdate with userEnteredValue.stringValue to
    force string type and prevent Sheets from coercing phone strings to numbers.
    All other columns write via values.update with USER_ENTERED.
    """
    all_rows: list[list[Any]] = [OUTPUT_HEADERS]
    for raw_row in data_rows:
        all_rows.append(transform_row(list(raw_row)))

    target_range = f"'{sheet_name}'!A1:U{len(all_rows)}"

    _vprint(verbose, f"Writing {len(all_rows)} rows to {target_range} ...")

    # Build payload: serialize each row for the Sheets API.
    # Phone is column index 9 (0-based in data columns, overall column J = index 9 in output).
    # We use a batchUpdate with userEnteredValue.stringValue for phone cells
    # to prevent Sheets from interpreting values like "0773 123456 / 0778 123456" as numbers.
    # All other cells go through values.update with USER_ENTERED.
    _write_values_update(service, spreadsheet_id, target_range, all_rows)
    _fix_phone_column_as_strings(
        service, spreadsheet_id, sheet_name, all_rows
    )

    _vprint(verbose, "Write complete.")


def _write_values_update(service, spreadsheet_id: str, range_name: str, rows: list[list[Any]]) -> None:
    """Write all rows using values.update with USER_ENTERED."""
    # Convert all values to string for RAW write safety, except No. (keep int)
    serialized = []
    for row in rows:
        serialized_row = []
        for i, cell in enumerate(row):
            if i == 0 and isinstance(cell, int):
                serialized_row.append(cell)
            else:
                serialized_row.append("" if cell is None else str(cell))
        serialized.append(serialized_row)

    body = {"values": serialized}
    _api_call_with_backoff(
        lambda: service.spreadsheets()
        .values()
        .update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption="USER_ENTERED",
            body=body,
        )
        .execute(),
        description="values.update",
    )


def _fix_phone_column_as_strings(
    service, spreadsheet_id: str, sheet_name: str, all_rows: list[list[Any]]
) -> None:
    """
    Overwrite the Phone column (J = column index 9, 1-based column 10) for all
    data rows using batchUpdate with userEnteredValue.stringValue.

    This forces Sheets to treat each phone value as a string literal, preventing
    coercion of values like "0773 502 076 / 0778 123456" into numbers or dates.
    """
    sheet_id = _get_sheet_id(service, spreadsheet_id, sheet_name)
    requests = []
    # Data starts at row index 1 (0-based) — row index 0 is the header
    for row_idx, row in enumerate(all_rows[1:], start=1):
        phone_val = str(row[9]) if row[9] is not None else ""
        requests.append(
            {
                "updateCells": {
                    "rows": [
                        {
                            "values": [
                                {
                                    "userEnteredValue": {"stringValue": phone_val}
                                }
                            ]
                        }
                    ],
                    "fields": "userEnteredValue",
                    "start": {
                        "sheetId": sheet_id,
                        "rowIndex": row_idx,
                        "columnIndex": 9,  # 0-based column J
                    },
                }
            }
        )

    if not requests:
        return

    _api_call_with_backoff(
        lambda: service.spreadsheets()
        .batchUpdate(spreadsheetId=spreadsheet_id, body={"requests": requests})
        .execute(),
        description="batchUpdate phone column",
    )


def _get_sheet_id(service, spreadsheet_id: str, sheet_name: str) -> int:
    """Return the sheetId integer for a named tab."""
    metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    for sheet in metadata.get("sheets", []):
        props = sheet.get("properties", {})
        if props.get("title") == sheet_name:
            return props["sheetId"]
    raise ValueError(f"Sheet '{sheet_name}' not found in spreadsheet.")


# ---------------------------------------------------------------------------
# Post-write validation
# ---------------------------------------------------------------------------


def validate_postwrite(
    service, spreadsheet_id: str, sheet_name: str, verbose: bool
) -> None:
    """Run all 5 post-write checks. Prints failure details and exits on failure."""
    all_values = read_sheet_values(service, spreadsheet_id, f"'{sheet_name}'!A1:U522")
    total_rows = len(all_values)

    failed = False

    if total_rows != EXPECTED_ROW_COUNT + 1:
        print(f"POST-WRITE FAIL: Expected 522 rows in Sheets, found {total_rows}")
        failed = True
    else:
        _vprint(verbose, "[PASS] sheets_row_count: 522")

    if not failed:
        first_no = all_values[1][0] if len(all_values) > 1 else None
        last_no = all_values[521][0] if len(all_values) > 521 else None
        if str(first_no) != "1" or str(last_no) != "521":
            print(
                f"POST-WRITE FAIL: First or last No. value incorrect "
                f"(first={first_no}, last={last_no})"
            )
            failed = True
        else:
            _vprint(verbose, "[PASS] spot_check_no: first=1, last=521")

    status_col_idx = OUTPUT_HEADERS.index("contact_status")
    bad_status = [
        row[0]
        for row in all_values[1:]
        if len(row) > status_col_idx and row[status_col_idx] != "NOT_CONTACTED"
    ]
    if bad_status:
        print(
            f"POST-WRITE FAIL: Unexpected contact_status values found in rows: {bad_status}"
        )
        failed = True
    else:
        _vprint(verbose, "[PASS] spot_check_status: all NOT_CONTACTED")

    resp_idx = OUTPUT_HEADERS.index("response_flag")
    quote_idx = OUTPUT_HEADERS.index("quote_requested")
    bad_flags = [
        row[0]
        for row in all_values[1:]
        if len(row) > quote_idx
        and (row[resp_idx] != "FALSE" or row[quote_idx] != "FALSE")
    ]
    if bad_flags:
        print(
            f"POST-WRITE FAIL: Unexpected boolean default values found in rows: {bad_flags}"
        )
        failed = True
    else:
        _vprint(verbose, "[PASS] spot_check_flags: all FALSE")

    actual_header = all_values[0] if all_values else []
    if actual_header != OUTPUT_HEADERS:
        print(
            f"POST-WRITE FAIL: Header row mismatch in Sheets.\n"
            f"  Expected: {OUTPUT_HEADERS}\n"
            f"  Found:    {actual_header}"
        )
        failed = True
    else:
        _vprint(verbose, "[PASS] header_row: matches expected 21-column header")

    if failed:
        sys.exit(1)


# ---------------------------------------------------------------------------
# Audit Log
# ---------------------------------------------------------------------------


def ensure_audit_log_tab(service, spreadsheet_id: str) -> None:
    """Create Audit Log tab with headers if it does not already exist."""
    metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    existing_titles = [
        s["properties"]["title"] for s in metadata.get("sheets", [])
    ]
    if "Audit Log" in existing_titles:
        return

    service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id,
        body={"requests": [{"addSheet": {"properties": {"title": "Audit Log"}}}]},
    ).execute()

    service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="Audit Log!A1",
        valueInputOption="RAW",
        body={"values": [AUDIT_LOG_HEADERS]},
    ).execute()
    logger.info("Created Audit Log tab with headers.")


def append_migration_audit_entry(
    service, spreadsheet_id: str, run_id: str
) -> None:
    """Append the single bulk migration audit entry to the Audit Log tab."""
    ensure_audit_log_tab(service, spreadsheet_id)
    entry = [
        str(uuid.uuid4()),
        datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        0,
        "All Prospects",
        "MIGRATION",
        "BLANK",
        "521 rows written",
        "migrate_xlsx.py",
        run_id,
        "Initial migration from Zanzibar Prospects - Consolidated.xlsx. Row count: 521.",
    ]
    service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range="Audit Log!A1",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body={"values": [entry]},
    ).execute()
    logger.info("Audit Log entry appended.")


# ---------------------------------------------------------------------------
# Dry-run output
# ---------------------------------------------------------------------------


def print_dry_run_summary(data_rows: list[list[Any]]) -> None:
    """Print what would be written without touching Sheets."""
    print(f"\nRows that would be written: {EXPECTED_ROW_COUNT}")
    print(f"Column headers: {OUTPUT_HEADERS}\n")
    print("First 3 data rows (after transformation):")
    for raw in data_rows[:3]:
        print(" ", transform_row(list(raw)))
    print("\nLast 3 data rows (after transformation):")
    for raw in data_rows[-3:]:
        print(" ", transform_row(list(raw)))
    print("\nState column defaults that would be applied:")
    for col, val in STATE_DEFAULTS.items():
        display = repr(val) if val == "" else val
        print(f"  {col}: {display}")
    print("\nDRY RUN COMPLETE — no data was written.")


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Migrate Zanzibar Prospects xlsx to Google Sheets."
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    args = parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )

    tools_dir = Path(__file__).parent
    default_xlsx = tools_dir / ".." / "Zanzibar Prospects - Consolidated.xlsx"
    xlsx_path = Path(os.getenv("PROSPECTS_XLSX_PATH", str(default_xlsx))).resolve()

    data_rows = validate_preflight(xlsx_path, args.verbose)

    if args.dry_run:
        print_dry_run_summary(data_rows)
        sys.exit(0)

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

    existing = check_existing_state(service, spreadsheet_id, sheet_name, args.verbose)

    if existing == "complete" and not args.force:
        print(
            f"All Prospects tab already populated with {EXPECTED_ROW_COUNT} rows. "
            "Migration already complete. Use --force to re-run."
        )
        sys.exit(0)

    if existing == "partial" and not args.force:
        existing_count = len(
            read_sheet_values(service, spreadsheet_id, f"'{sheet_name}'!A:A")
        ) - 1
        print(
            f"WARN: Partial data found ({existing_count} rows). "
            "This may indicate a previous failed run. Use --force to overwrite."
        )
        sys.exit(1)

    if args.force and existing != "empty":
        print("--force: clearing existing data before re-migration.")
        clear_sheet(service, spreadsheet_id, sheet_name)

    run_id = str(uuid.uuid4())
    write_all_rows(service, spreadsheet_id, sheet_name, data_rows, args.verbose)
    validate_postwrite(service, spreadsheet_id, sheet_name, args.verbose)
    append_migration_audit_entry(service, spreadsheet_id, run_id)
    print(f"Migration complete. Run ID: {run_id}")


if __name__ == "__main__":
    main()
