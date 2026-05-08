# Team: Dozen Hotel Supplies AI System

**Assembled:** 2026-05-07 | **Last Updated:** 2026-05-07

---

## Hired Agents

| Agent | Source | Role | Model | Contract |
|-------|--------|------|-------|----------|
| alireza-agent-designer | library | WAT system architect — conversation flow, tool schemas, escalation logic | Sonnet | [contract](.agents/contracts/alireza-agent-designer.md) |
| alireza-cold-email | library (+ sales-automator delta) | Cold email sequences + deliverability — 3 segments, inbox warming | Sonnet | [contract](.agents/contracts/alireza-cold-email.md) |
| code-reviewer | library (+ alireza-code-reviewer delta) | Pre-merge review — confidence ≥80, WAT invariants, CLAUDE.md compliance | **Opus** | [contract](.agents/contracts/code-reviewer.md) |
| alireza-senior-prompt-engineer | library (+ prompt-engineer delta) | All production Claude prompts — outreach, inbound, escalation, RAG | Sonnet | [contract](.agents/contracts/alireza-senior-prompt-engineer.md) |
| alireza-rag-architect | library | Product catalog RAG pipeline — PDF chunking, vector store, evaluation | Sonnet | [contract](.agents/contracts/alireza-rag-architect.md) |
| lead-research-assistant | library | New prospect discovery — Google Maps + web, 20+ per weekly run | Sonnet | [contract](.agents/contracts/lead-research-assistant.md) |
| research-analyst | library | Discovery summaries + market intelligence — 1-page Monday reports | Sonnet | [contract](.agents/contracts/research-analyst.md) |
| python-pro | library (+ python-expert-llmapps delta) | All Python tools in tools/ — 6 core tools, Anthropic SDK integration | Sonnet | [contract](.agents/contracts/python-pro.md) |
| nextjs-developer | library | dozensupplies.com — App Router, 6 pages, Lighthouse >90, mobile-first | Sonnet | [contract](.agents/contracts/nextjs-developer.md) |
| ui-designer | library (+ ui-designer-engineering-dept delta) | Visual design system — hospitality aesthetic, Tailwind tokens, WCAG 2.1 AA | Sonnet | [contract](.agents/contracts/ui-designer.md) |
| data-engineer | library | Google Sheets lead state DB — xlsx migration, 7 state columns, sync | Sonnet | [contract](.agents/contracts/data-engineer.md) |
| qa-expert | library | QA — email delivery, Sheets sync, website mobile, quote flow routing | Sonnet | [contract](.agents/contracts/qa-expert.md) |
| security-auditor | library | Security audits — credentials, PDPA data, OWASP website, SMTP relay | **Opus** | [contract](.agents/contracts/security-auditor.md) |
| legal-advisor | library (+ business-consultancy/legal delta) | Tanzania PDPA 2022, WABA policy, LinkedIn enrichment legality | Sonnet | [contract](.agents/contracts/legal-advisor.md) |
| compliance-auditor | library | PDPA inventory, CAN-SPAM, third-party processor assessment | **Opus** | [contract](.agents/contracts/compliance-auditor.md) |
| technical-writer | library | WAT SOPs + Dozen Ops Manual + catalog markdown for RAG | **Haiku** | [contract](.agents/contracts/technical-writer.md) |
| project-manager | library | Sprint coordination, risk register, WABA tracking, gate enforcement | **Haiku** | [contract](.agents/contracts/project-manager.md) |
| data-analyst | library | Weekly campaign performance reports — funnel metrics, segment analytics | **Haiku** | [contract](.agents/contracts/data-analyst.md) |

---

## MCPs

| MCP | Used For | Status | Last Verified |
|-----|----------|--------|---------------|
| claude.ai Figma | ui-designer design specs and handoff | ✅ wired globally | 2026-05-07 |
| browser-use | qa-expert Playwright website testing | ✅ wired globally | 2026-05-07 |
| Tavily | lead-research-assistant discovery + research-analyst market intel | ✅ wired globally | 2026-05-07 |
| Gmail | email workflow automation | ✅ wired globally | 2026-05-07 |
| Google Drive / Sheets | data-engineer Sheets API v4 | ⚠️ connected but GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON not provisioned | 2026-05-07 |
| Canva | marketing / social assets | ✅ wired globally | 2026-05-07 |
| 21st-dev-magic | UI component generation (nextjs-developer) | ✅ wired globally | 2026-05-07 |
| ElevenLabs | audio/voice (not needed this sprint — available) | ⬜ available but not activated | 2026-05-07 |
| fal.ai | image generation (product photos if needed) | ⬜ available but not activated | 2026-05-07 |

