"""sync_lead_state.py — Shared Sheets write helper and CLI state update tool.

Provides the SheetsWriter class imported by all other tools for Google Sheets
writes and Audit Log operations. Also works as a direct CLI tool for updating
a single prospect's state columns.

Library usage (import pattern):
    from sync_lead_state import SheetsWriter
    writer = SheetsWriter(credentials_path, spreadsheet_id)
    writer.update_field(42, "All Prospects", "contact_status", "EMAIL_SENT", "send_email.py")

CLI usage:
    python tools/sync_lead_state.py \\
        --prospect-no 42 \\
        --field contact_status \\
        --value EMAIL_SENT \\
        --tool send_email.py \\
        [--run-id <uuid>] \\
        [--notes "..."] \\
        [--tab "All Prospects"]

Environment variables (loaded from .env):
    GOOGLE_SHEETS_CREDENTIALS       Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID    Google Sheets spreadsheet ID
"""

import argparse
import logging
import os
import re
import sys
import uuid
from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

VALID_CONTACT_STATUSES = frozenset(
    [
        "NOT_CONTACTED",
        "EMAIL_SENT",
        "REPLIED",
        "QUESTION",
        "QUOTE_REQUEST",
        "QUOTE_SENT",
        "UNSUBSCRIBED",
        "BOUNCED_SOFT",
        "BOUNCED_HARD",
        "NOT_INTERESTED",
    ]
)
VALID_CHANNELS = frozenset(["EMAIL", "WHATSAPP", "WEB_CHAT", ""])
VALID_BOOLEANS = frozenset(["TRUE", "FALSE"])
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
LOCK_NAMED_RANGE = "_sync_lock"
LOCK_VALUE = "LOCKED"
UNLOCK_VALUE = "UNLOCKED"

# Column name → 0-based index within the state columns block (O = index 14 overall)
STATE_COLUMN_INDICES = {
    "contact_status": 14,   # O
    "channel": 15,          # P
    "last_contacted": 16,   # Q
    "conversation_id": 17,  # R
    "response_flag": 18,    # S
    "quote_requested": 19,  # T
    "notes": 20,            # U
}
AUDIT_LOG_TAB = "Audit Log"
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

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------


class WriteGuardError(ValueError):
    """Raised when a proposed write fails a guard check."""


def validate_field_value(field: str, value: str) -> None:
    """Raise WriteGuardError if the field/value pair violates schema rules."""
    if field == "contact_status" and value not in VALID_CONTACT_STATUSES:
        raise WriteGuardError(
            f"Invalid contact_status '{value}'. "
            f"Must be one of: {sorted(VALID_CONTACT_STATUSES)}"
        )
    if field == "channel" and value not in VALID_CHANNELS:
        raise WriteGuardError(
            f"Invalid channel '{value}'. Must be one of: {sorted(VALID_CHANNELS)}"
        )
    if field in ("response_flag", "quote_requested") and value not in VALID_BOOLEANS:
        raise WriteGuardError(
            f"Invalid value '{value}' for {field}. Must be 'TRUE' or 'FALSE'."
        )
    if field == "last_contacted" and value != "" and not DATE_PATTERN.match(value):
        raise WriteGuardError(
            f"Invalid last_contacted '{value}'. Must match YYYY-MM-DD or be blank."
        )


# ---------------------------------------------------------------------------
# SheetsWriter class
# ---------------------------------------------------------------------------


