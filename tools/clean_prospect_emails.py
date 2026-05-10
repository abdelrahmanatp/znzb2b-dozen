"""clean_prospect_emails.py — Clean multi-email cells in All Prospects!K column.

Reads email column (K), detects multi-email / annotated cells, extracts the
best single email address, and writes cleaned values back.

Preference order for extraction:
  1. Addresses containing known professional prefixes (gm@, director@, sales@,
     reservations@, info@, procurement@, purchasing@, manager@, admin@)
  2. First valid email that is not a gmail.com / yahoo.com / hotmail.com address
  3. Any valid email address found

Usage:
    python tools/clean_prospect_emails.py [--dry-run]
"""

import argparse
import logging
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv(Path(__file__).parent.parent / ".env")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SHEET_NAME = "All Prospects"
EMAIL_COL = "K"        # 0-indexed: 10
HEADER_ROW = 1         # row index 0 (1-based row 1) is header
DATA_START_ROW = 2     # 1-based

# Regex: matches a plausible email token
_EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

PROFESSIONAL_PREFIXES = (
    "gm@", "director@", "sales@", "reservations@", "info@",
    "procurement@", "purchasing@", "manager@", "admin@", "booking@",
    "reception@", "revenue@", "operations@",
)
WEBMAIL_DOMAINS = ("gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com")

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)


def _build_service():
    creds_path = os.getenv("GOOGLE_SHEETS_CREDENTIALS")
    if not creds_path:
        sys.exit("GOOGLE_SHEETS_CREDENTIALS not set")
    creds = service_account.Credentials.from_service_account_file(
        creds_path, scopes=SCOPES
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _best_email(candidates: list[str]) -> str | None:
    """Pick the best email from a list using preference rules."""
    if not candidates:
        return None
    # 1. Professional prefix match
    for e in candidates:
        el = e.lower()
        if any(el.startswith(p) or ("@" in el and el.split("@")[0] + "@" in PROFESSIONAL_PREFIXES) for p in PROFESSIONAL_PREFIXES):
            # more precise check
            local = el.split("@")[0] + "@"
            if any(local == p for p in PROFESSIONAL_PREFIXES):
                return e
    # Re-check: prefix anywhere before the @
    for e in candidates:
        el = e.lower()
        for p in PROFESSIONAL_PREFIXES:
            if el.startswith(p.rstrip("@")):
                return e
    # 2. Non-webmail
    for e in candidates:
        domain = e.lower().split("@")[-1]
        if domain not in WEBMAIL_DOMAINS:
            return e
    # 3. Any
    return candidates[0]


def _extract_email(raw: str) -> str | None:
    """Extract best single email from a possibly messy cell value."""
    if not raw or not raw.strip():
        return None
    # Remove annotation fragments like "(false email)", "email failed to deliver"
    cleaned = re.sub(r"\(.*?\)", "", raw)
    candidates = _EMAIL_RE.findall(cleaned)
    if not candidates:
        # Try on original (annotation might contain the only email)
        candidates = _EMAIL_RE.findall(raw)
    return _best_email(candidates)


def _is_valid_single(raw: str) -> bool:
    """True if cell already contains exactly one clean email with no extras."""
    if not raw:
        return False
    raw = raw.strip()
    emails = _EMAIL_RE.findall(raw)
    if len(emails) != 1:
        return False
    # The cell should basically BE the email (allow minor trailing/leading noise)
    return emails[0].lower() == raw.lower() or raw.lower().strip() == emails[0].lower()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print changes, don't write")
    args = parser.parse_args()

    spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID")
    if not spreadsheet_id:
        sys.exit("GOOGLE_SHEETS_SPREADSHEET_ID not set")

    service = _build_service()
    sheets = service.spreadsheets()

    range_notation = f"'{SHEET_NAME}'!{EMAIL_COL}:{EMAIL_COL}"
    log.info("Reading %s …", range_notation)
    result = sheets.values().get(spreadsheetId=spreadsheet_id, range=range_notation).execute()
    rows = result.get("values", [])

    updates = []
    skipped_false = []
    already_valid = 0
    missing = 0

    for i, row in enumerate(rows):
        row_num = i + 1  # 1-based
        if row_num == 1:  # header
            continue

        raw = row[0].strip() if row else ""

        # Explicitly tagged as undeliverable — clear to empty
        if re.search(r"(false\s*email|email\s*failed|undeliverable)", raw, re.I):
            skipped_false.append(row_num)
            if not args.dry_run:
                updates.append({
                    "range": f"'{SHEET_NAME}'!{EMAIL_COL}{row_num}",
                    "values": [[""]],
                })
            log.info("ROW %d  CLEAR (false/undeliverable): %r", row_num, raw)
            continue

        if not raw:
            missing += 1
            continue

        if _is_valid_single(raw):
            already_valid += 1
            continue

        # Needs cleaning
        best = _extract_email(raw)
        if best:
            log.info("ROW %d  CLEAN: %r  →  %r", row_num, raw, best)
            updates.append({
                "range": f"'{SHEET_NAME}'!{EMAIL_COL}{row_num}",
                "values": [[best]],
            })
        else:
            log.warning("ROW %d  NO EMAIL FOUND in: %r — leaving as-is", row_num, raw)

    log.info("")
    log.info("=== Summary ===")
    log.info("Already valid:          %d", already_valid)
    log.info("To clean (write back):  %d", len([u for u in updates if u["values"] != [[""]]]))
    log.info("To clear (false/undeliv): %d", len(skipped_false))
    log.info("Missing entirely:       %d", missing)
    log.info("Total update calls:     %d", len(updates))

    if not updates:
        log.info("Nothing to write.")
        return

    if args.dry_run:
        log.info("DRY RUN — no writes executed.")
        return

    body = {"valueInputOption": "RAW", "data": updates}
    try:
        resp = sheets.values().batchUpdate(spreadsheetId=spreadsheet_id, body=body).execute()
        log.info("batchUpdate OK — %d cells updated.", resp.get("totalUpdatedCells", "?"))
    except HttpError as e:
        log.error("Sheets API error: %s", e)
        sys.exit(1)

    log.info("Done.")


if __name__ == "__main__":
    main()
