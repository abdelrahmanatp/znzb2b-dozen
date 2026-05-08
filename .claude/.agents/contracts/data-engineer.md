# Contract — data-engineer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/data-engineer.md`

## Role in this project
Design and implement the lead state database — migrate the 522-prospect xlsx to Google Sheets, define the conversation state schema, build Python sync tools, and ensure zero data loss with monitoring; this is the backbone of conversation state management (sparring condition B2).

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| lead-state-sync | Implementation | lead — designs schema, builds sync pipeline |
| prospect-discovery | Implementation | parallel — appends new leads from discovery runs |
| cold-email-outreach | Implementation | parallel — maintains send/reply status per prospect |
| campaign-performance-report | Ongoing | lead — provides clean data layer for data-analyst queries |

## Inputs (what this agent needs to start)
- `Zanzibar Prospects - Consolidated.xlsx` (522 prospects, 14 columns)
- Conversation state schema spec from `alireza-agent-designer` — fields required for state management
- Google Sheets credentials (GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON in .env)
- `/xlsx` skill for initial xlsx ingestion

## Outputs (what this agent delivers)
- Google Sheets lead tracker with:
  - `All Prospects` tab (migrated from xlsx, 14 original columns + state columns)
  - State columns added: `contact_status`, `channel`, `last_contacted`, `conversation_id`, `response_flag`, `quote_requested`, `notes`
  - `Discovery Runs` tab (new prospects added by lead-research-assistant)
  - `Campaign Stats` tab (aggregates for data-analyst)
- `tools/sync_lead_state.py` — upsert by prospect No., handles concurrent writes, logs all changes
- `tools/migrate_xlsx.py` — one-time migration tool (xlsx → Sheets)
- Schema documentation in `docs/architecture/lead-state-schema.md`

## Handoffs (who receives the output)
- Downstream: `python-pro` — receives sync tool spec (data-engineer designs, python-pro implements)
- Downstream: `data-analyst` — receives clean data layer for campaign metrics
- Downstream: `lead-research-assistant` — receives append interface for new lead additions
- Expected acknowledgement: python-pro confirms tool is implementable; data-analyst confirms query layer works

## Tools / MCPs this agent uses
- gspread / Google Sheets API v4
- python-dotenv for credential loading
- pandas for xlsx parsing (via `/xlsx` skill)
- Read for xlsx ingestion

## Success criteria (how output is judged)
- Zero data loss: all 522 prospects migrated exactly, validated row count + key field spot-check
- Idempotent sync: running sync_lead_state.py twice produces identical results
- Concurrent write handling: if two tools write simultaneously, later write wins with audit log entry
- Schema: all required state fields present, typed correctly (status is enum not free text)
- Reviewer: `code-reviewer` reviews sync tool logic; `security-auditor` reviews access controls on Sheets (who has edit access)

## Improvement loop
- Who gives feedback: `data-analyst` (data quality issues surfaced in reporting) + `python-pro` (implementation friction on tool spec)
- When: after first full sync run, then weekly
- What happens: add validation rules, fix schema issues, optimize sync performance

## Escalation triggers
- Data loss detected after sync → immediately pause all pipeline operations, escalate to Abbie
- Schema change required mid-campaign (new state field needed) → design migration, validate with python-pro, escalate to Abbie for approval before applying
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: Google Sheets workspace created with correct access, service account credentials in `.env`
- Tool/MCP status: GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON: ❌ Not yet provisioned

## Open questions at hire time
- Google Sheets vs cloud DB: brief requires Google Sheets; confirm before considering migration to SQLite or similar
- Audit log: ✅ FINALIZED — Write to dedicated `Audit Log` tab in Google Sheets (same workbook as All Prospects). Keeps all state management in one operator-visible location. Columns: timestamp, prospect_no, field_changed, old_value, new_value, triggered_by_tool. See `workflows/lead-state-sync.md`.
