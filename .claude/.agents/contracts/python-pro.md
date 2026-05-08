# Contract — python-pro

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/python-pro.md`

## Role in this project
Build all Python tools in the WAT tools layer — Google Maps prospecting, SMTP/SendGrid email sending, Google Sheets sync, lead deduplication, conversation state persistence, and quote approval WhatsApp ping notification.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Implementation | lead — builds email sending tool (SMTP/SendGrid integration) |
| prospect-discovery | Implementation | lead — builds Google Maps API discovery tool |
| lead-state-sync | Implementation | lead — builds Google Sheets read/write sync tools |
| quote-approval-routing | Implementation | lead — builds WhatsApp approval ping tool (via WhatsApp Business API or Twilio) |
| catalog-knowledge-base | Implementation | lead — builds catalog ingestion script (per rag-architect spec) |
| code-review-cycle | All | parallel — implements fixes from code-reviewer findings |

## Inputs (what this agent needs to start)
- Tool schemas from `alireza-agent-designer` (input/output formats, error codes)
- Email templates from `alireza-cold-email`
- Catalog ingestion spec from `alireza-rag-architect`
- Prospect schema: 14 columns per `docs/2-context.md`
- Credentials needed: `GOOGLE_MAPS_API_KEY`, `SENDGRID_API_KEY` (or SMTP credentials), `GOOGLE_SHEETS_ID`, `ANTHROPIC_API_KEY`, `WHATSAPP_PHONE_ID`

## Outputs (what this agent delivers)
All Python tools in `tools/` directory with:
- `tools/discover_prospects.py` — Google Maps Places API search + enrichment
- `tools/send_email.py` — SMTP/SendGrid sending with template rendering
- `tools/sync_lead_state.py` — Google Sheets read/write (upsert by prospect ID)
- `tools/notify_approval.py` — WhatsApp ping to owner + sales manager with quote details
- `tools/ingest_catalog.py` — PDF → chunks → embeddings → vector DB
- `tools/deduplicate_leads.py` — fuzzy matching against existing prospect list
- Each tool: requirements.txt entry, .env usage via python-dotenv, type hints, pytest tests, bandit scan

## Handoffs (who receives the output)
- Downstream: `code-reviewer` — all tools reviewed before merge
- Downstream: `qa-expert` — tests integration and edge cases
- Downstream: `security-auditor` — audits credential handling
- Expected acknowledgement: all three reviewers pass before tool is considered production-ready

## Tools / MCPs this agent uses
- Python 3.11+ with venv + requirements.txt
- google-maps (googlemaps SDK) for prospect discovery
- httpx + python-dotenv + pydantic for API integrations
- gspread or google-api-python-client for Google Sheets
- SendGrid Python SDK or smtplib for email sending
- anthropic SDK for Claude integration
- pytest + pytest-cov + bandit for quality gates

## Success criteria (how output is judged)
- Zero hardcoded credentials — all API keys from .env
- All tools: idempotent (can be run twice without duplicate data)
- Google Sheets sync: zero data loss, handles concurrent write conflicts
- Email tool: handles bounce, rate limit, and SMTP auth error gracefully
- Test coverage > 90% per tool
- Bandit security scan: zero HIGH severity findings
- Reviewer: `code-reviewer` (Opus) reviews every tool; `security-auditor` audits credential handling

## Improvement loop
- Who gives feedback: `code-reviewer` findings + `qa-expert` defect reports
- When: after each code-review-cycle
- What happens: implement findings, re-submit for review

## Escalation triggers
- If a required API doesn't have a Python SDK → flag to Abbie before building raw HTTP wrapper
- If Google Maps API cost projects to exceed $50/month at intended usage → flag before running full prospecting
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: tool schemas from `alireza-agent-designer`, API keys provisioned in `.env`
- Tool/MCP status:
  - GOOGLE_MAPS_API_KEY: ❌ Not yet provisioned
  - SENDGRID_API_KEY (or SMTP): ❌ Not yet provisioned
  - GOOGLE_SHEETS_ID: ❌ Not yet provisioned (xlsx migration first)
  - ANTHROPIC_API_KEY: ⚠️ Check .env
  - WHATSAPP_PHONE_ID: ❌ WABA not yet provisioned (Phase 2)

## Open questions at hire time
- Email sending: SendGrid (recommended for deliverability tracking) vs Google Workspace SMTP — [to be finalized in /workflow]
- WhatsApp notification in Phase 1: send via Twilio SMS as fallback while WABA provisioning is pending? — [confirm with Abbie]
