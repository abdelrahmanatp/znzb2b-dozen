"""send_email.py — Cold email outreach tool for Dozen Hotel Supplies.

Reads NOT_CONTACTED prospects from the Google Sheets "All Prospects" tab,
renders a segment-appropriate Jinja2 template, and sends via SMTP. Updates
each prospect's state columns on successful send.

Must be run after deduplicate_leads.py has confirmed no problematic duplicates.

CLI usage:
    python tools/send_email.py [--dry-run] [--limit N] [--segment SEGMENT]
                               [--prospect-no N] [--verbose]

Environment variables (loaded from .env two levels above tools/):
    GOOGLE_SHEETS_CREDENTIALS        Path to service account JSON key file
    GOOGLE_SHEETS_SPREADSHEET_ID     Google Sheets spreadsheet ID
    SMTP_HOST
    SMTP_PORT                        Integer (465 = SSL, anything else = STARTTLS)
    SMTP_USER
    SMTP_PASS
    EMAIL_FROM_ADDRESS               e.g. outreach@dozensupplies.com
    EMAIL_FROM_NAME                  e.g. Dozen Hotel Supplies
    NEXT_PUBLIC_APP_URL              e.g. https://dozensupplies.com
    UNSUBSCRIBE_SECRET               HMAC key (default: dozen-unsub-secret)
    DAILY_SEND_LIMIT                 Integer (default: 20)
"""

from __future__ import annotations

import argparse
import hmac
import logging
import os
import re as _re
import smtplib
import sys
import urllib.parse
import uuid
from datetime import date, datetime, timezone
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from jinja2 import Environment, FileSystemLoader, StrictUndefined

# ---------------------------------------------------------------------------
# Bootstrap — load .env from project root (two levels above tools/)
# ---------------------------------------------------------------------------

_TOOLS_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _TOOLS_DIR.parent
load_dotenv(_PROJECT_ROOT / ".env")

# ---------------------------------------------------------------------------
# Header injection guard
# ---------------------------------------------------------------------------

_HEADER_INJECTION_RE = _re.compile(r"[\r\n]")


def _sanitize_header(value: str, max_len: int = 200) -> str:
    """Strip CR/LF and truncate to prevent email header injection."""
    cleaned = _HEADER_INJECTION_RE.sub(" ", str(value or "")).strip()
    return cleaned[:max_len]


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCOPES_READONLY = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
TAB_NAME = "All Prospects"
SHEET_RANGE = f"'{TAB_NAME}'!A:U"

# Column indices (0-based) within each data row
COL_NO = 0
COL_CATEGORY = 1
COL_SUBCATEGORY = 2
COL_COMPANY_NAME = 3
COL_TRADING_NAME = 4
COL_LOCATION = 5
COL_CONTACT_PERSON = 7
COL_EMAIL = 10
COL_CONTACT_STATUS = 14

# Segment classification keywords (case-insensitive substring match on subcategory)
LUXURY_KEYWORDS: frozenset[str] = frozenset({"resort", "luxury", "5-star"})
BOUTIQUE_KEYWORDS: frozenset[str] = frozenset({"hotel", "boutique", "lodge", "safari"})

SEGMENT_TEMPLATES: dict[str, str] = {
    "luxury": "cold_email_luxury.txt",
    "boutique": "cold_email_boutique.txt",
    "villa": "cold_email_villa.txt",
}

TOOL_NAME = "send_email.py"
DEFAULT_DAILY_LIMIT = 20


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------


class Prospect:
    """A single prospect row parsed from Google Sheets."""

    __slots__ = (
        "no",
        "category",
        "subcategory",
        "company_name",
        "trading_name",
        "location",
        "contact_person",
        "email",
        "contact_status",
    )

    def __init__(
        self,
        no: int,
        category: str,
        subcategory: str,
        company_name: str,
        trading_name: str,
        location: str,
        contact_person: str,
        email: str,
        contact_status: str,
    ) -> None:
        self.no = no
        self.category = category
        self.subcategory = subcategory
        self.company_name = company_name
        self.trading_name = trading_name
        self.location = location
        self.contact_person = contact_person
        self.email = email
        self.contact_status = contact_status

    @property
    def display_name(self) -> str:
        """Trading Name if non-blank, otherwise Company Name."""
        return self.trading_name if self.trading_name else self.company_name

    @property
    def segment(self) -> str:
        """Derive segment from subcategory text."""
        sub_lower = self.subcategory.lower()
        if any(kw in sub_lower for kw in LUXURY_KEYWORDS):
            return "luxury"
        if any(kw in sub_lower for kw in BOUTIQUE_KEYWORDS):
            return "boutique"
        return "villa"


# ---------------------------------------------------------------------------
# Config — validated at startup
# ---------------------------------------------------------------------------


