# Candidates — Dozen Hotel Supplies AI System

**Status:** READY FOR /interview
**Scouted:** 2026-05-07
**Source brief:** docs/1-brief.md (FINALIZED)
**Library root:** `C:\Users\XPS 13\.claude\library\`
**Internal agents:** None (registries empty — first project)
**Bench:** Empty (no domain-matched veterans yet)

---

## Four Pillar Audit

| Pillar | Status | Covered by / Gap |
|--------|--------|-----------------|
| Business | COVERED | legal-advisor (PDPA, Meta policy), compliance-auditor, project-manager, intl-expansion (Zanzibar B2B context), communication-excellence-coach |
| Design | COVERED | ui-designer (software-house), creative-director (brand voice + AI persona), /frontend-design skill, /ui-ux-pro-max skill, nextjs-developer |
| Technical | COVERED | ai-engineer, alireza-agent-designer (WAT architecture), alireza-rag-architect (product catalog knowledge base), python-pro (tools layer), nextjs-developer (website), data-engineer (Google Sheets sync + lead state), alireza-senior-prompt-engineer |
| Supportive | PARTIAL | code-reviewer ✅, qa-expert ✅, security-auditor ✅, technical-writer ✅, compliance-auditor ✅. **GAP: email deliverability specialist** (SPF/DKIM/DMARC setup, sending domain warming) — no library match → flagged for /agent-builder |

---

## Core Functions

### 1. WAT Agent Architecture & AI System Design
**What it does for this project:** Designs the full WAT-framework system — Workflows (markdown SOPs), Agents (Claude), Tools (Python scripts) — ensuring the prospecting, outreach, and sales conversation layers are properly separated and orchestrated per the mandatory WAT invariant.
**Candidates:**
- `alireza-agent-designer` (source: library) — path: `companies/ai-agentic-lab/departments/ai-engineering/alireza-agent-designer.md` — why plausible: purpose-built for multi-agent system design with explicit WAT-style separation of concerns
- `ai-engineer` (source: library) — path: `companies/ai-agentic-lab/departments/ai-engineer.md` — why plausible: senior AI engineering, end-to-end system architecture including tool integration and orchestration
- `/senior-architect` (source: skills) — path: `~/.claude/skills/senior-architect/SKILL.md` — why plausible: system design, architecture decisions, tech stack selection for the full platform

**Plugin bundle:** n/a
**Gap:** None

---

### 2. Prompt Engineering & AI Persona / Brand Voice
**What it does for this project:** Writes all Claude prompts — the AI sales agent persona (warm, consultative, B2B hospitality tone), email outreach templates, inbound inquiry handling instructions, product recommendation logic, and quote escalation scripts. This is the deterministic specification of how the AI behaves in every channel.
**Candidates:**
- `alireza-senior-prompt-engineer` (source: library) — path: `companies/ai-agentic-lab/departments/ai-engineering/alireza-senior-prompt-engineer.md` — why plausible: senior-level prompt engineering for production AI agents, evaluation frameworks
- `prompt-engineer` (source: library) — path: `companies/ai-agentic-lab/departments/prompt-engineer.md` — why plausible: general prompt engineering, template design
- `creative-director` (source: library) — path: `companies/content-creative-agency/departments/creative-director.md` — why plausible: brand voice definition, tone of voice for AI persona, storytelling frameworks that translate directly to outreach copy

**Plugin bundle:** n/a
**Gap:** None

---

### 3. Cold Email Outreach — 522-Prospect Pipeline Activation
**What it does for this project:** Writes and sequences the cold email campaigns that contact the 522 existing prospects (and newly discovered leads) from info@dozensupplies.com. Each email must be personalised by hotel category (resort vs boutique vs villa), reference Dozen's product line relevant to that property type, and include compliant follow-up cadences. This is Phase 1's primary revenue-generating mechanism.
**Candidates:**
- `alireza-cold-email` (source: library) — path: `companies/leads-sales/departments/alireza-cold-email.md` — why plausible: specialises in personalised cold email sequences, follow-up cadences, and B2B outreach — exact match for the 522-prospect activation task
- `sales-automator` (source: library) — path: `companies/leads-sales/departments/sales-automator.md` — why plausible: automation of outreach sequences, multi-touch cadence design
- `communication-excellence-coach` (source: library) — path: `companies/leads-sales/departments/communication-excellence-coach.md` — why plausible: quality-checks communication for professionalism and effectiveness before send

**Plugin bundle:** n/a
**Gap:** None for sequence design. **EMAIL DELIVERABILITY GAP** — see Gaps section.

---

### 4. Lead Prospecting & Enrichment (New Prospects)
**What it does for this project:** Searches Google Maps Places API, web directories, and LinkedIn (compliant method) to discover hotels, resorts, lodges, villas, and hospitality businesses in Zanzibar and Tanzania not already in the 522-prospect list. Enriches each new prospect with contact details, property type, and estimated product fit, then appends to the Google Sheets lead tracker.
**Candidates:**
- `lead-research-assistant` (source: library) — path: `companies/leads-sales/departments/lead-research-assistant.md` — why plausible: lead discovery and enrichment, multi-source research, structured output to CRM/sheets
- `alireza-intl-expansion` (source: library) — path: `companies/leads-sales/departments/alireza-intl-expansion.md` — why plausible: specialises in international market expansion prospecting — directly relevant to Zanzibar hospitality market
- `research-analyst` (source: library) — path: `companies/research-lab/departments/research-analyst.md` — why plausible: multi-source research synthesis, can orchestrate Google Maps + web search + LinkedIn enrichment into structured lead records

**Plugin bundle:** n/a
**Gap:** None — coverage adequate across these three.

---

### 5. AI Sales Conversation Handler (Inbound Email + Future WABA/Chat)
**What it does for this project:** Handles all inbound inquiries from prospects — answering product questions, matching property type to the right Dozen catalog line, presenting indicative pricing (excl. VAT), and escalating to the owner + sales manager via WhatsApp when a formal quote is requested. Must maintain conversation state across sessions. Phase 2 extends this to WABA and web chat.
**Candidates:**
- `sales-engineer` (source: library) — path: `companies/leads-sales/departments/sales-engineer.md` — why plausible: technical sales handling, product-to-client matching, quote facilitation
- `alireza-cold-email` (source: library) — path: `companies/leads-sales/departments/alireza-cold-email.md` — why plausible: also handles response management and conversation continuation
- `wshobson-customer-sales` (source: library) — path: `companies/leads-sales/wshobson-customer-sales.md` — why plausible: customer-facing sales conversations, consultative approach
- `alireza-rag-architect` (source: library) — path: `companies/ai-agentic-lab/departments/ai-engineering/alireza-rag-architect.md` — why plausible: product catalog RAG is the knowledge base the sales agent queries to answer product questions accurately

**Plugin bundle:** n/a
**Gap:** None

---

### 6. Python Tools Development (WAT Tools Layer)
**What it does for this project:** Builds all Python scripts that form the Tools layer — Google Maps API prospecting script, email sending via SMTP/SendGrid, Google Sheets read/write for lead tracker, lead deduplication, conversation state persistence, and quote approval ping (WhatsApp API call). All tools are deterministic executors; agents call them, never execute directly.
**Candidates:**
- `python-pro` (source: library) — path: `companies/software-house/departments/language-specialists/python-pro.md` — why plausible: production-grade Python, async patterns, proper package structure, exactly the stack mandated (venv, requirements.txt, .env)
- `python-expert-llmapps` (source: library) — path: `companies/software-house/departments/core-development/python-expert-llmapps.md` — why plausible: Python specifically for LLM application tooling — directly relevant to WAT tools layer
- `/senior-backend` (source: skills) — path: `~/.claude/skills/senior-backend/SKILL.md` — why plausible: API design patterns, database optimization, security practices for backend tools

**Plugin bundle:** n/a
**Gap:** None

---

### 7. Website Development — Dozen.com (Next.js)
**What it does for this project:** Builds the brand-new dozensupplies.com website: company story, 30+ client logo wall, full interactive product catalog (all 7 product lines with sizes/colors/weights/photos), "Trusted by Elites" showcase, and request-a-quote flow that routes to the AI agent. Mobile-first, B2B hospitality aesthetic.
**Candidates:**
- `nextjs-developer` (source: library) — path: `companies/software-house/departments/language-specialists/nextjs-developer.md` — why plausible: Next.js 14+ App Router, server components, SSR — right stack for a B2B catalog site
- `frontend-developer` (source: library) — path: `companies/software-house/departments/core-development/frontend-developer.md` — why plausible: full frontend implementation capability
- `alireza-senior-frontend` (source: library) — path: `companies/software-house/departments/engineering/alireza-senior-frontend.md` — why plausible: senior-level frontend with architecture decisions, performance optimisation
- `/senior-frontend` (source: skills) — path: `~/.claude/skills/senior-frontend/SKILL.md` — why plausible: Next.js optimisation guide, React patterns, frontend best practices
- `/react-best-practices` (source: skills) — path: `~/.claude/skills/react-best-practices/SKILL.md` — why plausible: enforces React/Next.js patterns throughout the build

**Plugin bundle:** n/a
**Gap:** None

---

### 8. UI/UX Design — Website & Dashboard
**What it does for this project:** Designs the visual identity and component system for the Dozen website (hospitality-grade premium B2B aesthetic, mobile-first) and the internal lead tracker dashboard. Ensures the product catalog renders beautifully on mobile, the logo wall reads as trust-building, and the request-a-quote flow converts.
**Candidates:**
- `ui-designer` (source: library) — path: `companies/software-house/departments/core-development/ui-designer.md` — why plausible: UI component design, design systems
- `ui-designer` (source: library, engineering dept) — path: `companies/software-house/departments/engineering/ui-designer.md` — why plausible: alternative with engineering-side integration focus
- `/frontend-design` (source: skills) — path: `~/.claude/skills/frontend-design/SKILL.md` — why plausible: frontend design system skill
- `/ui-ux-pro-max` (source: skills) — path: `~/.claude/skills/ui-ux-pro-max/SKILL.md` — why plausible: full UI/UX design capability including mobile-first patterns
- `/ui-design-system` (source: skills) — path: `~/.claude/skills/ui-design-system/SKILL.md` — why plausible: component library and design token system for consistent Dozen brand

**Plugin bundle:** n/a
**Gap:** None

---

## Supportive Functions

### 9. Conversation State Management & Lead Tracker (Google Sheets)
**What it does for this project:** Designs and implements the lead state database — migrating the 522-prospect xlsx to Google Sheets, defining the schema (contact_status, last_channel, last_contacted, conversation_id, response_flag, assigned_quote), and building the Python sync tools that keep it live as the AI agent contacts prospects and receives replies. This is the first-class architectural component required by sparring condition B2.
**Candidates:**
- `data-engineer` (source: library) — path: `companies/ai-agentic-lab/departments/ai-engineering/data-engineer.md` — why plausible: data pipeline design, schema definition, Google Sheets API integration
- `alireza-senior-data-engineer` (source: library) — path: `companies/ai-agentic-lab/departments/data-science/alireza-senior-data-engineer.md` — why plausible: senior-level data engineering, state management design
- `/senior-data-engineer` (source: skills) — path: `~/.claude/skills/senior-data-engineer/SKILL.md` — why plausible: data pipeline architecture, data modeling patterns, dataops best practices
- `/xlsx` (source: skills) — path: `~/.claude/skills/xlsx/SKILL.md` — why plausible: specifically handles xlsx ingestion and migration — directly needed for the 522-prospect file

**Plugin bundle:** n/a
**Gap:** None

---

### 10. Email Deliverability Setup
**What it does for this project:** Configures SPF, DKIM, and DMARC records for the sending domain, provisions a dedicated outreach subdomain (e.g. outreach@mail.dozensupplies.com), sets up inbox warming, and monitors deliverability metrics. Without this, cold email to 522 prospects will land in spam, killing the entire Phase 1 outreach strategy. Flagged as a Major Concern (M2) in sparring.
**Candidates:**
- `alireza-cold-email` (source: library) — path: `companies/leads-sales/departments/alireza-cold-email.md` — why plausible: deliverability guide exists in its skill tree; covers the setup as part of cold outreach infrastructure

**Plugin bundle:** n/a
**Gap:** PARTIAL — no dedicated email deliverability infrastructure agent in the library. `alireza-cold-email` covers the strategy but may not go deep enough on DNS record configuration and SMTP relay setup. → Flag for `/agent-builder` if interview confirms the gap.

---

### 11. Creative Direction & AI Persona Definition
**What it does for this project:** Defines Dozen's AI brand voice — warm, consultative, B2B hospitality expert with Egyptian-origin craftsmanship pride and Zanzibar market knowledge. Writes the AI persona brief used by the prompt engineer. Also directs the website copy tone and email outreach voice. Addresses sparring concern M5 (no AI persona defined).
**Candidates:**
- `creative-director` (source: library) — path: `companies/content-creative-agency/departments/creative-director.md` — why plausible: brand voice definition, storytelling frameworks, insight mining methodology — translates directly to AI persona and outreach copy direction
- `/copy` (source: skills) — path: `~/.claude/skills/copy/SKILL.md` — why plausible: copywriting for email sequences and website copy
- `/viral` (source: skills) — path: `~/.claude/skills/viral/SKILL.md` — why plausible: hook/angle generation for subject lines and opening lines in cold outreach

**Plugin bundle:** n/a
**Gap:** None

---

### 12. Project Management & Sprint Coordination
**What it does for this project:** Coordinates the parallel build workstreams (website sprint, email outreach system, lead tracker, Python tools), tracks dependencies (WABA provisioning is a 6-week hard dependency — must be monitored), manages the approval gates, and keeps Abbie informed on progress without requiring micro-management. Addresses the 6-system phasing risk from sparring.
**Candidates:**
- `project-manager` (source: library) — path: `companies/business-consultancy/departments/product/project-manager.md` — why plausible: sprint coordination, dependency tracking, stakeholder reporting
- `/product-manager-toolkit` (source: skills) — path: `~/.claude/skills/product-manager-toolkit/SKILL.md` — why plausible: PRD templates, sprint planning frameworks
- `/product-strategist` (source: skills) — path: `~/.claude/skills/product-strategist/SKILL.md` — why plausible: strategic prioritisation, phasing decisions

**Plugin bundle:** n/a
**Gap:** None

---

### 13. Technical Documentation & SOPs
**What it does for this project:** Writes the Workflow markdown SOPs (the W layer of WAT) — the step-by-step instructions each agent follows, the tool invocation sequences, error handling procedures, and the ops manual for Dozen's team (how to use the lead dashboard, how to approve quotes, how to read AI conversation logs).
**Candidates:**
- `technical-writer` (source: library) — path: `companies/customer-success/departments/technical-writer.md` — why plausible: SOP writing, user-facing documentation, API reference docs

**Plugin bundle:** n/a
**Gap:** None — one strong match sufficient.

---

## Review / Audit Functions

### 14. Code Review — Python Tools & Next.js Website
**What it does for this project:** Reviews every Python tool and Next.js component before it ships — checks for security vulnerabilities (credential exposure, injection risks), code quality, test coverage, and compliance with the WAT invariant (tools must be deterministic, agents must not execute directly).
**Candidates:**
- `code-reviewer` (source: library) — path: `companies/software-house/departments/qa-security/code-reviewer.md` — why plausible: production code review, security awareness, architecture compliance checks
- `alireza-code-reviewer` (source: library) — path: `companies/software-house/departments/engineering/alireza-code-reviewer.md` — why plausible: senior engineering perspective with deeper architecture review capability
- `/code-review-excellence` (source: skills) — path: `~/.claude/skills/code-review-excellence/SKILL.md` — why plausible: structured code review methodology

**Plugin bundle:** `plugin-pr-review-toolkit` — path: `shared-services/system-operations/plugin-pr-review-toolkit-code-reviewer.md` — bundles code-reviewer with additional review agents; use if PR review volume justifies it.
**Gap:** None

---

### 15. QA & Testing
**What it does for this project:** Tests all system components — email sending tools (are emails actually delivered? do follow-ups fire correctly?), Google Sheets sync (does state update correctly on reply?), website quote flow (does it route to the AI agent?), and the AI conversation handler (does pricing escalation trigger correctly?).
**Candidates:**
- `qa-expert` (source: library) — path: `companies/software-house/departments/qa-security/qa-expert.md` — why plausible: end-to-end testing strategy, integration testing, system-level QA
- `/senior-qa` (source: skills) — path: `~/.claude/skills/senior-qa/SKILL.md` — why plausible: QA best practices, testing strategies, test automation patterns
- `/webapp-testing` (source: skills) — path: `~/.claude/skills/webapp-testing/SKILL.md` — why plausible: specifically for web application testing including the Dozen website

**Plugin bundle:** n/a
**Gap:** None

---

### 16. Security Audit
**What it does for this project:** Audits the system for credential exposure (`.env` file handling, API keys for Google Maps/OpenAI/email), data handling (522 prospect emails are personal data under Tanzania PDPA), secure communication (email sending, WhatsApp API), and OWASP risks in the Next.js website.
**Candidates:**
- `security-auditor` (source: library) — path: `companies/software-house/departments/qa-security/security-auditor.md` — why plausible: security vulnerability assessment, API key hygiene, data exposure risks

**Plugin bundle:** n/a
**Gap:** None

---

### 17. Legal & Compliance Review
**What it does for this project:** Reviews the outreach strategy against Tanzania PDPA 2022 (legal basis for emailing 522 prospects), Meta WABA policy compliance (template approval, 24-hour window, no cold outreach), and LinkedIn enrichment legality. Produces a compliance brief Abbie can refer to when Dozen is challenged. Addresses sparring concern M6.
**Candidates:**
- `legal-advisor` (source: library) — path: `shared-services/legal/legal-advisor.md` — why plausible: legal compliance review, data protection, policy alignment
- `compliance-auditor` (source: library) — path: `shared-services/legal/compliance-auditor.md` — why plausible: formal compliance audit against regulatory frameworks (PDPA, Meta policy)
- `legal-advisor` (source: library, alt) — path: `companies/business-consultancy/departments/product/legal-advisor.md` — why plausible: business-context legal advice with product focus

**Plugin bundle:** n/a
**Gap:** None

---

## Reporting / Comms Functions

### 18. Lead Pipeline Analytics & Reporting
**What it does for this project:** Tracks campaign performance from the Google Sheets lead tracker — response rates, open rates, conversation conversion, quote requests generated, and funnel progression across the 522 prospects. Produces weekly summaries for Abbie showing which prospect segments are responding and what outreach adjustments are needed.
**Candidates:**
- `data-analyst` (source: library) — path: `companies/ai-agentic-lab/departments/data-analyst.md` — why plausible: pipeline analytics, funnel metrics, campaign performance reporting
- `data-analyst-llmapps` (source: library) — path: `companies/research-lab/departments/data-analyst-llmapps.md` — why plausible: analytics specifically for LLM-powered systems — directly relevant
- `research-analyst` (source: library) — path: `companies/research-lab/departments/research-analyst.md` — why plausible: multi-source research synthesis into structured reports — useful for prospecting discovery reports

**Plugin bundle:** n/a
**Gap:** None

---

### 19. Prospect Discovery Research Reports
**What it does for this project:** Synthesises findings from Google Maps prospecting runs and web searches into structured prospect reports — new hotels found, categorised by type, location, estimated size, and product fit. Delivered to Dozen's team as additions to the live lead tracker.
**Candidates:**
- `research-analyst` (source: library) — path: `companies/research-lab/departments/research-analyst.md` — why plausible: multi-source research, structured output, trend identification
- `lead-research-assistant` (source: library) — path: `companies/leads-sales/departments/lead-research-assistant.md` — why plausible: specifically for lead discovery and enrichment reports

**Plugin bundle:** n/a
**Gap:** None — overlap between functions 4 and 19 is intentional; same agents can cover both prospecting execution and reporting.

---

## Library Gaps — Build Queue

| Function | Gap type | Proposed name | Recommended builder |
|----------|----------|---------------|---------------------|
| Email deliverability infrastructure (SPF/DKIM/DMARC, subdomain setup, inbox warming, deliverability monitoring) | Agent gap — partial coverage only from `alireza-cold-email` | `email-deliverability-engineer` | `/agent-builder` |
| WhatsApp Business API integration (Meta BSP provisioning, template message design, opt-in flow, 24h window management) | Agent gap — no WABA-specific agent in library; ai-engineer covers generically | `waba-integration-specialist` | `/agent-builder` — defer to Phase 2 |

---

## Scouting Scope Confirmation

- Sources scanned: bench ✅ (empty) | library ✅ | skills ✅ | plugins ✅ | internal agents ✅ (empty) | internal skills ✅ (empty)
- Candidates identified: 34 across all 4 categories (some agents appear in multiple functions)
- Gaps flagged: 2 (email deliverability agent — partial; WABA specialist — Phase 2 defer)
- Ready for /interview: **yes**

---

## Self-Assessment Gate

| Question | Answer |
|----------|--------|
| Q1 — Four-category completeness | Core (8 functions) ✅ Supportive (5 functions) ✅ Review/Audit (4 functions) ✅ Reporting/Comms (2 functions) ✅ — all four evaluated |
| Q2 — Bench checked first | Bench empty. For every function, fell through to library. No bench matches available yet. |
| Q3 — Supportive function rigor | Added because of "close the loop" question: email deliverability (M2 from sparring), creative direction / AI persona (M5 from sparring), project management (6-system phasing risk), technical documentation (WAT SOPs layer), compliance review (M6 from sparring), conversation state management (B2 from sparring). All 6 added specifically because of sparring conditions — none were obvious. |
| Q4 — Review coverage | Python tools → code-reviewer + qa-expert + security-auditor ✅. Next.js website → code-reviewer + qa-expert ✅. AI system → security-auditor + compliance-auditor ✅. Email outreach → compliance-auditor + legal-advisor ✅. No unreviewed artifact-producing function. |
| Q5 — Library gaps honest | Email deliverability: genuine gap — no dedicated DNS/SMTP infrastructure agent in library. WABA: genuine Phase 2 gap — ai-engineer covers integration generically but no specialist exists. Both are real gaps, not missed searches. |
| Q6 — No premature filtering | No candidates excluded. Multiple agents listed per function even where one is clearly strongest. Filtering is /interview's job. |

**Overall: READY FOR /interview**
