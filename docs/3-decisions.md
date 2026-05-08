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