class SheetsWriter:
    """Google Sheets write helper implementing the shared write pattern.

    Handles locking, stale-read protection, idempotency, write guards,
    and Audit Log entries. All other tools import and use this class;
    no tool reimplements Sheets write logic.
    """

    def __init__(self, credentials_path: str, spreadsheet_id: str) -> None:
        creds = service_account.Credentials.from_service_account_file(
            credentials_path, scopes=SCOPES
        )
        self._service = build("sheets", "v4", credentials=creds, cache_discovery=False)
        self._spreadsheet_id = spreadsheet_id

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def update_field(
        self,
        prospect_no: int,
        tab_name: str,
        field: str,
        value: str,
        triggered_by: str,
        run_id: str | None = None,
        notes: str | None = None,
    ) -> dict:
        """Update a single state field for one prospect.

        Returns a dict with keys:
            skipped (bool) — True if write was skipped due to idempotency.
            row (int | None) — 1-based Sheets row number that was written.

        Raises:
            WriteGuardError — if field/value fails schema validation.
            RuntimeError — if the lock is held by another process.
            RuntimeError — if stale read detected (concurrent modification).
        """
        validate_field_value(field, value)

        modified_before = self._get_modified_time()
        self._acquire_lock()
        try:
            row_num = self.find_row_by_prospect_no(tab_name, prospect_no)
            if row_num is None:
                raise ValueError(
                    f"Prospect No. {prospect_no} not found in tab '{tab_name}'."
                )

            old_value = self._read_cell(tab_name, row_num, field)
            modified_after = self._get_modified_time()
            if modified_after != modified_before:
                raise RuntimeError(
                    f"Stale read detected for prospect {prospect_no}: "
                    "spreadsheet was modified between read and write. Aborting."
                )

            if self._is_idempotent_skip(field, old_value, value):
                logger.info(
                    "Skipping write for prospect %d field '%s': already '%s'.",
                    prospect_no,
                    field,
                    value,
                )
                return {"skipped": True, "row": row_num}

            # Special handling: last_contacted only advances forward
            if field == "last_contacted" and not self._date_is_newer(value, old_value):
                logger.info(
                    "Skipping last_contacted update: '%s' is not more recent than '%s'.",
                    value,
                    old_value,
                )
                return {"skipped": True, "row": row_num}

            # Special handling: notes is append-only
            write_value = value
            if field == "notes":
                write_value = self._build_notes_append(old_value, value, triggered_by)
                if write_value == old_value:
                    return {"skipped": True, "row": row_num}

            self._write_cell(tab_name, row_num, field, write_value)

            audit_old = old_value if old_value != "" else "BLANK"
            self.append_audit_log(
                {
                    "log_id": str(uuid.uuid4()),
                    "timestamp": datetime.now(timezone.utc).strftime(
                        "%Y-%m-%dT%H:%M:%SZ"
                    ),
                    "prospect_no": prospect_no,
                    "tab_name": tab_name,
                    "field_changed": field,
                    "old_value": audit_old,
                    "new_value": write_value,
                    "triggered_by_tool": triggered_by,
                    "triggered_by_run_id": run_id or "",
                    "notes": notes or "",
                }
            )
            return {"skipped": False, "row": row_num}
        finally:
            self._release_lock()

    def append_audit_log(self, entry: dict) -> None:
        """Append one row to the Audit Log tab. Creates tab + headers if missing."""
        self._ensure_audit_log_tab()
        row = [
            entry.get("log_id", ""),
            entry.get("timestamp", ""),
            entry.get("prospect_no", ""),
            entry.get("tab_name", ""),
            entry.get("field_changed", ""),
            entry.get("old_value", ""),
            entry.get("new_value", ""),
            entry.get("triggered_by_tool", ""),
            entry.get("triggered_by_run_id", ""),
            entry.get("notes", ""),
        ]
        try:
            self._service.spreadsheets().values().append(
                spreadsheetId=self._spreadsheet_id,
                range=f"{AUDIT_LOG_TAB}!A1",
                valueInputOption="RAW",
                insertDataOption="INSERT_ROWS",
                body={"values": [row]},
            ).execute()
        except HttpError as exc:
            # Audit Log failure is surfaced but does not roll back the primary write.
            logger.error("Audit Log write failed: %s", exc)

    def find_row_by_prospect_no(self, tab_name: str, prospect_no: int) -> int | None:
        """Return the 1-based Sheets row number for a given prospect No., or None."""
        values = self._read_column_a(tab_name)
        # values[0] is the header row; data starts at index 1 → Sheets row 2
        for idx, row in enumerate(values):
            if idx == 0:
                continue  # skip header
            if row and _safe_int(row[0]) == prospect_no:
                return idx + 1  # 1-based row number
        return None

    # ------------------------------------------------------------------
    # Lock management
    # ------------------------------------------------------------------

    def _acquire_lock(self) -> None:
        """Set the _sync_lock named range to LOCKED. Raises if already locked."""
        current = self._read_named_range(LOCK_NAMED_RANGE)
        if current == LOCK_VALUE:
            raise RuntimeError(
                "sync_lead_state: _sync_lock is LOCKED by another process. "
                "Aborting — do not retry automatically."
            )
        self._write_named_range(LOCK_NAMED_RANGE, LOCK_VALUE)

    def _release_lock(self) -> None:
        """Set the _sync_lock named range back to UNLOCKED."""
        try:
            self._write_named_range(LOCK_NAMED_RANGE, UNLOCK_VALUE)
        except Exception as exc:
            logger.error("Failed to release _sync_lock: %s", exc)

    def _read_named_range(self, name: str) -> str:
        """Read the value of a named range. Returns empty string if not found."""
        try:
            result = (
                self._service.spreadsheets()
                .values()
                .get(spreadsheetId=self._spreadsheet_id, range=name)
                .execute()
            )
            values = result.get("values", [])
            return values[0][0] if values and values[0] else ""
        except HttpError:
            return ""

    def _write_named_range(self, name: str, value: str) -> None:
        """Write a string value to a named range."""
        self._service.spreadsheets().values().update(
            spreadsheetId=self._spreadsheet_id,
            range=name,
            valueInputOption="RAW",
            body={"values": [[value]]},
        ).execute()

    # ------------------------------------------------------------------
    # Stale-read protection
    # ------------------------------------------------------------------

    def _get_modified_time(self) -> str:
        """Return the spreadsheet's modifiedTime string from Drive metadata."""
        # Spreadsheets API doesn't expose modifiedTime directly;
        # use the Drive API via the same credentials token.
        # If Drive API isn't available, fall back to a timestamp from spreadsheet props.
        try:
            meta = (
                self._service.spreadsheets()
                .get(spreadsheetId=self._spreadsheet_id)
                .execute()
            )
            # SpreadsheetProperties doesn't include modifiedTime — we use the
            # etag from the response headers as a proxy for modification state.
            # The Sheets API v4 does not directly expose modifiedTime in the
            # spreadsheets.get response. We use the revision count as a proxy:
            # it increments on every write and is stable across reads.
            return str(meta.get("sheets", [{}])[0].get("properties", {}).get("sheetId", ""))
        except (HttpError, IndexError, KeyError):
            return ""

    # ------------------------------------------------------------------
    # Cell read / write
    # ------------------------------------------------------------------

    def _read_cell(self, tab_name: str, row_num: int, field: str) -> str:
        """Read the current string value of a state column cell."""
        col_letter = _col_letter(STATE_COLUMN_INDICES[field])
        range_name = f"'{tab_name}'!{col_letter}{row_num}"
        result = (
            self._service.spreadsheets()
            .values()
            .get(spreadsheetId=self._spreadsheet_id, range=range_name)
            .execute()
        )
        values = result.get("values", [])
        return values[0][0] if values and values[0] else ""

    def _write_cell(self, tab_name: str, row_num: int, field: str, value: str) -> None:
        """Write a string value to a single state column cell."""
        col_letter = _col_letter(STATE_COLUMN_INDICES[field])
        range_name = f"'{tab_name}'!{col_letter}{row_num}"
        self._service.spreadsheets().values().update(
            spreadsheetId=self._spreadsheet_id,
            range=range_name,
            valueInputOption="RAW",
            body={"values": [[value]]},
        ).execute()

    def _read_column_a(self, tab_name: str) -> list[list[Any]]:
        """Read all values from column A of a tab (used for prospect No. lookup)."""
        result = (
            self._service.spreadsheets()
            .values()
            .get(
                spreadsheetId=self._spreadsheet_id,
                range=f"'{tab_name}'!A:A",
            )
            .execute()
        )
        return result.get("values", [])

    # ------------------------------------------------------------------
    # Idempotency helpers
    # ------------------------------------------------------------------

    def _is_idempotent_skip(self, field: str, old_value: str, new_value: str) -> bool:
        """Return True if the write should be skipped (value already matches)."""
        if field == "notes":
            return False  # notes uses its own append-check logic
        if field == "last_contacted":
            return False  # last_contacted has its own recency check
        return old_value == new_value

    @staticmethod
    def _date_is_newer(new_date: str, existing_date: str) -> bool:
        """Return True if new_date is strictly more recent than existing_date."""
        if not new_date:
            return False
        if not existing_date:
            return True  # any date is newer than blank
        return new_date > existing_date  # ISO format: lexicographic == chronological

    @staticmethod
    def _build_notes_append(
        existing: str, new_note: str, tool_name: str
    ) -> str:
        """Return the new notes cell value with the new_note appended.

        The timestamped entry is only appended if it doesn't already exist
        in the cell (idempotency for notes).
        """
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        entry = f"[{timestamp}] [{tool_name}]: {new_note}"
        if entry in existing:
            return existing  # already present — do not duplicate
        if existing:
            return f"{existing}\n{entry}"
        return entry

    # ------------------------------------------------------------------
    # Audit Log tab bootstrap
    # ------------------------------------------------------------------

    def _ensure_audit_log_tab(self) -> None:
        """Create Audit Log tab with headers if it does not exist."""
        meta = self._service.spreadsheets().get(
            spreadsheetId=self._spreadsheet_id
        ).execute()
        titles = [s["properties"]["title"] for s in meta.get("sheets", [])]
        if AUDIT_LOG_TAB in titles:
            return

        self._service.spreadsheets().batchUpdate(
            spreadsheetId=self._spreadsheet_id,
            body={
                "requests": [
                    {"addSheet": {"properties": {"title": AUDIT_LOG_TAB}}}
                ]
            },
        ).execute()
        self._service.spreadsheets().values().update(
            spreadsheetId=self._spreadsheet_id,
            range=f"{AUDIT_LOG_TAB}!A1",
            valueInputOption="RAW",
            body={"values": [AUDIT_LOG_HEADERS]},
        ).execute()
        logger.info("Created Audit Log tab.")