class Config:
    """All environment-derived configuration, validated at construction time."""

    def __init__(self) -> None:
        self.credentials_path: str = self._require("GOOGLE_SHEETS_CREDENTIALS")
        self.spreadsheet_id: str = self._require("GOOGLE_SHEETS_SPREADSHEET_ID")
        self.smtp_host: str = self._require("SMTP_HOST")
        self.smtp_port: int = int(self._require("SMTP_PORT"))
        self.smtp_user: str = self._require("SMTP_USER")
        self.smtp_pass: str = self._require("SMTP_PASS")
        self.from_address: str = self._require("EMAIL_FROM_ADDRESS")
        self.from_name: str = self._require("EMAIL_FROM_NAME")
        self.app_url: str = self._require("NEXT_PUBLIC_APP_URL").rstrip("/")
        self.unsubscribe_secret: str = self._require("UNSUBSCRIBE_SECRET")
        self.daily_limit: int = int(
            os.environ.get("DAILY_SEND_LIMIT", str(DEFAULT_DAILY_LIMIT))
        )

    @staticmethod
    def _require(var: str) -> str:
        val = os.environ.get(var, "").strip()
        if not val:
            raise EnvironmentError(f"Required env var '{var}' is missing or blank.")
        return val


# ---------------------------------------------------------------------------
# Google Sheets — prospect reader
# ---------------------------------------------------------------------------


def _build_sheets_service(credentials_path: str):
    """Return a read-only authenticated Google Sheets API service."""
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES_READONLY
    )
    return build("sheets", "v4", credentials=creds, cache_discovery=False)


def _get(row: list[Any], index: int) -> str:
    """Safely read a row cell by index, returning a stripped string or ''."""
    if index < len(row):
        val = row[index]
        return str(val).strip() if val is not None else ""
    return ""


def fetch_prospects(service, spreadsheet_id: str) -> tuple[list[Prospect], int]:
    """Fetch all rows from the All Prospects tab and parse them into Prospect objects.

    Rows with a blank email address are silently skipped — they cannot be contacted.

    Returns:
        A tuple of (prospects, no_email_count) where no_email_count is the number
        of data rows that were skipped because they had no email address.
    """
    try:
        result = (
            service.spreadsheets()
            .values()
            .get(spreadsheetId=spreadsheet_id, range=SHEET_RANGE)
            .execute()
        )
    except HttpError as exc:
        raise RuntimeError(f"Sheets API error reading prospects: {exc}") from exc

    rows: list[list[Any]] = result.get("values", [])
    if not rows:
        return [], 0

    prospects: list[Prospect] = []
    no_email_count = 0
    for row in rows[1:]:  # skip header (row index 0)
        try:
            no_raw = _get(row, COL_NO)
            no = int(no_raw)
        except ValueError:
            logger.debug("Skipping row with non-integer No. value: %r", no_raw)
            continue

        email = _get(row, COL_EMAIL)
        if not email:
            no_email_count += 1
            continue  # no address — cannot contact

        prospects.append(
            Prospect(
                no=no,
                category=_get(row, COL_CATEGORY),
                subcategory=_get(row, COL_SUBCATEGORY),
                company_name=_get(row, COL_COMPANY_NAME),
                trading_name=_get(row, COL_TRADING_NAME),
                location=_get(row, COL_LOCATION),
                contact_person=_get(row, COL_CONTACT_PERSON),
                email=email,
                contact_status=_get(row, COL_CONTACT_STATUS),
            )
        )

    return prospects, no_email_count


# ---------------------------------------------------------------------------
# Unsubscribe token
# ---------------------------------------------------------------------------


def build_unsubscribe_url(email: str, app_url: str, secret: str) -> str:
    """Return the unsubscribe URL with an HMAC-SHA256 token for the given email."""
    token = hmac.new(
        secret.encode(),
        email.lower().encode(),
        "sha256",
    ).hexdigest()
    quoted_email = urllib.parse.quote(email, safe="")
    return f"{app_url}/unsubscribe?email={quoted_email}&token={token}"


# ---------------------------------------------------------------------------
# Template rendering
# ---------------------------------------------------------------------------


def _jinja_env() -> Environment:
    """Return a Jinja2 environment pointed at the prompts directory."""
    prompts_dir = _TOOLS_DIR / "prompts"
    if not prompts_dir.is_dir():
        raise FileNotFoundError(
            f"Prompts directory not found: {prompts_dir}. "
            "Expected tools/prompts/ to contain cold_email_*.txt files."
        )
    return Environment(
        loader=FileSystemLoader(str(prompts_dir)),
        undefined=StrictUndefined,
        keep_trailing_newline=True,
        autoescape=False,
    )


