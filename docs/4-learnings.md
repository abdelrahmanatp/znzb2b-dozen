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

## 2026-05-08 — Sprint 2 Website Build

**What was completed:**
- Full dozensupplies.com website built in `website/` (Next.js 14 App Router, Tailwind CSS, Framer Motion)
- 17 routes: homepage, products index, 7 product category pages, /quote, /about, /privacy, /unsubscribe, /api/unsubscribe (dynamic), /_not-found
- 7 components: Nav, Footer, HeroSection, SectionReveal, ProductCard, ClientLogo, QuoteForm
- `npm run build` passes with zero errors — all non-API routes statically prerendered
- useReducedMotion correctly implemented in HeroSection (makeVariants factory) and SectionReveal (whileInView scroll reveal)
- Privacy page: full Tanzania PDPA 2022 compliance — legitimate interests lawful basis, 10 sections, data processors table, all 6 data subject rights
- Unsubscribe page: Suspense boundary around useSearchParams, POST to /api/unsubscribe, success/error states, email+token URL params
- All 7 product category pages: full catalog content loaded — specs, GSM, sizes, colors, customization, indicative pricing, pricing disclaimer
- ChromaDB confirmed as vector store; Sprint 2 scoped website-only (email tools to Sprint 3)

**What's next:**
- Git commit Sprint 2 website
- Sprint 3: send_email.py, inbound_handler.py, bounce_handler.py, unsubscribe_handler.py + Claude prompts + ChromaDB RAG (ingest_catalog.py, rag_query.py)
- Abbie actions still blocking outreach: PDPC registration, Meta WABA, Google Sheets service account, SendGrid + subdomain, 4 DPAs

---

## 2026-05-08 — Sprint 3 Interactive Quote System (Planning complete, execution starting)

**What was completed:**
- Full pre-execution chain for Sprint 3 scope addition: /validator (4 rounds) → sprint placement decision → /sparring (GO WITH CONDITIONS) → both blockers resolved → sprint-3-deliverables.md written + approved by Abbie
- Sprint renumbering: Sprint 3 = Interactive Quote System, Sprint 4 = email pipeline / Claude prompts / ChromaDB RAG, Sprint 5 = AI inbound sales rep
- Implementation plan written at `docs/plans/2026-05-08-interactive-quote-system.md` (17 tasks)
- Sprint 3 deliverables approved: `docs/sprints/sprint-3-deliverables.md` (Status: APPROVED)
- Decisions log updated: `docs/3-decisions.md` — Sparring Gap Log appended with all 7 resolutions + 5 architectural decisions

**Key architectural decisions:**
- Session UUID in URL (`/quote/builder?s=uuid`) = primary persistence, no email required at launch
- Google Sheets MVP: "Quote Drafts" tab (auto-save) + "Quote Submissions" tab (on submit)
- Column A = UUID primary key; API reads column A range then row-by-index for O(n) lookup, capped at 5,000 rows
- Combined paths = one merged row (both catalog items + room config in same submission)
- Twilio WhatsApp for team alert; email fallback if WABA not active
- Rate limiting: in-memory token bucket 10 req/min/IP on all API routes

**What's next (execution order):**
- Task 1: npm install googleapis twilio nodemailer zod
- Tasks 2–7: lib/quote/ files (types, catalog, session, rateLimit, sheets, twilio, email)
- Task 8: QuoteContext (React Context + useReducer + auto-save)
- Tasks 9–14: UI components + pages
- Tasks 15–16: API routes
- Task 17: QA scenarios

**Blockers for full E2E testing (code can be written, credentials needed before live test):**
- GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY + GOOGLE_SHEETS_QUOTE_ID
- TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_WHATSAPP_FROM + TWILIO_WHATSAPP_TO
- SMTP_HOST/PORT/USER/PASS + TEAM_EMAIL
- Google Sheets: "Quote Drafts" and "Quote Submissions" tabs must be created manually with headers before first API call

---

## 2026-05-08 — Sprint 3 Interactive Quote System (Execution complete)

**What was completed:**
- All 20 files created/modified: 7 lib/quote/ modules, 4 API routes, 6 components, 3 pages + 3 config/doc files
- Routes delivered: /quote (3-path landing), /quote/builder, /quote/submit, /quote/view/[token] + 4 API routes
- TypeScript: 0 errors. Production build: clean. All routes compiled.
- 11 critical/high security + quality fixes applied during implementation

**Security fixes applied:**
- `sanitizeCell()` — formula injection guard for Sheets writes
- `safeParse<T>()` — resilient JSON.parse with typed fallback
- `esc()` — HTML-escape applied to all user strings in nodemailer HTML body
- `stripControl()` — removes control chars from Twilio message body
- Rate limiting added to ALL routes including GET endpoints
- XFF first-IP-only (no spoofing via X-Forwarded-For chain)
- `isValidSession` UUID v4 regex guard before any Sheets call
- Zod `.max()` caps on all string fields and arrays
- `await Promise.allSettled(notifications)` — prevents silent notification drop on serverless
- `SAVE_START / SAVE_SUCCESS / SAVE_ERROR` actions — fixed infinite autosave loop
- Removed `dynamic(() => ..., { ssr: false })` from Server Component — caused Turbopack build failure

