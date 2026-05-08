# Decision Log

## Sparring Gap Log — 2026-05-07

### Blockers Raised

| # | Concern | Status |
|---|---------|--------|
| B1 | WABA cold outreach violates Meta policy — account suspension risk | **Open — requires redesign** |
| B2 | No conversation state management defined | **Open — requires architectural decision** |
| B3 | WABA provisioning takes 2–6 weeks — unstarted hard dependency | **Open — must initiate immediately** |

### Major Concerns Raised

| # | Concern | Status |
|---|---------|--------|
| M1 | LinkedIn likely wrong channel for Zanzibar hotel market | Open — validate before building |
| M2 | Email deliverability needs SPF/DKIM/DMARC + sending domain + warming | Open |
| M3 | Quote approval has no SLA or fallback — conversion killer | Open |
| M4 | "Interactive catalog" underspecified | Open |
| M5 | No AI persona/brand voice defined | Open |
| M6 | Tanzania PDPA compliance not addressed | Open |
| M7 | Scope is 6+ systems treated as 1 — needs phasing | Open |

### Minor Notes

| # | Concern | Status |
|---|---------|--------|
| N1 | Google Maps API costs at prospecting scale | Open — monitor |
| N2 | Arabic/Swahili language support undefined | Open |
| N3 | Dozen team ops interface (approval queue, lead dashboard) not planned | Open |

### Conditions for GO (required before /scout proceeds)

1. Redesign WhatsApp outreach strategy: cold outreach via email; WABA for warm/inbound only → **ACCEPTED 2026-05-07**
2. Define conversation state management as a first-class architectural component → **ACCEPTED 2026-05-07**
3. Phase the build: Phase 1 = website + email; Phase 2 = WABA + web chat → **ACCEPTED 2026-05-07**

**Brief promoted to FINALIZED — 2026-05-07**

---

## Sprint 1 Approval — 2026-05-08

**Decision:** Sprint 1 deliverables approved by Abbie.
**File:** `docs/sprints/sprint-1-deliverables.md` → status changed to APPROVED.

**Sprint 1 scope (approved):**
- Infrastructure: Google Sheets provisioned, 522 prospects migrated
- Legal gate: PDPA opinion (legal-advisor) + CAN-SPAM checklist (compliance-auditor)
- Email infra: dedicated subdomain, SPF/DKIM/DMARC, SendGrid, warmup at 20/day
- Meta WABA application submitted for +255 772 502 076
- Website design system (Sprint 1 = design tokens only; build in Sprint 2)
- Catalog markdown: 7 product category files for RAG

**Instruction logged:** Use `/website-builder-setup` (global command) before all website subtasks — installs UI/UX Pro Max + Framer Motion + 21st.dev Magic.

### Alternatives Logged

| Alternative | Key Reason to Evaluate |
|-------------|------------------------|
| Email-first validation | Produce results in weeks; de-risk before 3-channel build |
| Sales automation platform (Apollo/Lemlist) as outreach layer | Handles deliverability, CRM, compliance out of the box |
| Inbound-first (website → AI agent) | No WABA cold-outreach compliance risk; leads are pre-qualified |

---

## Sprint 2 Planning Decisions — 2026-05-08

**Sprint cadence:** 1-week sprints. Confirmed by Abbie.

**Sprint 2 scope:** Website-only. Email pipeline tools and Claude prompts deferred to Sprint 3. Rationale: SendGrid + DNS setup not yet complete (Abbie action pending); website build is independent and can begin immediately.

**Vector store:** ChromaDB (local, embedded). Confirmed 2026-05-08.
- Rationale: runs alongside Python tools on the same server, zero cost, zero external dependency, no signup required. Sufficient for 7 catalog files. Pinecone evaluated and rejected as overkill for current scale and an unnecessary external SaaS dependency.
- Implementation: Sprint 3. `ingest_catalog.py` will load the 7 `docs/catalog/*.md` files into ChromaDB. RAG queries go through a shared `rag_query.py` tool that all Claude-calling tools import.

**Sprint 2 file:** `docs/sprints/sprint-2-deliverables.md` → status APPROVED 2026-05-08.

---

## Sprint 3 Scope Addition — Interactive Quote System — 2026-05-08

### Sparring Gap Log

**Blockers raised and resolved:**

| # | Concern | Resolution |
|---|---------|------------|
| B1 | No customer confirmation at Sprint 3 launch (email stubbed) | **Resolved** — Session UUID in URL replaces email dependency. UUID generated on first builder visit, embedded in URL (`/quote/builder?s=uuid`), auto-saved to Sheets. Customer retrieves by returning to URL. Email confirmation wired in Sprint 4 when SendGrid is ready. |
| B2 | Token retrieval via Google Sheets full-scan degrades at scale | **Resolved** — UUID stored in column A of "Quote Submissions" sheet. API reads column A range, finds row index, reads that row. Hard cap at 5,000 rows before archiving. Lookup ~200-300ms at scale — accepted for MVP. |

**Major concerns and resolutions:**

| # | Concern | Resolution |
|---|---------|------------|
| M1 | localStorage fragility on managed corporate devices | Server-side auto-save on every meaningful action (item add/remove, room count change). localStorage used only as fast local cache, not primary persistence. |
| M2 | Twilio WABA dependency with no fallback | Email-only fallback to second team address defined. WhatsApp alert failure does not block submission processing or team notification. |
| M3 | Custom size request field undefined | Freeform text input that appears inline when customer clicks "Request custom size" on an item. Captured as a string field in Sheets alongside item line. |
| M4 | No rate limiting on submission API | Simple in-memory token bucket rate limiter on all submission routes. Idempotency key on POST prevents duplicate submissions. |
| M5 | No amendment flow | "Edit and resubmit" on view page reloads quote into builder with new UUID. Original submission preserved as audit trail. |
| M6 | Combined paths payload complexity | One merged Sheets row per submission. Catalog item columns + room config columns both present; empty where not used. Sprint 5 AI parser reads whichever are populated. |
| M7 | WhatsApp message content unspecified | Template required as a defined artifact before API route is built. |

**Architectural decisions made:**

1. **Session UUID in URL** — primary persistence mechanism. No user accounts. No email required at Sprint 3 launch.
2. **Google Sheets MVP** — no new database. "Quote Drafts" tab for in-progress, "Quote Submissions" tab for submitted. Schema designed for AI consumption from day one.
3. **Twilio for WhatsApp** — user confirmed credentials available. SMS fallback considered but not needed; email fallback sufficient.
4. **Combined paths = one merged payload** — not two linked submissions. Simpler schema, simpler AI parsing in Sprint 5.
5. **Both paths in Sprint 3** — Add-to-Quote + Room Configurator both ship. Session UUID persistence removes the email blocker that would have justified deferring Room Configurator.

**Sprint renumbering:**
- Sprint 3 (was email pipeline) → renamed Sprint 4
- Sprint 3 is now Interactive Quote System
- Sprint 4: email pipeline, cold outreach, Claude prompts, ChromaDB RAG
- Sprint 5: AI inbound sales rep (handles quote submissions + email replies)

**Sprint 3 file:** `docs/sprints/sprint-3-deliverables.md` → status PENDING APPROVAL.
