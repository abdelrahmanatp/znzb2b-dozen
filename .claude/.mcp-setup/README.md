# MCP Setup — Dozen Hotel Supplies AI System

**Project:** ZNZB2B
**Setup date:** 2026-05-07

---

## MCPs Required for This Project

### Globally Wired (no install needed — verify connected this session)

| MCP | Used for | Verify connected |
|-----|----------|-----------------|
| `claude.ai Figma` | ui-designer design specs and handoff | Check for `mcp__claude_ai_Figma__*` tools in session |
| `browser-use` | qa-expert Playwright website testing | Check for `mcp__browser-use__*` tools in session |
| `Tavily` | lead-research-assistant web discovery + research-analyst market intel | Check for `mcp__tavily__*` tools in session |
| `Gmail` | email workflow automation | Check for `mcp__claude_ai_Gmail__*` tools in session |
| `Canva` | marketing / social assets | Check for `mcp__claude_ai_Canva__*` tools in session |
| `21st-dev-magic` | UI component generation for nextjs-developer | Check for `mcp__21st-dev-magic__*` tools in session |

---

## Required Env Vars

All credentials live in the project `.env` file at the project root. Never hardcode any credential in any Python tool or Next.js file.

### Critical path (project cannot start without these)

```bash
# Anthropic API — all AI tools, RAG pipeline, inbound handler
ANTHROPIC_API_KEY=sk-ant-...

# Google Sheets — lead state database, sync tools, analytics
# Status: ❌ NOT YET PROVISIONED
# How to get: Create a Google Cloud service account, enable Sheets API v4,
#             download the JSON key, paste the full JSON here as a single line
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# Google Sheets ID — the ID from the Sheets URL (/spreadsheets/d/{ID}/)
# Status: ❌ NOT YET PROVISIONED — create the Sheets document first
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
```

### Email delivery (required before outreach begins)

```bash
# Option A — SendGrid (recommended for deliverability tracking)
# Status: ❌ NOT YET PROVISIONED
SENDGRID_API_KEY=SG....

# Option B — SMTP (alternative if SendGrid not available)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=outreach@yourdomain.com
SMTP_PASS=your_smtp_password

# Sender identity — must match sending domain's SPF/DKIM setup
EMAIL_FROM_ADDRESS=outreach@mail.dozensupplies.com
EMAIL_FROM_NAME=Dozen Supplies
```

### Prospect discovery (required for lead-research-assistant)

```bash
# Google Maps Places API — for hotel discovery by location
# Status: ❌ NOT YET PROVISIONED
# How to get: Google Cloud Console → Enable Places API → Create API key → restrict to Maps APIs
GOOGLE_MAPS_API_KEY=AIza...
```

### Vector store — RAG pipeline (required for catalog-knowledge-base)

```bash
# Option A — ChromaDB local (no additional key needed, runs locally)
VECTOR_STORE_PATH=./data/chroma

# Option B — Pinecone (for production/cloud deployment)
# Status: ❌ Decision pending — [to be finalized in /workflow]
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=dozen-catalog
```

### Phase 2 — WhatsApp Business API (start application NOW — 2-6 week approval)

```bash
# Meta WABA — quote approval notifications, Phase 2 outreach
# Phone number: +255 772 502 076
# Status: ❌ NOT YET PROVISIONED — CRITICAL PATH DEPENDENCY
# How to get: Meta Business Manager → WhatsApp → Add phone number → apply for WABA
# Timeline: 2-6 weeks for Meta approval. START IMMEDIATELY.
WABA_PHONE_NUMBER_ID=your_phone_number_id
WABA_ACCESS_TOKEN=your_permanent_access_token
WABA_BUSINESS_ACCOUNT_ID=your_waba_business_account_id
```

---

## .env File Template

Copy this to `.env` at the project root and fill in each value:

```bash
# === ANTHROPIC ===
ANTHROPIC_API_KEY=

# === GOOGLE SHEETS ===
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON=
GOOGLE_SHEETS_ID=

# === EMAIL ===
SENDGRID_API_KEY=
# OR
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM_ADDRESS=
EMAIL_FROM_NAME=Dozen Supplies

# === GOOGLE MAPS ===
GOOGLE_MAPS_API_KEY=

# === VECTOR STORE ===
VECTOR_STORE_PATH=./data/chroma
# PINECONE_API_KEY=
# PINECONE_ENVIRONMENT=
# PINECONE_INDEX_NAME=

# === META WABA (Phase 2) ===
WABA_PHONE_NUMBER_ID=
WABA_ACCESS_TOKEN=
WABA_BUSINESS_ACCOUNT_ID=
```

---

## Email Domain Setup (required before outreach)

Configure the dedicated sending subdomain `mail.dozensupplies.com` (or similar):

1. **SPF record** — add to DNS: `v=spf1 include:sendgrid.net ~all`
2. **DKIM** — add CNAME records from SendGrid (or your SMTP provider) to DNS
3. **DMARC** — add to DNS: `v=DMARC1; p=quarantine; rua=mailto:dmarc@dozensupplies.com`
4. **Inbox warming** — start at 20 emails/day, ramp over 6 weeks before full volume
5. Verify with MXToolbox before first send

---

## Status Summary

| Credential | Status | Blocking |
|------------|--------|---------|
| ANTHROPIC_API_KEY | ⚠️ Assumed present — verify | AI tools, RAG |
| GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON | ❌ Not provisioned | Data layer, analytics |
| GOOGLE_SHEETS_ID | ❌ Not provisioned | Data layer, analytics |
| SENDGRID_API_KEY | ❌ Not provisioned | Email outreach |
| EMAIL_FROM_ADDRESS | ❌ Not provisioned | Email outreach |
| GOOGLE_MAPS_API_KEY | ❌ Not provisioned | Prospect discovery |
| VECTOR_STORE_PATH | ⚠️ Default set — ChromaDB local | RAG pipeline |
| WABA_PHONE_NUMBER_ID | ❌ Not provisioned (2-6 week wait) | Phase 2 WhatsApp |
| WABA_ACCESS_TOKEN | ❌ Not provisioned (2-6 week wait) | Phase 2 WhatsApp |
