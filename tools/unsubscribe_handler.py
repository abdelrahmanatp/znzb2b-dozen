"""unsubscribe_handler.py — Mark a prospect as UNSUBSCRIBED in Google Sheets.

Looks up the prospect by email address in the "All Prospects" tab and sets
``contact_status`` to UNSUBSCRIBED, appending a timestamped reason to the
``notes`` field.

CLI usage:
    python tools/unsubscribe_handler.py --email john@example.com
    python tools/unsubscribe_handler.py --email john@example.com --reason "Replied asking to stop"

Environment variables (resolved from .env two levels above this file):
    GOOGLE_SHEETS_CREDENTIALS       Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID    Google Sheets spreadsheet ID
"""

from __future__ import annotations

import argparse
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

TOOL_NAME = "unsubscribe_handler.py"
TAB_NAME = "All Prospects"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
# "All Prospects"!A:K — column K (index 10, 0-based) holds the email address
LOOKUP_RANGE = f"'{TAB_NAME}'!A:K"
EMAIL_COL_INDEX = 10  # K column (0-based)
PROSPECT_NO_COL_INDEX = 0  # A column (0-based)
DEFAULT_REASON = "Unsubscribe requested"

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

    Reads columns A through K from the "All Prospects" tab and performs a
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


def handle_unsubscribe(
    email: str,
    reason: str,
    credentials_path: str,
    spreadsheet_id: str,
) -> int:
    """Process an unsubscribe request and update the prospect record.

    Args:
        email: The email address requesting removal.
        reason: Human-readable reason for the unsubscribe.
        credentials_path: Filesystem path to the service account JSON key.
        spreadsheet_id: The target Google Sheets spreadsheet ID.

    Returns:
        Exit code: 0 on success or ignored event, 1 on unrecoverable error.
    """
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds, cache_discovery=False)

    prospect_no = _find_prospect_by_email(service, spreadsheet_id, email)
    if prospect_no is None:
        print(f"No prospect found for {email!r} — nothing to update.")
        logger.info("Unsubscribe ignored: email %r not in All Prospects tab.", email)
        return 0

    note_text = f"Unsubscribed. Reason: {reason}"

    writer = SheetsWriter(credentials_path, spreadsheet_id)

    try:
        writer.update_field(
            prospect_no=prospect_no,
            tab_name=TAB_NAME,
            field="contact_status",
            value="UNSUBSCRIBED",
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
            "Failed to update prospect %d for unsubscribe request on %r: %s",
            prospect_no,
            email,
            exc,
        )
        print(f"FAIL: {exc}")
        return 1

    print(f"OK: Prospect {prospect_no} ({email}) marked UNSUBSCRIBED")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    """Parse and return command-line arguments."""
    parser = argparse.ArgumentParser(
        description=(
            "Mark a prospect as UNSUBSCRIBED in Google Sheets and append a "
            "reason to their notes field."
        )
    )
    parser.add_argument(
        "--email",
        required=True,
        help="Email address of the prospect to unsubscribe.",
    )
    parser.add_argument(
        "--reason",
        default=DEFAULT_REASON,
        help=(
            f"Human-readable unsubscribe reason. "
            f"Defaults to {DEFAULT_REASON!r}."
        ),
    )
    return parser.parse_args()


def main() -> None:
    """Entry point for the unsubscribe_handler CLI."""
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    args = parse_args()

    credentials_path = os.environ.get("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")

    if not credentials_path:
        print("FAIL: GOOGLE_SHEETS_CREDENTIALS not set in .env")
        sys.exit(1)
    if not spreadsheet_id:
        print("FAIL: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env")
        sys.exit(1)

    exit_code = handle_unsubscribe(
        email=args.email,
        reason=args.reason,
        credentials_path=credentials_path,
        spreadsheet_id=spreadsheet_id,
    )
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