def render_template(
    segment: str,
    prospect: Prospect,
    unsubscribe_url: str,
    jinja_env: Environment,
) -> tuple[str, str]:
    """Render the appropriate template for the segment.

    Returns:
        (subject, body) — both as plain strings.

    The templates use a `Subject:` line as their first line. This function
    strips it and returns subject and body separately.
    """
    template_file = SEGMENT_TEMPLATES[segment]
    template = jinja_env.get_template(template_file)
    rendered = template.render(
        display_name=prospect.display_name,
        contact_person=prospect.contact_person,
        unsubscribe_url=unsubscribe_url,
    )

    lines = rendered.splitlines()
    subject = ""
    body_start = 0
    if lines and lines[0].startswith("Subject:"):
        subject = lines[0][len("Subject:"):].strip()
        # skip the blank line after the subject line if present
        body_start = 2 if len(lines) > 1 and lines[1].strip() == "" else 1
    else:
        subject = f"Hotel linen & supplies for {prospect.display_name}"

    body = "\n".join(lines[body_start:])
    return subject, body


# ---------------------------------------------------------------------------
# SMTP delivery
# ---------------------------------------------------------------------------


def _build_message(
    prospect: Prospect,
    subject: str,
    body: str,
    config: Config,
    unsubscribe_url: str,
) -> MIMEText:
    """Construct a MIME email message ready for sending."""
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = _sanitize_header(subject)
    msg["From"] = formataddr((config.from_name, config.from_address))
    msg["To"] = _sanitize_header(prospect.email)
    msg["Reply-To"] = "info@dozensupplies.com"
    msg["Message-ID"] = make_msgid(domain="dozensupplies.com")
    msg["List-Unsubscribe"] = f"<{unsubscribe_url}>"
    msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    msg["Date"] = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    return msg


