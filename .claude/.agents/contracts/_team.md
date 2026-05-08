# Team Roster — Dozen Hotel Supplies AI System

**Hired:** 2026-05-07
**Total:** 18 agents

## Contracts (one line per agent)

| Agent | Role | Primary task types | Contract |
|-------|------|--------------------|----------|
| alireza-agent-designer | WAT system architect — designs agent/tool architecture, AI conversation flow, quote escalation logic | catalog-knowledge-base, quote-approval-routing, lead-state-sync, cold-email-outreach | [./contracts/alireza-agent-designer.md](./alireza-agent-designer.md) |
| alireza-cold-email | Cold email sequences + deliverability setup — 3 segments × 522 prospects | cold-email-outreach | [./contracts/alireza-cold-email.md](./alireza-cold-email.md) |
| code-reviewer | Pre-merge code review for all Python tools + Next.js components (Opus, confidence ≥80) | code-review-cycle (all sprints) | [./contracts/code-reviewer.md](./code-reviewer.md) |
| alireza-senior-prompt-engineer | All Claude prompts — outreach persona, inbound handler, quote escalation, RAG queries | cold-email-outreach, inbound-email-response, quote-approval-routing, catalog-knowledge-base | [./contracts/alireza-senior-prompt-engineer.md](./alireza-senior-prompt-engineer.md) |
| alireza-rag-architect | Product catalog RAG pipeline — PDF ingestion, chunking, vector store, retrieval | catalog-knowledge-base | [./contracts/alireza-rag-architect.md](./alireza-rag-architect.md) |
| lead-research-assistant | New prospect discovery via Google Maps + web search — 20+ qualified prospects/week | prospect-discovery | [./contracts/lead-research-assistant.md](./lead-research-assistant.md) |
| research-analyst | Weekly discovery summaries + market intelligence — 1-page reports for Abbie | prospect-discovery, campaign-performance-report | [./contracts/research-analyst.md](./research-analyst.md) |
| python-pro | All Python tools in tools/ — 6 core tools from discover_prospects.py to deduplicate_leads.py | cold-email-outreach, prospect-discovery, lead-state-sync, quote-approval-routing, catalog-knowledge-base | [./contracts/python-pro.md](./python-pro.md) |
| nextjs-developer | dozensupplies.com — 6 pages, mobile-first, Lighthouse >90, quote flow routing | website-sprint | [./contracts/nextjs-developer.md](./nextjs-developer.md) |
| ui-designer | Visual design system — premium B2B hospitality aesthetic, Tailwind tokens, WCAG 2.1 AA | website-sprint | [./contracts/ui-designer.md](./ui-designer.md) |
| data-engineer | Google Sheets lead state database — migrates 522-prospect xlsx, 7 state columns, sync tools | lead-state-sync, prospect-discovery, cold-email-outreach | [./contracts/data-engineer.md](./data-engineer.md) |
| qa-expert | QA testing — email delivery/cadence, Sheets sync integrity, website mobile, quote flow | cold-email-outreach, lead-state-sync, website-sprint, catalog-knowledge-base, code-review-cycle | [./contracts/qa-expert.md](./qa-expert.md) |
| security-auditor | Security audits — credential exposure, PDPA data handling, OWASP website risks (Opus) | code-review-cycle (all sprints) | [./contracts/security-auditor.md](./security-auditor.md) |
| legal-advisor | Tanzania PDPA 2022 lawful basis, WABA policy review, LinkedIn enrichment legality | cold-email-outreach, prospect-discovery, quote-approval-routing | [./contracts/legal-advisor.md](./legal-advisor.md) |
| compliance-auditor | Formal PDPA data inventory, CAN-SPAM checklist, third-party processor assessment (Opus) | cold-email-outreach, lead-state-sync, quote-approval-routing | [./contracts/compliance-auditor.md](./compliance-auditor.md) |
| technical-writer | WAT Workflow SOPs + Dozen Ops Manual + structured catalog markdown for RAG (Haiku) | catalog-knowledge-base, cold-email-outreach, lead-state-sync, website-sprint | [./contracts/technical-writer.md](./technical-writer.md) |
| project-manager | Sprint coordination, risk register, WABA dependency tracking, approval gate enforcement (Haiku) | all task types (parallel coordination) | [./contracts/project-manager.md](./project-manager.md) |
| data-analyst | Weekly campaign performance reports — funnel metrics, segment breakdown, alert signals (Haiku) | campaign-performance-report | [./contracts/data-analyst.md](./data-analyst.md) |

## Skills in use

| Skill | Primary use | Invoked by |
|-------|-------------|------------|
| `/xlsx` | One-time migration of 522-prospect xlsx to Google Sheets | data-engineer |
| `/webapp-testing` | Playwright-based website QA + email flow testing | qa-expert |
| `/copy` | Website copywriting for all 6 pages | nextjs-developer (inputs) |
| `/frontend-design` | Design token implementation guidance | ui-designer |
| `/ui-design-system` | Design system structure scaffolding | ui-designer |
| `/workflow` | Per-task-type SOP authoring for all 10 task types | project orchestrator (Abbie session) |

## MCPs activated

| MCP | Used for | Env var status |
|-----|----------|---------------|
| claude.ai Figma | ui-designer design specs and handoff | ✅ wired globally |
| browser-use | qa-expert Playwright-based website testing | ✅ wired globally |
| Tavily | lead-research-assistant web discovery + research-analyst market intel | ✅ wired globally |
| Gmail | email-related workflow automation | ✅ wired globally |
| Google Drive / Sheets | data-engineer Sheets API v4 integration | ⚠️ service account JSON not yet provisioned |
| Canva | marketing/social assets if needed | ✅ wired globally |

## Plugin bundles activated

| Bundle | Trigger | Sub-agents invoked |
|--------|---------|-------------------|
| plugin-pr-review-toolkit | Any pre-merge code submission in tools/ or website/ | code-reviewer + security-auditor (parallel) |