---

## Resource Routing Map

| Task Type | Primary Agent(s) | Reviewer(s) | Notes |
|-----------|-----------------|-------------|-------|
| cold-email-outreach | alireza-cold-email, alireza-senior-prompt-engineer | legal-advisor, compliance-auditor, qa-expert, code-reviewer | PDPA sign-off required before first send |
| prospect-discovery | lead-research-assistant, python-pro | research-analyst, code-reviewer, security-auditor | GOOGLE_MAPS_API_KEY required |
| lead-triage | alireza-agent-designer, alireza-senior-prompt-engineer | — | Fit score threshold defined by agent-designer |
| inbound-email-response | alireza-agent-designer, alireza-senior-prompt-engineer | qa-expert | WAT: tools execute, agent decides |
| quote-approval-routing | alireza-agent-designer, python-pro | security-auditor, legal-advisor, qa-expert | Quote always indicative; owner must approve |
| lead-state-sync | data-engineer, python-pro | code-reviewer, security-auditor, compliance-auditor | Idempotent sync required |
| website-sprint | nextjs-developer, ui-designer | code-reviewer, security-auditor, qa-expert | technical-writer produces catalog markdown input |
| catalog-knowledge-base | alireza-rag-architect, python-pro, technical-writer | qa-expert, code-reviewer | PDF source required from Dozen |
| campaign-performance-report | data-analyst | research-analyst, project-manager | Google Sheets service account required |
| code-review-cycle | code-reviewer, security-auditor | — | plugin-pr-review-toolkit fires both in parallel |

---

## Skills in Use

| Skill | Pipeline Step | Purpose |
|-------|--------------|---------|
| `/xlsx` | lead-state-sync setup | One-time 522-prospect xlsx → Google Sheets migration |
| `/webapp-testing` | website-sprint review | Playwright-based site QA + mobile testing |
| `/copy` | website-sprint input | Website copy for all 6 pages |
| `/frontend-design` | website-sprint design | Design token implementation patterns |
| `/ui-design-system` | website-sprint design | Design system scaffolding |
| `/workflow` | post-/hire | Writes 10 per-task-type SOPs in workflows/ |

---

## Plugins in Use

| Bundle | When to use on this project | Sub-agents to invoke |
|--------|-----------------------------|----------------------|
| plugin-pr-review-toolkit | Every pre-merge code submission in tools/ or website/ | code-reviewer + security-auditor (parallel) |

---

## Env Vars

| Variable | Required By | Status |
|----------|------------|--------|
| ANTHROPIC_API_KEY | python-pro (all AI tools), alireza-rag-architect | ⚠️ assumed present — verify |
| GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON | data-engineer, data-analyst, python-pro (sync_lead_state.py) | ❌ Not yet provisioned |
| GOOGLE_MAPS_API_KEY | lead-research-assistant, python-pro (discover_prospects.py) | ❌ Not yet provisioned |
| SENDGRID_API_KEY (or SMTP_HOST/USER/PASS) | python-pro (send_email.py), alireza-cold-email | ❌ Not yet provisioned |
| EMAIL_FROM_ADDRESS | python-pro (send_email.py) | ❌ Not yet provisioned |
| VECTOR_STORE_PATH (or PINECONE_API_KEY) | alireza-rag-architect, python-pro (ingest_catalog.py) | ❌ Not yet provisioned — local ChromaDB or Pinecone TBD |
| WABA_PHONE_NUMBER_ID | python-pro (notify_approval.py) | ❌ Not yet provisioned — requires Meta WABA application |
| WABA_ACCESS_TOKEN | python-pro (notify_approval.py) | ❌ Not yet provisioned — requires Meta WABA application |

---

## Team Evolution Log

| Date | Sprint | Key Learnings | Agents Specialized |
|------|--------|---------------|-------------------|
| 2026-05-07 | Setup | Team assembled via /hire — 18 agents, 6 merges applied, 10 task types identified | — |