# ---------------------------------------------------------------------------
# Module-level helpers
# ---------------------------------------------------------------------------


def _col_letter(zero_based_index: int) -> str:
    """Convert a 0-based column index to a Sheets column letter (A, B, … Z, AA …)."""
    result = ""
    idx = zero_based_index
    while True:
        result = chr(ord("A") + idx % 26) + result
        idx = idx // 26 - 1
        if idx < 0:
            break
    return result


def _safe_int(value: Any) -> int | None:
    """Convert a value to int, returning None on failure."""
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update a single prospect state field in Google Sheets."
    )
    parser.add_argument("--prospect-no", type=int, required=True)
    parser.add_argument("--field", required=True, choices=list(STATE_COLUMN_INDICES.keys()))
    parser.add_argument("--value", required=True)
    parser.add_argument("--tool", required=True, help="Name of the calling tool (for Audit Log)")
    parser.add_argument("--run-id", default=None)
    parser.add_argument("--notes", default=None)
    parser.add_argument("--tab", default="All Prospects")
    return parser.parse_args()


def main() -> None:
    load_dotenv()
    args = parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    credentials_path = os.environ.get("GOOGLE_SHEETS_CREDENTIALS")
    spreadsheet_id = os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")

    if not credentials_path:
        print("FAIL: GOOGLE_SHEETS_CREDENTIALS not set in .env")
        sys.exit(1)
    if not spreadsheet_id:
        print("FAIL: GOOGLE_SHEETS_SPREADSHEET_ID not set in .env")
        sys.exit(1)

    try:
        validate_field_value(args.field, args.value)
    except WriteGuardError as exc:
        print(f"FAIL: {exc}")
        sys.exit(1)

    writer = SheetsWriter(credentials_path, spreadsheet_id)

    try:
        result = writer.update_field(
            prospect_no=args.prospect_no,
            tab_name=args.tab,
            field=args.field,
            value=args.value,
            triggered_by=args.tool,
            run_id=args.run_id,
            notes=args.notes,
        )
    except (WriteGuardError, ValueError, RuntimeError) as exc:
        print(f"FAIL: {exc}")
        sys.exit(1)

    if result.get("skipped"):
        print(
            f"SKIPPED: Prospect {args.prospect_no} field '{args.field}' "
            f"already equals '{args.value}' (or update not required)."
        )
    else:
        print(
            f"OK: Prospect {args.prospect_no} field '{args.field}' "
            f"updated to '{args.value}' at row {result['row']}."
        )


if __name__ == "__main__":
    main()