def send_smtp(msg: MIMEText, config: Config) -> None:
    """Deliver a message via SMTP, using SSL on port 465 or STARTTLS otherwise.

    Raises:
        smtplib.SMTPException — on any SMTP-level failure.
    """
    if config.smtp_port == 465:
        with smtplib.SMTP_SSL(config.smtp_host, config.smtp_port) as server:
            server.login(config.smtp_user, config.smtp_pass)
            server.send_message(msg)
    else:
        with smtplib.SMTP(config.smtp_host, config.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(config.smtp_user, config.smtp_pass)
            server.send_message(msg)


# ---------------------------------------------------------------------------
# Sheets state update (post-send)
# ---------------------------------------------------------------------------


def _update_prospect_state(
    prospect: Prospect,
    segment: str,
    run_id: str,
    config: Config,
) -> None:
    """Write all five post-send state fields to Google Sheets via SheetsWriter.

    Imports SheetsWriter at call time so that a missing google-auth dep during
    dry-run does not block template rendering tests.
    """
    # SheetsWriter lives in the same tools/ directory — add it to path if needed.
    if str(_TOOLS_DIR) not in sys.path:
        sys.path.insert(0, str(_TOOLS_DIR))

    from sync_lead_state import SheetsWriter  # noqa: PLC0415 (deferred import intentional)

    writer = SheetsWriter(config.credentials_path, config.spreadsheet_id)
    today = date.today().isoformat()
    conversation_id = str(uuid.uuid4())

    fields: list[tuple[str, str]] = [
        ("contact_status", "EMAIL_SENT"),
        ("channel", "EMAIL"),
        ("last_contacted", today),
        ("conversation_id", conversation_id),
        ("notes", f"Cold email sent (segment={segment})"),
    ]

    for field, value in fields:
        try:
            writer.update_field(
                prospect_no=prospect.no,
                tab_name=TAB_NAME,
                field=field,
                value=value,
                triggered_by=TOOL_NAME,
                run_id=run_id,
            )
        except Exception as exc:
            # Log but do not raise — partial state updates are recoverable;
            # the email was already sent successfully.
            logger.error(
                "State update failed for prospect %d field '%s': %s",
                prospect.no,
                field,
                exc,
            )


# ---------------------------------------------------------------------------
# Filtering helpers
# ---------------------------------------------------------------------------


def _filter_prospects(
    prospects: list[Prospect],
    segment_filter: str | None,
    prospect_no_filter: int | None,
) -> list[Prospect]:
    """Apply CLI-level filters before the send loop.

    Prospects are retained only if:
    - contact_status is NOT_CONTACTED (live check against current sheet data)
    - segment matches the filter (if --segment was specified)
    - prospect No. matches (if --prospect-no was specified)
    """
    result: list[Prospect] = []
    for p in prospects:
        if p.contact_status != "NOT_CONTACTED":
            continue
        if segment_filter is not None and p.segment != segment_filter:
            continue
        if prospect_no_filter is not None and p.no != prospect_no_filter:
            continue
        result.append(p)
    return result


# ---------------------------------------------------------------------------
# Main send loop
# ---------------------------------------------------------------------------


def run(args: argparse.Namespace, config: Config) -> int:
    """Execute the send loop. Returns exit code (0 always unless startup fails)."""
    run_id = str(uuid.uuid4())
    logger.info("Run ID: %s", run_id)

    # --- Read prospects ---
    service = _build_sheets_service(config.credentials_path)
    all_prospects, skipped_no_email = fetch_prospects(service, config.spreadsheet_id)
    logger.info("Fetched %d prospects with email addresses.", len(all_prospects))

    # --- Filter ---
    candidates = _filter_prospects(
        all_prospects,
        segment_filter=args.segment,
        prospect_no_filter=args.prospect_no,
    )
    logger.info(
        "%d candidate(s) after filtering (segment=%r, prospect_no=%r).",
        len(candidates),
        args.segment,
        args.prospect_no,
    )

    # --- Apply send limit ---
    limit: int = args.limit if args.limit is not None else config.daily_limit
    to_send = candidates[:limit]

    # --- Jinja2 environment (loaded once) ---
    jinja_env = _jinja_env()

    # --- Counters ---
    sent_count = 0
    failed_count = 0
    skipped_already_contacted = len(
        [p for p in all_prospects if p.contact_status != "NOT_CONTACTED"]
    )

    # --- Send loop ---
    for prospect in to_send:
        unsubscribe_url = build_unsubscribe_url(
            prospect.email, config.app_url, config.unsubscribe_secret
        )
        segment = prospect.segment

        try:
            subject, body = render_template(segment, prospect, unsubscribe_url, jinja_env)
        except Exception as exc:
            logger.error(
                "Template render failed for prospect %d (%s): %s",
                prospect.no,
                prospect.email,
                exc,
            )
            failed_count += 1
            continue

        if args.dry_run:
            print(f"\n{'=' * 72}")
            print(f"DRY RUN — Prospect #{prospect.no}: {prospect.display_name}")
            print(f"To:      {prospect.email}")
            print(f"Segment: {segment}")
            print(f"Subject: {subject}")
            print(f"{'-' * 72}")
            print(body)
            sent_count += 1
            continue

        msg = _build_message(prospect, subject, body, config, unsubscribe_url)

        try:
            send_smtp(msg, config)
        except Exception as exc:
            logger.error(
                "SMTP send failed for prospect %d (%s): %s",
                prospect.no,
                prospect.email,
                exc,
            )
            failed_count += 1
            continue

        if args.verbose:
            logger.info(
                "Sent → prospect #%d | %s | segment=%s | subject=%r",
                prospect.no,
                prospect.email,
                segment,
                subject,
            )

        # Update Sheets state
        try:
            _update_prospect_state(prospect, segment, run_id, config)
        except Exception as exc:
            logger.error(
                "Sheets state update failed for prospect %d after successful send: %s",
                prospect.no,
                exc,
            )
            # The email was sent — count as sent even if state write failed.

        sent_count += 1

    # --- Summary ---
    action = "Would send" if args.dry_run else "Sent"
    total_skipped = skipped_no_email + skipped_already_contacted
    print(
        f"\n{action} {sent_count} email(s). "
        f"Skipped {total_skipped} "
        f"(no email: {skipped_no_email} / already contacted: {skipped_already_contacted}). "
        f"Failed: {failed_count}."
    )

    if failed_count > 0:
        logger.warning("%d send failure(s) during this run.", failed_count)

    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Send personalised cold emails to NOT_CONTACTED prospects "
            "from the Dozen Hotel Supplies Google Sheets prospect list."
        )
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print emails to stdout; do not send or update Sheets.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        metavar="N",
        help=(
            "Maximum emails to send this run "
            "(default: DAILY_SEND_LIMIT env var, else 20)."
        ),
    )
    parser.add_argument(
        "--segment",
        choices=["luxury", "boutique", "villa"],
        default=None,
        help="Filter to one segment only (default: all segments).",
    )
    parser.add_argument(
        "--prospect-no",
        type=int,
        default=None,
        metavar="N",
        help="Send to a single specific prospect No. (for testing).",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Log each email as it is sent.",
    )
    return parser.parse_args()


def main() -> None:
    args = _parse_args()

    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Validate configuration at startup — fail fast before any Sheets or SMTP calls.
    try:
        config = Config()
    except EnvironmentError as exc:
        logger.error("Startup failure: %s", exc)
        sys.exit(1)

    try:
        exit_code = run(args, config)
    except RuntimeError as exc:
        # Unrecoverable runtime errors (Sheets auth, API unreachable, etc.)
        logger.error("Unrecoverable error: %s", exc)
        sys.exit(1)

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
