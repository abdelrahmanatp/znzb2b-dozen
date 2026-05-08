# migrate_xlsx.py — Specification

**Status:** APPROVED
**Author:** data-engineer
**Created:** 2026-05-08
**Implemented by:** python-pro agent
**Related schema:** `docs/architecture/lead-state-schema.md`

---

## Purpose

One-time migration tool. Reads the 521 prospect rows from `Zanzibar Prospects - Consolidated.xlsx` (the `All Prospects` sheet) and writes them to the Google Sheets workbook tab also named `All Prospects`, adding the 7 state columns with their default values. Must be idempotent, validate its own output, and support a dry-run mode.

This tool runs exactly once in production. After a successful run, it is retained in `tools/` for audit and disaster-recovery purposes but is not scheduled.

---

## Input

**File:** `Zanzibar Prospects - Consolidated.xlsx`
**Path:** Project root (i.e. the same directory as `tools/`). The path must be configurable via `.env` as `PROSPECTS_XLSX_PATH`. Default: `../Zanzibar Prospects - Consolidated.xlsx` relative to `tools/`.

**Sheet to read:** `All Prospects` only.

Do not read `Priority Leads` or `Category Summary`. The `Priority Leads` sheet is a subset of `All Prospects` (verified: all 461 Priority Lead row numbers are present in All Prospects). Reading it separately would introduce duplicates.

**Columns expected (14, in this order):**

| Index (0-based) | Column Name |
|-----------------|-------------|
| 0 | No. |
| 1 | Category |
| 2 | Subcategory |
| 3 | Company Name |
| 4 | Trading Name |
| 5 | Location |
| 6 | Region |
| 7 | Contact Person |
| 8 | Position |
| 9 | Phone |
| 10 | Email |
| 11 | Website |
| 12 | Source |
| 13 | Org Type (Raw) |

Row 0 is the header. Data starts at row 1.

---

## Row Count Clarification

**Important:** The xlsx file has 522 total rows including the header row. The data row count is 521. No. values run from 1 to 521 with no gaps and no duplicates (verified against source file).

The project brief uses "522 rows" colloquially to mean the full sheet including header. The validation check must assert exactly 521 data rows (not 522). This is not an error in the source data — it is a counting convention difference.

---

## Output

**Target:** Google Sheets workbook `ZNZB2B — Dozen Lead Database`, tab `All Prospects`.

**Columns written (21):**

Columns A–N: the 14 original prospect fields, values taken directly from the xlsx with no transformation except those specified in the Data Transformation Rules section below.

Columns O–U: the 7 state columns, all written with their default values on migration:

| Column | Default value written |
|--------|-----------------------|
| contact_status (O) | NOT_CONTACTED |
| channel (P) | (empty string — blank cell) |
| last_contacted (Q) | (empty string — blank cell) |
| conversation_id (R) | (empty string — blank cell) |
| response_flag (S) | FALSE |
| quote_requested (T) | FALSE |
| notes (U) | (empty string — blank cell) |

**Row 1 of the sheet (Google Sheets row 1):** Column headers. The tool writes the header row explicitly:
`No. | Category | Subcategory | Company Name | Trading Name | Location | Region | Contact Person | Position | Phone | Email | Website | Source | Org Type (Raw) | contact_status | channel | last_contacted | conversation_id | response_flag | quote_requested | notes`

**Row 2 onward:** Data rows, one per prospect, in No. order (ascending, 1 to 521).

---

## Data Transformation Rules

1. **No. field:** Cast to integer. Must be in range 1–521.
2. **All text fields:** Strip leading and trailing whitespace. Convert `None` (Python null) to empty string `""`. Do not alter case, punctuation, or content otherwise.
3. **Phone field:** Retain exactly as-is from source (raw strings, may contain "/" separators, may contain spaces). Do not attempt E.164 normalization — this is source data and normalization would mask data quality issues.
4. **Email field:** Strip whitespace and convert to lowercase. If the result is an empty string, write an empty string (do not write null).
5. **Website field:** Strip whitespace. If the result is an empty string, write an empty string.
6. **No. field type:** Write as a number (integer) in Google Sheets, not as a string. All other fields write as strings.
7. **No type coercion** for any other field. Write string values as strings. If Google Sheets auto-interprets a phone number as a number, the tool must prefix the cell with `'` (apostrophe) or use the Sheets API `userEnteredValue.stringValue` to force string type for the Phone column.

