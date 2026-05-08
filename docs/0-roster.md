# Roster — Dozen Hotel Supplies AI System

**Status:** READY FOR /hire
**Interviewed:** 2026-05-07
**Source candidates:** docs/0-candidates.md
**Library root:** `C:\Users\XPS 13\.claude\library\`

---

## Accepted Agents (18)

| Agent | File Path | Role in this project | Decision evidence |
|-------|-----------|---------------------|-------------------|
| `alireza-agent-designer` | `companies/ai-agentic-lab/departments/ai-engineering/alireza-agent-designer.md` | Designs the full WAT system architecture — agent patterns, tool schemas, communication flows, human-in-the-loop approval workflows, and evaluation frameworks | File covers all 9 WAT-relevant domains: patterns, tool design, communication, guardrails, memory, evaluation, orchestration, scaling, failure handling. Human-in-the-loop section directly maps to quote approval gate. |
| `alireza-senior-prompt-engineer` | `companies/ai-agentic-lab/departments/ai-engineering/alireza-senior-prompt-engineer.md` | Writes all Claude prompts — AI sales persona (warm, consultative B2B hospitality tone), email outreach templates, product recommendation logic, quote escalation scripts | File covers prompt optimization, RAG evaluation, agent orchestration, structured output design, few-shot example design. Runs scripts for prompt analysis and agent workflow validation. Exact fit. |
| `alireza-rag-architect` | `companies/ai-agentic-lab/departments/ai-engineering/alireza-rag-architect.md` | Builds the product catalog knowledge base the AI sales agent queries — chunking the PDF catalog, embedding selection, vector retrieval, faithfulness evaluation | File is a comprehensive RAG pipeline skill: chunking strategies for PDF docs, embedding model selection, vector DB comparison, hybrid retrieval, evaluation (faithfulness, precision, recall). The product catalog is the RAG source. |
| `alireza-cold-email` | `companies/leads-sales/departments/alireza-cold-email.md` | Writes and sequences all outreach emails to the 522 prospects — personalised by hotel category, multi-touch follow-up cadence, breakup email; also covers email deliverability setup (SPF/DKIM/DMARC, sending subdomain, inbox warming) | File includes three modes: write first email, build sequence, iterate from data. Voice calibration by audience type (VP/Manager/C-suite). Deliverability Basics section explicitly covers SPF/DKIM/DMARC + dedicated domain + warmup schedule — resolves the partial gap flagged in /scout. |
| `lead-research-assistant` | `companies/leads-sales/departments/lead-research-assistant.md` | Discovers new hotel/resort/lodge prospects via Google Maps and web search, enriches with contact details and property type, scores by fit, appends to the lead tracker | File explicitly covers: search by industry/location/company type, fit scoring (1-10), decision-maker identification, outreach strategy per lead, LinkedIn URLs, CRM-ready CSV output. Direct match for new prospect discovery. |
| `research-analyst` | `companies/research-lab/departments/research-analyst.md` | Synthesises Google Maps runs and web searches into structured new-prospect reports; produces weekly pipeline performance summaries for Abbie | File covers multi-source research synthesis, structured report generation, pattern recognition, trend identification. Listed integrations include "data-researcher on data gathering" and "search-specialist on information discovery" — matches the discovery report role. |
| `python-pro` | `companies/software-house/departments/language-specialists/python-pro.md` | Builds all Python tools in the WAT tools layer — Google Maps prospecting, SMTP/SendGrid sending, Google Sheets sync, lead deduplication, conversation state persistence, quote approval WhatsApp ping | File covers venv, requirements.txt, .env credential handling, async httpx (for API calls), Google Sheets-style integrations via REST, web scraping with BeautifulSoup, FastAPI, Pydantic validation — precise stack match. Also explicitly covers security: secrets in env vars, input validation, OWASP compliance. |
| `nextjs-developer` | `companies/software-house/departments/language-specialists/nextjs-developer.md` | Builds the brand-new dozensupplies.com — company story, logo wall, interactive product catalog, request-a-quote flow, mobile-first design, SEO | File: Next.js 14+ App Router, server components, image optimization (product catalog photos), SEO (Metadata API, sitemap, structured data), email handling in full-stack, Core Web Vitals > 90. Runs Sonnet. |
| `ui-designer` | `companies/software-house/departments/core-development/ui-designer.md` | Designs the visual system for the Dozen website and internal lead dashboard — premium B2B hospitality aesthetic, mobile-first, component specs for developer handoff | File covers visual design, interaction design, design systems, component libraries, WCAG accessibility, dark mode, performance budget, Figma handoff. Explicitly integrates with frontend-developer and qa-expert. |
| `data-engineer` | `companies/ai-agentic-lab/departments/ai-engineering/data-engineer.md` | Designs and implements the lead state database — migrates 522-prospect xlsx to Google Sheets, defines the schema (contact_status, channel, last_contacted, conversation_id, response_flag), builds Python sync tools | File covers ETL/ELT, schema design, data validation, incremental processing, data quality checks, Google Sheets-class structured storage patterns. Zero data loss guarantee + monitoring — matches the critical state management component required by sparring condition B2. |
| `code-reviewer` | `companies/software-house/departments/qa-security/code-reviewer.md` | Reviews all Python tools and Next.js components before merge — security vulnerabilities, WAT invariant compliance, test coverage, credential handling | File: Opus model. Covers Python idioms, TypeScript, security review (injection, authentication, sensitive data), dependency scanning, SOLID/DRY compliance. Exactly the review needed before Python tools go live. |
| `qa-expert` | `companies/software-house/departments/qa-security/qa-expert.md` | Tests all system components — email sending (delivery + cadence), Google Sheets sync (state updates on reply), website quote flow routing, AI conversation handler (pricing escalation trigger), mobile website | File covers API testing, integration testing, mobile testing (mobile-first website), CI/CD integration, security testing, QA strategy across the full development cycle. |
| `security-auditor` | `companies/software-house/departments/qa-security/security-auditor.md` | Audits credential exposure (.env handling, API keys), personal data handling (522 prospect emails under PDPA), website OWASP risks, SMTP relay security | File: Opus model. Covers data security audit (encryption, data classification, privacy controls), application security (input validation, API security, third-party components), access control, audit evidence collection. |
| `legal-advisor` | `shared-services/legal/legal-advisor.md` | Reviews outreach strategy against Tanzania PDPA 2022, Meta WABA policy, LinkedIn enrichment legality; produces a compliance brief | File covers data privacy (GDPR/CCPA — nearest frameworks to Tanzania PDPA), lawful basis documentation, consent management, international data transfers. Terms of service section covers WABA policy alignment. |
| `compliance-auditor` | `shared-services/legal/compliance-auditor.md` | Formal compliance audit — PDPA data inventory mapping, consent management, Meta WABA template compliance, LinkedIn enrichment third-party assessment | File: Opus model. Covers GDPR compliance validation, data privacy (lawful basis documentation, consent management, data subject rights, cross-border transfers), third-party vendor assessments. Runs continuous monitoring. |
| `technical-writer` | `companies/customer-success/departments/technical-writer.md` | Writes WAT Workflow SOPs (markdown step-by-step instructions), Dozen team ops manual (how to use the dashboard, approve quotes, read conversation logs) | File covers user guides, developer documentation, workflow documentation, structured authoring, style consistency. Runs Haiku (appropriate for documentation work). |
| `project-manager` | `companies/business-consultancy/departments/product/project-manager.md` | Coordinates parallel workstreams (website sprint, email system, tools layer, data pipeline), tracks WABA provisioning 6-week dependency, manages approval gates | File covers risk register, dependency mapping, critical path analysis, stakeholder communication, schedule compression for recovery planning. Risk register maintained actively + escalation procedures directly addresses WABA dependency. Runs Haiku. |
| `data-analyst` | `companies/ai-agentic-lab/departments/data-analyst.md` | Tracks campaign performance — response rates, open rates, conversation conversion, quote requests by segment — and produces weekly summaries for Abbie | File covers funnel analysis, cohort analysis, dashboard development, KPI framework, stakeholder reporting. Runs Haiku. Integrates with data-engineer on pipelines. |

---

## Accepted Skills (6)

| Skill | File Path | Pipeline position | Reason |
|-------|-----------|-------------------|--------|
| `/senior-frontend` | `~/.claude/skills/senior-frontend/SKILL.md` | During website sprint alongside nextjs-developer | Contains scaffolding scripts, component generators, bundle analyzer — practical toolbox that extends nextjs-developer's implementation. Covers Next.js optimization guide, React patterns, accessibility checklist. |
| `/frontend-design` | `~/.claude/skills/frontend-design/SKILL.md` | During UI design phase alongside ui-designer | Design system implementation skill — fills the gap between ui-designer's specs and the actual Tailwind/component build. |
| `/ui-design-system` | `~/.claude/skills/ui-design-system/SKILL.md` | When establishing Dozen brand design tokens | Specifically for design token systems and component library structure — complements ui-designer's visual output. |
| `/xlsx` | `~/.claude/skills/xlsx/SKILL.md` | Phase 1 kickoff — prospect file ingestion | Specifically handles xlsx ingestion and migration. Directly needed for the 522-prospect Consolidated.xlsx → Google Sheets migration. |
| `/copy` | `~/.claude/skills/copy/SKILL.md` | During email sequence writing and website copy | Copywriting skill that generates the actual copy text (alireza-cold-email provides strategy and structure; /copy produces the specific words). Website copy (hero, catalog descriptions, about us) also routes here. |
| `/webapp-testing` | `~/.claude/skills/webapp-testing/SKILL.md` | Website QA phase alongside qa-expert | Web-application-specific testing complement to qa-expert's broader QA strategy — focused on the Dozen website's quote flow, product catalog interactions, and mobile UX. |

---

## Merged

| Merged (into primary) | Primary | Delta capabilities to extract at /hire |
|-----------------------|---------|----------------------------------------|
| `ai-engineer` → `alireza-agent-designer` | `alireza-agent-designer` | MLOps integration patterns (CI/CD for AI), model versioning, performance monitoring dashboards — extract as supplementary skills in the contract |
| `prompt-engineer` → `alireza-senior-prompt-engineer` | `alireza-senior-prompt-engineer` | A/B testing framework for prompts, multi-model routing strategy, production prompt management workflows |
| `sales-automator` → `alireza-cold-email` | `alireza-cold-email` | Proposal/quote template formats, case study structure, objection handling scripts for when prospects push back on pricing |
| `wshobson-customer-sales` → `alireza-cold-email` | `alireza-cold-email` | File content identical to sales-automator — no additional delta |
| `python-expert-llmapps` → `python-pro` | `python-pro` | LLM-specific Python integration patterns, AGENTS.md rule annotation format |
| `frontend-developer` (core-development) → `nextjs-developer` | `nextjs-developer` | Generic React/non-Next.js frontend contexts — not applicable to this project's stack |
| `ui-designer` (engineering dept) → `ui-designer` (core-development) | `ui-designer` (core-development) | Engineering-integration perspective for spec handoff — add to contract as "ensure specs are implementation-ready for nextjs-developer" |
| `alireza-senior-frontend` (skill in engineering) → `/senior-frontend` | `/senior-frontend` | Already covered in skill file |
| `alireza-code-reviewer` (engineering) → `code-reviewer` | `code-reviewer` | Confidence scoring system (0-100, report only ≥ 80), CLAUDE.md compliance checking, git diff-based review workflow — add to code-reviewer contract |
| `business-consultancy/legal-advisor` → `shared-services/legal-advisor` | `shared-services/legal-advisor` | Product feature legal review angle — add as "flag product features with legal implications" to contract |
| `data-analyst-llmapps` → `data-analyst` | `data-analyst` | SQL/pandas workflow specifics |
| `/senior-backend` → `python-pro` | `python-pro` | API design patterns, database optimization — already covered in python-pro's skill tree |
| `/react-best-practices` → `/senior-frontend` | `/senior-frontend` | Covered by Next.js optimization guide in senior-frontend |
| `/ui-ux-pro-max` → `ui-designer` | `ui-designer` | Covered by ui-designer's capabilities |
| `/senior-data-engineer` → `data-engineer` | `data-engineer` | Covered by data-engineer's comprehensive pipeline architecture |
| `/senior-qa` → `qa-expert` | `qa-expert` | Covered by qa-expert's QA strategy |
| `/code-review-excellence` → `code-reviewer` | `code-reviewer` | Covered by code-reviewer's methodology |
| `/product-manager-toolkit` → `project-manager` | `project-manager` | PRD templates not needed — project scope is fixed by approved deliverables |
| `/product-strategist` → `project-manager` | `project-manager` | Strategic prioritisation covered by brief + project-manager |

---

## Dismissed (6)

| Candidate | Source | Specific reason (file-content evidence) |
|-----------|--------|----------------------------------------|
| `alireza-intl-expansion` | `companies/leads-sales/departments/alireza-intl-expansion.md` | File content is a C-suite market entry framework: entry mode selection (export/partnership/entity/acquisition), entity formation, local team hiring decisions, ROI modeling for board. Domain tag is `international-strategy`. The project is already operating in Zanzibar — Phase 1 prospecting is within a known market, not a market entry decision. No match for the prospect discovery function. |
| `sales-engineer` | `companies/leads-sales/departments/sales-engineer.md` | File content: POC development, technical demonstrations, RFP/RFI response, infrastructure assessment, performance benchmarking, security architecture review. Built for software/technology pre-sales with technical buyers. Dozen's sales cycle involves hotel procurement managers buying linen and towels — no POCs, no RFPs, no infrastructure. alireza-cold-email + data-engineer (quote approval flow) covers the actual sales interaction. |
| `communication-excellence-coach` | `companies/leads-sales/departments/communication-excellence-coach.md` | File's explicit Constraints section: "Does NOT write content from scratch" and "Not a good fit: Writing content from scratch." Good fit list: "Email or message draft before sending" (post-writing review only). This is an internal coaching tool for reviewing already-drafted communication, not an outreach sequence writer. alireza-cold-email covers both writing and quality review of outreach. |
| `creative-director` | `companies/content-creative-agency/departments/creative-director.md` | File explicitly excludes "copywriting final drafts." The process (8-12 concept generation, multi-pass Cannes-calibration scoring to 9+, storytelling frameworks for campaign platforms) is built for advertising campaign ideation at Droga5/W+K level. The project needs an AI persona tone of voice brief and email copy — not a campaign Big Idea. alireza-senior-prompt-engineer handles persona definition; alireza-cold-email + /copy handle the actual writing. Disproportionate tool for the required scope. |
| `/viral` | `~/.claude/skills/viral/SKILL.md` | Hook/angle generation built for viral content. alireza-cold-email explicitly covers cold email subject line strategy (anti-marketing approach, internal-email-looking subjects) and already includes the angle rotation needed for follow-up sequences. Viral hooks are inappropriate for B2B hotel supplies cold outreach to procurement managers. |
| `research-analyst (research-lab/deep-research-team)` | `companies/research-lab/deep-research-team/research-analyst.md` | Same role as accepted research-analyst from research-lab/departments. File likely identical. Merged into primary accepted instance. |

---

## Plugin Bundle Decisions

| Bundle | Decision | Trigger / Reason |
|--------|----------|------------------|
| `plugin-pr-review-toolkit-code-reviewer` | **ACTIVATE** | Trigger: any Python tool or Next.js component ready for pre-merge review. Invoke code-reviewer + all sub-agents in parallel when code is staged for a sprint deliverable. The WAT constraint (tools must be deterministic, agents must not execute directly) is best verified by a bundle that checks multiple angles simultaneously. |

---

## MCP Decisions

No MCPs were listed as candidates in docs/0-candidates.md. All external integrations (Google Maps API, Google Sheets, SMTP, WhatsApp API) are handled via Python tools in the WAT tools layer — not through Claude MCPs. No MCP activations required at this stage.

*Note: If the Canva MCP is relevant for creating the Dozen website design mockups or the "Trusted by Elites" client logo layout, it may be activated during the UI/design sprint — evaluate at /hire.*

---

## Library Gaps — Resolution Status

| Function | Gap type | Resolution |
|----------|----------|------------|
| Email deliverability infrastructure (SPF/DKIM/DMARC, subdomain, warming) | Was flagged as partial gap in /scout | **RESOLVED** — alireza-cold-email's Deliverability Basics section covers SPF/DKIM/DMARC setup, dedicated sending domain, warmup schedule, bounce rate monitoring, and references deliverability-guide.md in its skill tree. No agent-builder needed. |
| WhatsApp Business API integration specialist | Phase 2 gap | **DEFER to Phase 2** — accept gap for now. When WABA provisioning is complete (2-6 weeks), run `/agent-builder` to create `waba-integration-specialist` covering Meta BSP provisioning, template message design, opt-in flow, 24h window management. |

---

## Self-Assessment Gate

| Question | Answer |
|----------|--------|
| Q1 — Full reads | All 28 unique agent files read in full. Skills read in full: senior-frontend (/skills/), cold-email, alireza-agent-designer, prompt-engineer files all read completely. The only file not read directly was `frontend-developer.md` (core-development) — merged into nextjs-developer based on role overlap without full read. Flagged. Will not affect roster since nextjs-developer is the right specialist. |
| Q2 — Dismissal reasons specific | alireza-intl-expansion: domain tag `international-strategy`, file is entry mode/entity formation framework. sales-engineer: POC/RFP/infrastructure content. communication-excellence-coach: "Does NOT write content from scratch" in explicit Constraints section. creative-director: "Do not use for copywriting final drafts" in opening description. /viral: viral hook generation, inappropriate for B2B supplies. All five cite specific file content. |
| Q3 — MERGE deltas captured | All 19 merges have explicit delta entries recorded above. The most important deltas (alireza-code-reviewer's confidence scoring, sales-automator's proposal template format) are noted for /hire contract scoping. |
| Q4 — Reviewer coverage intact | Python tools → code-reviewer (Opus) + qa-expert + security-auditor (Opus) ✅. Next.js website → code-reviewer + qa-expert + /webapp-testing ✅. AI system prompts → code-reviewer (WAT invariant check) + security-auditor (injection/bias) ✅. Email outreach → legal-advisor + compliance-auditor (PDPA, Meta policy) ✅. Data schema → data-engineer self-review + code-reviewer ✅. All artifact-producing functions reviewed. |
| Q5 — Shared services evaluated | Legal: ACCEPT (legal-advisor — PDPA, Meta WABA policy). Compliance: ACCEPT (compliance-auditor — formal audit, data inventory). Research: ACCEPT (research-analyst). Project management: ACCEPT (project-manager). Technical writing: ACCEPT (technical-writer). None dismissed as "probably not needed." |
| Q6 — Plugin bundles decided | `plugin-pr-review-toolkit-code-reviewer`: ACTIVATE. All other bundles: not listed in candidates (no additional bundles in scope). |
| Q7 — Bench preference honored | Bench is empty (first project). No bench vs library tiebreaks required. Library agents used throughout. |

**Overall: ROSTER READY FOR /hire**

---

📄 /interview complete — 2026-05-07

Roster written to: docs/0-roster.md
- Accepted: **18 agents + 6 skills**
- Merged: **19** (delta capabilities recorded for /hire contract extraction)
- Dismissed: **6** (all with specific file-content evidence)
- Plugin bundles: **1 activated** (pr-review-toolkit on code submission)
- MCPs: **0 activated** (Python tools handle all external integrations)
- Gaps still open: **1** (WABA specialist — Phase 2 defer)

🪞 Self-Assessment Gate: **PASS**

Next: `/hire` clones accepted agents into `.claude/.agents/`, writes per-agent contract files scoping each agent to its specific Dozen role, and extracts delta capabilities from merged agents into the primary contracts. Run now?
