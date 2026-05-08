# Sprint 4 Deliverables — Email Pipeline + Claude Prompts + ChromaDB RAG

**Status:** APPROVED
**Prepared:** 2026-05-08
**Sprint:** 4

## What We Are Building

The Python tools layer for automated cold email outreach and inbound email handling. Includes a ChromaDB-backed product knowledge base that lets Claude answer prospect questions accurately, three cold email templates personalized by hotel segment, and an AI inbound classifier that routes replies to the correct response path.

## Deliverables

### Python Tools

- [x] `tools/ingest_catalog.py` — reads the 7 product catalog docs, chunks by section, and loads them into a local ChromaDB collection ("dozen_catalog"). Idempotent — safe to re-run.
- [x] `tools/rag_query.py` — takes a plain-language product question, retrieves relevant chunks from ChromaDB, calls Claude to produce an accurate answer. Importable as a library (`from rag_query import query_catalog`) and runnable as a CLI tool.
- [x] `tools/send_email.py` — reads NOT_CONTACTED prospects from Google Sheets, applies the correct segment template, personalizes the email, sends via SMTP, and updates lead state (EMAIL_SENT, channel=EMAIL, last_contacted, conversation_id). Supports --dry-run, --limit, and --segment flags. Enforces daily send cap from env var.
- [x] `tools/bounce_handler.py` — accepts a JSON bounce event (from SendGrid webhook or manual input), looks up the prospect by email, and updates contact_status to BOUNCED_SOFT or BOUNCED_HARD with a note.
- [x] `tools/unsubscribe_handler.py` — accepts an email address, looks up the prospect in Sheets, and updates contact_status to UNSUBSCRIBED. Called by the website /api/unsubscribe endpoint and by inbound_handler.py.
- [x] `tools/inbound_handler.py` — accepts an inbound email (from/subject/body), classifies it with Claude (QUESTION / QUOTE_REQUEST / UNSUBSCRIBED / NOT_INTERESTED / GENERAL_REPLY), uses rag_query for QUESTION replies, generates a draft response, and updates lead state.

### Prompts

- [x] `tools/prompts/cold_email_luxury.txt` — luxury resort segment template (Jinja2)
- [x] `tools/prompts/cold_email_boutique.txt` — boutique hotel / lodge segment template (Jinja2)
- [x] `tools/prompts/cold_email_villa.txt` — villa / apartment / guesthouse segment template (Jinja2)
- [x] `tools/prompts/classify_inbound.txt` — Claude classification prompt for incoming emails
- [x] `tools/prompts/answer_question.txt` — Claude prompt for RAG-backed product question answering
- [x] `tools/prompts/quote_request_reply.txt` — Claude prompt for quote request acknowledgment

### Dependencies

- [x] `tools/requirements.txt` updated with: `anthropic>=0.25`, `chromadb>=0.5`, `jinja2>=3.1`

## Not Included

- WhatsApp / WABA integration (Phase 2 — requires Meta provisioning)
- Live SendGrid webhook endpoint (webhook URL must be configured in SendGrid dashboard by Abbie after deploy)
- Prospect discovery (new leads from Google Maps / LinkedIn — Sprint 5)
- AI inbound sales rep with full conversation memory (Sprint 5)
- quote_sender.py (sending approved quotes — Sprint 5)

---
*Status: APPROVED — user said "proceed" on 2026-05-08*