**Known deferred issues (Sprint 4/5):**
- In-memory rate limiter not serverless-safe → replace with Upstash/Redis
- Sheets O(n) full-scan → migrate to indexed lookup at scale
- upsertDraft race condition → known Sheets-as-DB limitation
- Tab ARIA completeness (missing aria-controls, keyboard nav)
- Quote view page doesn't mark submission as 'viewed' on open
- revalidate=60 doesn't apply to direct googleapis calls (needs unstable_cache)

**Abbie actions required:**
- Create `website/.env.local` from `.env.example` with real credentials
- Create "Quote Drafts" tab (cols A-F) and "Quote Submissions" tab (cols A-M) in Google Sheet manually before first API call

**What's next:**
- Git commit Sprint 3
- Lighthouse on /quote/builder (target: A11y ≥90, BP ≥90, SEO ≥90, Perf ≥85)
- Sprint 4: Python email tools + Claude prompts + ChromaDB RAG

---

## 2026-05-08 — Sprint 4 Email Pipeline + ChromaDB RAG (Execution complete, pending commit)

**What was completed:**
- 6 Python tools written to `tools/`: `send_email.py`, `inbound_handler.py`, `bounce_handler.py`, `unsubscribe_handler.py`, `ingest_catalog.py`, `rag_query.py`
- 6 Jinja2 prompt templates written to `tools/prompts/`: `cold_email_luxury.txt`, `cold_email_boutique.txt`, `cold_email_villa.txt`, `classify_inbound.txt`, `answer_question.txt`, `quote_request_reply.txt`
- `tools/requirements.txt` updated: added openpyxl, google-auth, google-api-python-client, anthropic, chromadb, jinja2
- `docs/sprints/sprint-4-deliverables.md` (APPROVED) and `docs/plans/2026-05-08-sprint-4-email-pipeline.md` written
- 2 CRITICAL + 4 HIGH security fixes + 8 bug fixes applied across all 6 tools (parallel code-reviewer + security-auditor)

**Security fixes applied:**
- CRITICAL: Hardcoded `UNSUBSCRIBE_DEFAULT_SECRET` removed from send_email.py; now required from env (`Config._require`)
- CRITICAL: `_sanitize_header()` applied to Subject + To in send_email.py and inbound_handler.py (email header injection prevention)
- HIGH: `_wrap_untrusted()` wraps inbound email body in XML tags before Claude classify call (prompt injection defense)
- HIGH: `--confirm-reset` flag required with `--reset` in ingest_catalog.py (destructive-action guard)
- HIGH: `_write_output()` restricted to `_PROJECT_ROOT/tmp/drafts` only in inbound_handler.py (path traversal fix)
- HIGH: Guarded `response.content[0].text` across all Claude calls (AttributeError on empty content blocks)

**Bug fixes applied:**
- bounce/unsubscribe handlers: `(str(row[col]) if row[col] is not None else "").strip().lower()` — None-cell crash fix
- bounce/unsubscribe handlers: `from __future__ import annotations`, `sys.path.insert`, module-level `load_dotenv`, `list[list[Any]]` annotation
- ingest_catalog.py: heading stored without `##` markers (regex group capture); `_flush(heading: str | None)`; exception logging on collection delete
- rag_query.py: `(results.get("documents") or [[]])[0]` — guards empty Chroma response
- send_email.py: `fetch_prospects` returns `(list, int)` — `skipped_no_email` was always 0 (filter-before-count bug)
- inbound_handler.py: `query_catalog` wrapped in try/except with fallback reply; `contact_person.strip()`; `response.content` guard

**Architecture decisions:**
- ChromaDB PersistentClient (local, free) confirmed as vector store — ChromaDB ≥0.5 API used throughout
- Collection name: `dozen_catalog`; chunk ID format: `{stem}__{slug}`; chunked by H2/H3 headings
- Claude Haiku (`claude-haiku-4-5-20251001`) used for both classification (max_tokens=10) and Q&A (max_tokens=512)
- Segment routing in send_email.py: LUXURY (resort/luxury/5-star keywords) → BOUTIQUE (hotel/boutique/lodge/safari) → VILLA (default)
- SMTP: port 465 = `SMTP_SSL`, else STARTTLS; RFC 8058 `List-Unsubscribe-Post` header on all outbound

**Known deferred issues (Sprint 5):**
- Global `text-gold` contrast fix across all 13+ hero sections (Sprint 3 only fixed QuoteBuilderShell.tsx)
- migrate_xlsx.py not yet written (spec at docs/architecture/migrate-xlsx-spec.md)
- No end-to-end test with live credentials (blocked by Abbie provisioning actions below)

**Abbie actions required:**
- Provision Google Sheets service account + set `GOOGLE_SHEETS_CREDENTIALS` in `.env`
- Set `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env`
- Set `ANTHROPIC_API_KEY` in `.env`
- Set `UNSUBSCRIBE_SECRET` in `.env` (required for send_email.py — no default)
- Set SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `FROM_NAME`)
- Create `tools/tmp/drafts/` directory for inbound_handler output-file path

**What's next:**
- Git commit Sprint 4
- Smoke tests: `ingest_catalog.py --verbose`, `rag_query.py --query "..."`, `send_email.py --dry-run --limit 2`
- Sprint 5: AI inbound sales rep (prospect discovery via Google Maps API, quote_sender.py, full conversation memory)

---
