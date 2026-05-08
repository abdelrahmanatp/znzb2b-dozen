# Master Orchestration — Dozen Hotel Supplies AI System

**Generated:** 2026-05-07
**SOPs:** 10
**Agents hired:** 18

## Project-level Chart

```mermaid
flowchart LR
  subgraph SETUP["Setup Phase (Pre-launch)"]
    LS[lead-state-sync SOP<br/>data-engineer + python-pro]
    LSS[/xlsx skill<br/>migrate_xlsx.py<br/>522 prospects → Sheets]
    LS --> LSS
  end

  subgraph LEGAL["Legal Gate (Mandatory Before Outreach)"]
    LA[legal-advisor<br/>PDPA Lawful Basis Opinion]
    CA[compliance-auditor<br/>CAN-SPAM + PDPA inventory]
    LA --> CA
  end

  subgraph DISCOVERY["Prospect Discovery (Weekly)"]
    PD[prospect-discovery SOP<br/>lead-research-assistant<br/>≥20 prospects/week]
  end

  subgraph OUTREACH["Cold Email Outreach"]
    CE[cold-email-outreach SOP<br/>alireza-cold-email<br/>alireza-senior-prompt-engineer<br/>python-pro]
  end

  subgraph TRIAGE["Inbound Processing"]
    LT[lead-triage SOP<br/>python-pro<br/>alireza-agent-designer]
    IER[inbound-email-response SOP<br/>alireza-agent-designer<br/>python-pro]
    QAR[quote-approval-routing SOP<br/>notify_approval.py → WABA]
    LT -->|QUESTION| IER
    LT -->|QUOTE_REQUEST| QAR
  end

  subgraph WEBSITE["Website"]
    WS[website-sprint SOP<br/>ui-designer + nextjs-developer<br/>alireza-rag-architect]
  end

  subgraph KB["Catalog Knowledge Base"]
    CKB[catalog-knowledge-base SOP<br/>technical-writer + alireza-rag-architect<br/>python-pro]
  end

  subgraph REVIEW["Code Review (Every Merge)"]
    CRC[code-review-cycle SOP<br/>code-reviewer + security-auditor<br/>plugin-pr-review-toolkit]
  end

  subgraph REPORTING["Reporting (Weekly)"]
    CPR[campaign-performance-report SOP<br/>data-analyst + research-analyst]
  end

  %% Setup feeds outreach
  SETUP --> LEGAL
  LEGAL -->|GO| OUTREACH
  DISCOVERY -.new prospects.-> OUTREACH

  %% Outreach feeds triage
  OUTREACH -->|replies| TRIAGE
  TRIAGE -->|state updates| SETUP

  %% Website feeds inbound (quote form)
  WEBSITE -.quote form submissions.-> QAR

  %% Catalog feeds both website and inbound
  CKB -.product specs.-> WS
  CKB -.RAG queries.-> IER
  CKB -.RAG queries.-> QAR

  %% Review gates all code
  OUTREACH -.code submissions.-> REVIEW
  KB -.code submissions.-> REVIEW
  WS -.code submissions.-> REVIEW

  %% Reporting monitors everything
  OUTREACH -.metrics.-> REPORTING
  DISCOVERY -.yield data.-> REPORTING
  TRIAGE -.conversion data.-> REPORTING
```

## SOPs Index

| Task type | SOP file | Phase | Primary agents | Tools/MCPs |
|-----------|----------|-------|----------------|------------|
| cold-email-outreach | [cold-email-outreach.md](./cold-email-outreach.md) | Pre-launch → Ongoing | alireza-cold-email, alireza-senior-prompt-engineer, python-pro | send_email.py, deduplicate_leads.py, sync_lead_state.py, SendGrid |
| prospect-discovery | [prospect-discovery.md](./prospect-discovery.md) | Weekly recurring | lead-research-assistant, data-engineer, research-analyst | discover_prospects.py, Google Maps API, Tavily |
| lead-triage | [lead-triage.md](./lead-triage.md) | Per-reply (real-time) | python-pro, alireza-agent-designer, alireza-senior-prompt-engineer | triage_reply.py, sync_lead_state.py, Claude API |
| inbound-email-response | [inbound-email-response.md](./inbound-email-response.md) | Per-question reply | alireza-agent-designer, alireza-senior-prompt-engineer, python-pro | fetch_conversation_context.py, generate_response.py, send_email.py, ingest_catalog.py |
| quote-approval-routing | [quote-approval-routing.md](./quote-approval-routing.md) | Per-quote request | alireza-agent-designer, alireza-senior-prompt-engineer, python-pro | generate_quote_draft.py, notify_approval.py, WABA API |
| lead-state-sync | [lead-state-sync.md](./lead-state-sync.md) | Setup (one-time) + Ongoing (per event) | data-engineer, python-pro | migrate_xlsx.py, sync_lead_state.py, Google Sheets API |
| website-sprint | [website-sprint.md](./website-sprint.md) | Sprint (one-time build) | ui-designer, nextjs-developer, alireza-rag-architect, technical-writer | /copy skill, browser-use, Figma MCP, Vercel |
| catalog-knowledge-base | [catalog-knowledge-base.md](./catalog-knowledge-base.md) | Sprint + on catalog update | technical-writer, alireza-rag-architect, python-pro | ingest_catalog.py, ChromaDB/Pinecone, Claude API |
| campaign-performance-report | [campaign-performance-report.md](./campaign-performance-report.md) | Weekly recurring | data-analyst, research-analyst | Google Sheets API, SendGrid API, Tavily |
| code-review-cycle | [code-review-cycle.md](./code-review-cycle.md) | Per-merge (every code submission) | code-reviewer, security-auditor | git diff, plugin-pr-review-toolkit |

