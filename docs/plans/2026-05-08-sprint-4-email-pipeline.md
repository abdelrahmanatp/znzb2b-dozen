# Sprint 4 — Email Pipeline + ChromaDB RAG Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Python tools layer for cold email outreach, inbound handling, bounce/unsubscribe processing, and a ChromaDB-backed product knowledge base.

**Architecture:** WAT-compliant — all IO through deterministic Python tools; agents never execute directly. ChromaDB stores chunked catalog docs locally. Claude (Haiku) handles classification and Q&A. SMTP sends cold emails. SheetsWriter (from sync_lead_state.py) handles all Sheets writes.

**Tech Stack:** Python 3.11+, anthropic SDK, chromadb, jinja2, smtplib, google-api-python-client, python-dotenv

---

## Sprint Stack

🗂 Sprint Stack — Email Pipeline + RAG
| Phase | Resource | Output |
|-------|----------|--------|
| Production | python-pro × 3 (parallel) | ingest_catalog.py, rag_query.py, send_email.py, bounce_handler.py, unsubscribe_handler.py |
| Production | python-pro (sequential) | inbound_handler.py (depends on rag_query.py) |
| Quality | code-reviewer + security-auditor | Reviewed tools ready for operator use |

Pipeline:
→ python-pro (RAG) — output: ingest_catalog.py + rag_query.py
→ python-pro (email) — output: send_email.py
→ python-pro (state) — output: bounce_handler.py + unsubscribe_handler.py
→ python-pro (inbound, after RAG) — output: inbound_handler.py
→ DONE

---

## Task 1: Update requirements.txt

**Files:** Modify `tools/requirements.txt`

Add: `anthropic>=0.25`, `chromadb>=0.5`, `jinja2>=3.1`

✅ Done

---

## Task 2: Create prompt templates

**Files:** Create `tools/prompts/` directory with 6 templates

- `cold_email_luxury.txt` — Jinja2, variables: display_name, contact_person, unsubscribe_url
- `cold_email_boutique.txt` — Jinja2, same vars
- `cold_email_villa.txt` — Jinja2, same vars
- `classify_inbound.txt` — Claude system prompt for classification
- `answer_question.txt` — Claude prompt with {{ catalog_context }} and {{ question }}
- `quote_request_reply.txt` — Claude prompt for quote acknowledgment

✅ Done

---

## Task 3: ingest_catalog.py

**Files:** Create `tools/ingest_catalog.py`

- Read all `docs/catalog/*.md` files
- Chunk by H2/H3 section boundaries
- Deterministic chunk IDs: `{filename_stem}__{section_slug}`
- Store in ChromaDB PersistentClient, collection "dozen_catalog"
- Idempotent (re-run safe)
- CLI: `--reset`, `--verbose`, `--docs-path`, `--db-path`

**Verify:**
```bash
cd c:\Users\XPS 13\Desktop\ZNZB2B
python tools/ingest_catalog.py --verbose
# Expected: "Ingested N chunks from 7 files into collection 'dozen_catalog'"
```

---

## Task 4: rag_query.py

**Files:** Create `tools/rag_query.py`

- Query "dozen_catalog" collection for top-k chunks
- Render answer_question.txt Jinja2 template
- Call Claude Haiku (`claude-haiku-4-5-20251001`)
- Library: `from rag_query import query_catalog`
- CLI: `--query`, `--k`

**Verify:**
```bash
python tools/rag_query.py --query "What GSM are your standard bath towels?"
# Expected: accurate answer mentioning 400-700 GSM range
```

---

## Task 5: send_email.py

**Files:** Create `tools/send_email.py`

- Read All Prospects, filter NOT_CONTACTED + has email
- Segment detection from Subcategory column
- Jinja2 template rendering
- SMTP send (smtplib, supports port 465 SSL + 587 STARTTLS)
- Update Sheets: contact_status, channel, last_contacted, conversation_id, notes
- CLI: `--dry-run`, `--limit`, `--segment`, `--prospect-no`, `--verbose`

**Verify:**
```bash
python tools/send_email.py --dry-run --limit 3 --verbose
# Expected: prints 3 email previews, no sends, no Sheets updates
```

---

## Task 6: bounce_handler.py

**Files:** Create `tools/bounce_handler.py`

- Look up prospect by email in All Prospects tab
- Update contact_status → BOUNCED_HARD or BOUNCED_SOFT
- Append bounce reason to notes
- CLI: `--email`, `--type`, `--reason` OR `--json path/to/event.json`

---

## Task 7: unsubscribe_handler.py

**Files:** Create `tools/unsubscribe_handler.py`

- Look up prospect by email
- Update contact_status → UNSUBSCRIBED
- Append note
- CLI: `--email`, `--reason`

---

## Task 8: inbound_handler.py

**Files:** Create `tools/inbound_handler.py`

Depends on: rag_query.py (Task 4), unsubscribe_handler.py (Task 7)

- Accept: --from-email, --subject, --body (or --json path/to/email.json)
- Classify with Claude Haiku using classify_inbound.txt prompt
- Route by classification:
  - QUESTION → query_catalog(body) → render answer_question.txt → print draft reply
  - QUOTE_REQUEST → render quote_request_reply.txt → print draft + send team alert email
  - UNSUBSCRIBED → call unsubscribe_handler logic → print confirmation
  - NOT_INTERESTED → update contact_status → NOT_INTERESTED
  - GENERAL_REPLY → update response_flag → TRUE, print "No action required"
- Update lead state via SheetsWriter
- Print: classification + draft reply (if any) to stdout
- Writes to `--output-file` if specified (for operator review)

**Verify (dry-run):**
```bash
python tools/inbound_handler.py \
  --from-email "manager@somehotel.com" \
  --subject "Re: Hotel linen" \
  --body "What GSM are your bath towels and do you have white 100x150cm?" \
  --dry-run
# Expected: QUESTION classification + accurate RAG answer
```

---

## Task 9: Integration smoke test

```bash
# 1. Ingest catalog
python tools/ingest_catalog.py

# 2. Test RAG
python tools/rag_query.py --query "Do you have bathrobes with logo embroidery?"

# 3. Test send dry-run
python tools/send_email.py --dry-run --limit 2

# 4. Test inbound classification
python tools/inbound_handler.py --from-email test@test.com --subject "Question" \
  --body "What thread count is your bed linen?" --dry-run

# 5. Test bounce
python tools/bounce_handler.py --email test@test.com --type hard --reason "Test"

# 6. Test unsubscribe
python tools/unsubscribe_handler.py --email test@test.com
```

---

## Known blockers for live E2E (code runs, live ops require):
- GOOGLE_SHEETS_CREDENTIALS + GOOGLE_SHEETS_SPREADSHEET_ID
- ANTHROPIC_API_KEY
- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
- Lead database migrated (migrate_xlsx.py run + All Prospects tab populated)