---

## Pre-flight Validation (runs before any write)

The tool validates the source xlsx before opening the Google Sheets connection. If any pre-flight check fails, the tool exits with a non-zero code, prints a clear error message, and writes nothing to Sheets.

| Check | Description | Failure message |
|-------|-------------|----------------|
| file_exists | `PROSPECTS_XLSX_PATH` resolves to a file that exists | "FAIL: xlsx file not found at {path}" |
| sheet_exists | The xlsx contains a sheet named exactly "All Prospects" | "FAIL: Sheet 'All Prospects' not found in xlsx" |
| row_count | Data row count (excluding header) equals 521 | "FAIL: Expected 521 data rows, found {n}" |
| header_match | The 14 header column names match the expected list exactly (order and spelling) | "FAIL: Header mismatch. Expected: {expected}. Found: {actual}" |
| no_dup_no | No. values are unique across all 521 rows | "FAIL: Duplicate No. values found: {list}" |
| no_seq_gap | No. values form a contiguous sequence from 1 to 521 with no gaps | "FAIL: Gaps in No. sequence: missing values {list}" |
| company_name_required | No row has a null or empty Company Name | "FAIL: Rows with missing Company Name: No. {list}" |
| no_field_count | Each data row has exactly 14 fields | "FAIL: Rows with wrong field count: No. {list}" |

---

## Post-write Validation (runs after writing to Sheets)

After the write completes, the tool reads back from Google Sheets and verifies:

| Check | Description | Failure message |
|-------|-------------|----------------|
| sheets_row_count | The tab has exactly 522 rows (1 header + 521 data) | "POST-WRITE FAIL: Expected 522 rows in Sheets, found {n}" |
| spot_check_no | Row at Sheets row 2 has No. = 1; row at Sheets row 522 has No. = 521 | "POST-WRITE FAIL: First or last No. value incorrect" |
| spot_check_status | All rows in column O have value "NOT_CONTACTED" | "POST-WRITE FAIL: Unexpected contact_status values found" |
| spot_check_flags | All rows in columns S and T have value "FALSE" | "POST-WRITE FAIL: Unexpected boolean default values found" |
| header_row | Sheets row 1 matches the 21-column header exactly | "POST-WRITE FAIL: Header row mismatch in Sheets" |

If any post-write check fails, the tool prints the failure, writes a warning to stdout, and exits with a non-zero code. It does NOT roll back the write automatically — a failed post-write check requires human inspection before re-running.

---

## Idempotency

The tool must be safe to run twice without duplicating data.

**Rule:** At startup, after pre-flight validation passes, the tool reads the current state of the `All Prospects` tab in Sheets.

- **If the tab is empty (0 data rows after any header):** proceed with full write.
- **If the tab has exactly 521 data rows AND all No. values 1–521 are present:** the tool prints "All Prospects tab already populated with 521 rows. Migration already complete. Use --force to re-run." and exits with code 0 (success, not an error).
- **If the tab has a partial write (some rows present, not all):** the tool prints "WARN: Partial data found ({n} rows). This may indicate a previous failed run. Use --force to overwrite." and exits with a non-zero code. It does not attempt to patch the partial write automatically.
- **If --force flag is passed:** the tool clears the entire `All Prospects` tab (all rows including header) and performs a fresh write from scratch. This is the only supported recovery path from a partial write.

---

## Dry-run Mode

Invoked with `--dry-run` flag.

In dry-run mode, the tool:
1. Runs all pre-flight validation checks against the xlsx.
2. Prints a summary of what would be written, without opening a Sheets connection or writing anything:
   - Number of rows that would be written: 521
   - Column headers that would be written
   - First 3 rows of data as they would appear in Sheets (after transformation)
   - Last 3 rows of data
   - State column defaults that would be applied
3. Prints "DRY RUN COMPLETE — no data was written."
4. Exits with code 0.

Dry-run does not require `GOOGLE_SHEETS_CREDENTIALS` or `GOOGLE_SHEETS_SPREADSHEET_ID` to be set. It only requires `PROSPECTS_XLSX_PATH`.

---

## Error Handling