## Agent Load Across SOPs

| Agent | SOPs | Flag |
|-------|------|------|
| python-pro | cold-email-outreach, prospect-discovery, lead-triage, inbound-email-response, quote-approval-routing, lead-state-sync, catalog-knowledge-base | — (core infrastructure layer) |
| alireza-agent-designer | lead-triage, inbound-email-response, quote-approval-routing | — |
| alireza-senior-prompt-engineer | cold-email-outreach, lead-triage, inbound-email-response, quote-approval-routing | — |
| alireza-cold-email | cold-email-outreach | — |
| alireza-rag-architect | catalog-knowledge-base, website-sprint | — |
| lead-research-assistant | prospect-discovery | — |
| research-analyst | prospect-discovery, campaign-performance-report | — |
| nextjs-developer | website-sprint | — |
| ui-designer | website-sprint | — |
| data-engineer | lead-state-sync, prospect-discovery | — |
| qa-expert | cold-email-outreach, website-sprint, code-review-cycle | — |
| code-reviewer | cold-email-outreach, code-review-cycle | — (plugin-pr-review-toolkit fires for all code) |
| security-auditor | cold-email-outreach, code-review-cycle | — (plugin-pr-review-toolkit fires for all code) |
| legal-advisor | cold-email-outreach (Phase 1) | — |
| compliance-auditor | cold-email-outreach (Phase 1) | — |
| technical-writer | cold-email-outreach, website-sprint, catalog-knowledge-base | — |
| project-manager | cold-email-outreach, prospect-discovery, lead-state-sync, quote-approval-routing, campaign-performance-report, code-review-cycle | — (cross-SOP coordination) |
| data-analyst | prospect-discovery, campaign-performance-report | — |

**Orphan check result:** ✅ All 18 agents appear in at least one SOP. Zero orphans.

## Tools / MCPs Load Across SOPs

| Tool/MCP | SOPs | Flag |
|----------|------|------|
| `tools/send_email.py` | cold-email-outreach, inbound-email-response, quote-approval-routing | — |
| `tools/deduplicate_leads.py` | cold-email-outreach | — |
| `tools/sync_lead_state.py` | lead-triage, inbound-email-response, quote-approval-routing, lead-state-sync | — |
| `tools/triage_reply.py` | lead-triage | — |
| `tools/discover_prospects.py` | prospect-discovery | — |
| `tools/fetch_conversation_context.py` | inbound-email-response, quote-approval-routing | — |
| `tools/generate_response.py` | inbound-email-response | — |
| `tools/generate_quote_draft.py` | quote-approval-routing | — |
| `tools/notify_approval.py` | quote-approval-routing | — |
| `tools/migrate_xlsx.py` | lead-state-sync | — |
| `tools/ingest_catalog.py` | catalog-knowledge-base, inbound-email-response, quote-approval-routing | — |
| Google Sheets API | lead-state-sync, prospect-discovery, inbound-email-response, quote-approval-routing, campaign-performance-report | — |
| Google Maps API | prospect-discovery | — |
| SendGrid API | cold-email-outreach, inbound-email-response, quote-approval-routing, campaign-performance-report | — |
| Meta WABA API | quote-approval-routing | ⚠️ Not provisioned — 2-6 week approval; email fallback active until provisioned |
| Claude API | lead-triage, inbound-email-response, quote-approval-routing, catalog-knowledge-base | — |
| Tavily MCP | prospect-discovery, campaign-performance-report | — |
| browser-use MCP | website-sprint (ui-designer research + qa-expert testing) | — |
| Figma MCP | website-sprint (ui-designer) | — |
| `/copy` skill | website-sprint | — |
| `/xlsx` skill | lead-state-sync (migration) | — |
| ChromaDB / Pinecone | catalog-knowledge-base | ⚠️ Vector store decision pending |

**Orphan check result:** ✅ All tools/MCPs in Resource Routing Map appear in at least one SOP. Zero orphans.

## Critical Path

The project has a hard sequential dependency chain for the outreach pipeline:

```
Google Sheets provisioned → lead-state-sync (migrate_xlsx.py) →
legal-advisor (PDPA opinion) → compliance-auditor (CAN-SPAM) →
cold-email-outreach (warmup starts Day 1)
```

The website and catalog can build in parallel with this chain.

WABA provisioning is the single longest-lead dependency (2-6 weeks) and gates `quote-approval-routing` Phase 2. Start immediately.

## Team Evolution Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-05-07 | Initial /workflow SOP authoring — 10 SOPs written | /hire complete, ready for /preflight |
