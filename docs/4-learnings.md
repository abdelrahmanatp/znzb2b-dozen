# Learnings — Dozen Hotel Supplies AI System

**Format:** Append-only. Each entry = date + sprint/phase + learning.

---

## 2026-05-07 — /hire (Phase B: Resource)

**What was completed:**
- Full /hire execution: 18 agents cloned to `.claude/.agents/`, 7 merge deltas applied inline
- 18 per-agent contracts written to `.claude/.agents/contracts/`
- `_team.md` fast-scan summary written
- `TEAM.md` full schema written (7 sections)
- `.claude/CLAUDE.md` written (locked block verbatim from template-version 2026-04-24e + filled project context)
- `.claude/settings.json` scaffolded (PostToolUse hooks + allow/deny lists)
- `.claude/.mcp-setup/README.md` written (all env vars documented, status flags, email domain setup guide)

**Key decisions made:**
- Model routing finalized: Opus → code-reviewer, security-auditor, compliance-auditor. Sonnet → all implementation agents. Haiku → technical-writer, project-manager, data-analyst
- plugin-pr-review-toolkit activated for all pre-merge code submissions
- compliance-auditor runs AFTER legal-advisor (sequential exception to § 5 parallel rule — operationalization depends on legal opinion)
- WABA application flagged as HIGH risk / immediate action: must submit Meta application for +255 772 502 076 at project launch, before any Phase 2 planning begins
- Email warmup: 20/day Day 1, ramp over 6 weeks — cannot be deferred
- PDPA + CAN-SPAM gate: zero outreach until legal-advisor + compliance-auditor sign off (mandatory, enforced by project-manager)

**Key constraints locked in:**
- Tanzania PDPA 2022: lawful basis required before any outreach
- WAT invariant: all IO through deterministic Python tools, no agent executes directly
- Quote gate: all pricing indicative; owner + sales manager approve via WhatsApp before formal quote
- Bounce rate threshold: >5% = immediate pause + Abbie escalation
- Reply rate threshold: <2% for 2 consecutive weeks = strategy review

**Env var status at /hire completion:**
- ANTHROPIC_API_KEY: ⚠️ assumed present — verify
- GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON: ❌
- GOOGLE_MAPS_API_KEY: ❌
- SENDGRID_API_KEY: ❌
- WABA credentials: ❌ (2-6 week Meta approval)

**What's next:**
- `/workflow` — writes 10 per-task-type SOPs + `workflows/_master.md`
- Start Meta WABA application immediately (do not wait for /workflow)
- Provision Google Sheets service account
- `/preflight` — readiness audit before Sprint 1

---

## 2026-05-08 — Sprint 1 Execution (Phase 1 complete — legal/compliance/design/catalog)

**What was completed:**
- `/preflight` ran fully — 6 checks + self-assessment gate → GO WITH CONDITIONS (sprint deliverables gate resolved by creating docs/sprints/sprint-1-deliverables.md, approved by Abbie)
- Supporting files created: `.gitignore`, `.env.example`, `docs/sprints/sprint-1-deliverables.md` (APPROVED)
- `docs/2-context.md` status: VALIDATED → FINALIZED
- `brief.md` (project root) + `WAT CLAUDE.md` (project root) superseded headers added
- PostToolUse hook fixed from Unix date syntax to Windows PowerShell
- `docs/legal/pdpa-opinion.md` — legal-advisor: GO WITH CONDITIONS, 8 blocking conditions, legitimate-interests basis confirmed
- `docs/architecture/lead-state-schema.md` — data-engineer: full 21-column schema, 4 tabs, sync rules; key finding: 521 data rows (not 522)
- `docs/architecture/migrate-xlsx-spec.md` — data-engineer: migrate_xlsx.py spec; 13 rows with no email; dry-run mode; idempotent
- `docs/catalog/towels.md`, `bed-linen.md`, `bedding.md`, `fb-linen.md`, `bathrobes.md`, `slippers.md`, `kitchen-sanitation.md` — technical-writer: 7 RAG-optimized catalog files
- `docs/design/design-system.md` — ui-designer: full design system (warm neutrals, Cormorant Garamond + Inter, Framer Motion rules, Tailwind config)
- `docs/email/warmup-schedule.md` + `infrastructure-checklist.md` — alireza-cold-email: 6-week warmup ramp + DNS/SendGrid setup steps
- `docs/compliance/can-spam-checklist.md` — compliance-auditor: 4 COMPLIANT, 2 NEEDS ACTION (CAN-SPAM); 5 blocking actions before first send
- `docs/compliance/pdpa-data-inventory.md` — compliance-auditor: 32 data elements, cross-border transfer summary; verdict: CLEARED WITH CONDITIONS, 11 blocking conditions
- `docs/compliance/processor-assessment.md` — compliance-auditor: 4 processors assessed; NEW FINDING: Anthropic is 4th processor requiring DTA (condition C-3.5)
- /website-builder-setup run: UI/UX Pro Max (uipro-cli) installed globally; Framer Motion installed at project root (must re-run inside website/ dir when creating Next.js project); 21st.dev Magic already active via MCP