| Error condition | Behaviour |
|----------------|-----------|
| xlsx file not found | Pre-flight fails, exit code 1, no Sheets connection opened |
| Pre-flight validation failure | Exit code 1, descriptive message, no Sheets connection opened |
| Google Sheets auth failure | Exit code 1, print OAuth error, no data written |
| Spreadsheet not found (bad ID) | Exit code 1, print error, no data written |
| Sheets API rate limit hit during write | Retry with exponential backoff: 3 retries, initial delay 2s, multiplier 2. If all retries fail, exit code 1 and print "FAIL: Sheets API rate limit exceeded after 3 retries" |
| Sheets API error on individual row batch | Log the failing batch to stdout with row numbers, continue writing remaining batches, report partial failure at end |
| Post-write validation failure | Print failure details, exit code 1, do not auto-rollback |
| Unexpected exception | Print traceback, exit code 1 |

---

## Environment Variables

All configuration via `.env`. The tool loads `.env` at startup using `python-dotenv`.

| Variable | Required | Description |
|----------|----------|-------------|
| `PROSPECTS_XLSX_PATH` | No | Path to the xlsx file. Default: `../Zanzibar Prospects - Consolidated.xlsx` relative to the `tools/` directory. |
| `GOOGLE_SHEETS_CREDENTIALS` | Yes (except dry-run) | Path to the Google service account JSON key file. |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Yes (except dry-run) | Google Sheets spreadsheet ID (from the URL). |
| `ALL_PROSPECTS_SHEET_NAME` | No | Name of the target tab. Default: `All Prospects`. |

---

## CLI Interface

```
python tools/migrate_xlsx.py [--dry-run] [--force] [--verbose]
```

| Flag | Effect |
|------|--------|
| `--dry-run` | Run pre-flight validation only; print what would be written; do not connect to Sheets |
| `--force` | Clear the target tab and re-run migration even if data already exists |
| `--verbose` | Print each row number as it is written; print all validation check results (pass/fail) |

No positional arguments. All configuration via `.env`.

---

## Write Strategy

The tool uses the Google Sheets API v4 `spreadsheets.values.update` or `spreadsheets.values.batchUpdate` method (not append). It writes all 522 rows (header + 521 data) in a single batch call or in batches of 100 rows if the single-call payload exceeds the API size limit.

The tool uses `valueInputOption=RAW` to prevent Google Sheets from interpreting values (prevents phone numbers from being auto-parsed as dates or numbers). Exception: the No. column is written with `valueInputOption=USER_ENTERED` as a number so it is stored as a numeric type for range-based filtering.

**Recommended implementation approach:** Build a 2D list (list of lists) of all 522 rows in memory, then write with a single `values.update` call to the range `All Prospects!A1:U522`.

---

## Dependencies

The tool must be implementable with these libraries only:

| Library | Use |
|---------|-----|
| `openpyxl` | Read the xlsx file |
| `google-auth` | Google API authentication |
| `google-auth-oauthlib` | OAuth2 flow (if service account JSON is used, `google-auth` alone suffices) |
| `google-api-python-client` | Google Sheets API v4 client |
| `python-dotenv` | Load `.env` file |

No pandas, no gspread. These constraints keep the dependency footprint small and the behaviour explicit.

---

## Audit Log Entry

On successful completion, migrate_xlsx.py appends one entry to the `Audit Log` tab:

| Field | Value |
|-------|-------|
| log_id | UUID v4 |
| timestamp | ISO 8601 UTC datetime at time of write completion |
| prospect_no | 0 (special value — represents a bulk operation, not a single row) |
| tab_name | All Prospects |
| field_changed | MIGRATION |
| old_value | BLANK |
| new_value | 521 rows written |
| triggered_by_tool | migrate_xlsx.py |
| triggered_by_run_id | UUID v4 for this specific run |
| notes | "Initial migration from Zanzibar Prospects - Consolidated.xlsx. Row count: 521." |

If the Audit Log tab does not exist at migration time, the tool creates it with the correct headers before writing the entry. (The Audit Log tab is expected to be pre-created by the workbook setup tool — this is a fallback only.)

---

## Out of Scope for This Tool

- Creating the Google Sheets workbook or any tab other than writing to `All Prospects` and appending to `Audit Log`.
- Migrating `Priority Leads` as a separate tab (not needed — it is a subset, not additional data).
- Any incremental sync or ongoing update logic (that is sync_lead_state.py's responsibility).
- Deduplication of prospects by email or company name (the source data is treated as authoritative; deduplication is a separate data quality task).
- Sending any outreach or triggering any downstream pipeline.