**Key findings this session:**
- Tanzania PDPA has no B2B carve-out — professional emails are personal data; legitimate interests is the only viable basis
- Anthropic (Claude API) is a data processor requiring a DTA under PDPA §32 — blind spot in original legal opinion; now blocking condition C-3.5
- 521 data rows in xlsx (not 522 — brief counted header row)
- 13 prospect rows have no email address — migration spec handles this gracefully (skip + warn)
- PDPC registration deadline was April 30, 2025 — may have already passed; Abbie must verify immediately (CRITICAL)

**Abbie actions required (not delegatable):**
- CRITICAL: Verify Dozen PDPC registration status (deadline was April 30, 2025)
- HIGH: Submit Meta WABA application for +255 772 502 076 — every day of delay pushes Phase 2
- Provision Google Sheets service account + create .env from .env.example
- Set up SendGrid + dedicated outreach subdomain (outreach.dozensupplies.com)
- Execute 4 DPAs: Google Workspace (Admin Console), Twilio (SendGrid console), Anthropic (account console), Google Cloud (Maps API account)
- Provision privacy@dozensupplies.com alias → monitored inbox

**Pending decisions (Abbie):**
- Sprint cadence: 1-week vs 2-week?
- Vector store: ChromaDB (local, free) vs Pinecone (cloud, managed)?
- Campaign reporting format: markdown files vs live Sheets tab?

## WIP [master] [2026-05-08] / Task: Sprint 1 Python tools implementation / Progress: All Sprint 1 documentation complete (legal, compliance, design, catalog, architecture specs) / Next: Delegate to python-pro to implement 6 Python tools from data-engineer specs / Blockers: Google Sheets service account + SendGrid API key needed for execution (not for code writing)

---

## 2026-05-07 — /workflow (Phase C: Organize)

**What was completed:**
- 10 per-task-type SOPs written to `workflows/`: cold-email-outreach, prospect-discovery, lead-triage, inbound-email-response, quote-approval-routing, lead-state-sync, website-sprint, catalog-knowledge-base, campaign-performance-report, code-review-cycle
- `workflows/_master.md` written: project-level Mermaid chart, SOPs index, agent load table (18 agents, zero orphans), tools load table
- 4 contract placeholder backfills: code-reviewer (review trigger), qa-expert (CI/CD integration), data-engineer (audit log format), project-manager (daily blocker report format)

**Key SOP decisions:**
- cold-email-outreach Phase 1 is sequential (legal-advisor → compliance-auditor) per § 5 directive override
- quote-approval-routing: WABA Phase 2 fallback defined — email fallback via send_email.py until WABA provisioned
- catalog-knowledge-base: BLOCKED gate if catalog PDFs from Dozen not provided
- code-review-cycle: plugin-pr-review-toolkit fires both code-reviewer + security-auditor in parallel, never one without the other
- lead-state-sync split: Sub-path A (one-time xlsx migration) + Sub-path B (ongoing per-event sync)

**WIP checkpoint — /preflight NOT YET STARTED:**
- /preflight invoked but context compacted before any checks ran
- Zero of 6 checks complete; zero of 8 self-assessment gate questions answered

**What's next:**
- `/preflight` — 6 checks + self-assessment gate → GO/NO-GO verdict
- Create `docs/status/` directory (project-manager daily blocker reports)
- Create `docs/sprints/` directory + `sprint-1-deliverables.md`
- Surface open Abbie decisions post-preflight: sprint cadence, vector store (ChromaDB vs Pinecone), reporting dashboard format, Ops Manual format

---
