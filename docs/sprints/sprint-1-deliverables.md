# Sprint 1 Deliverables — Dozen Hotel Supplies AI System

**Status:** APPROVED
**Sprint:** 1
**Dates:** TBD → TBD (sprint cadence to be confirmed: 1-week or 2-week)

## What Will Be Completed This Sprint

### Infrastructure Setup (must happen before anything else can run)
- [ ] Google Sheets workspace created with correct access and service account credentials provisioned
- [ ] 522 prospects migrated from the xlsx file into the Google Sheets lead database (all 14 original columns intact, zero data loss)
- [ ] Email sending infrastructure configured: dedicated subdomain for outreach, SPF/DKIM/DMARC DNS records set, SendGrid (or SMTP) account active
- [ ] Email inbox warming started at 20 emails/day (this must run for 4–6 weeks before full campaign — starting now is the constraint, not finishing)
- [ ] Meta WABA application submitted for +255 772 502 076 (the 2–6 week approval clock starts the moment the application is submitted — delay here directly delays Phase 2)

### Legal & Compliance Gate (required before any outreach email is sent)
- [ ] Tanzania PDPA 2022 lawful basis opinion delivered by legal advisor: confirmed go/no-go for cold email outreach to the 522 prospects
- [ ] CAN-SPAM compliance checklist completed by compliance auditor: all 6 mandatory requirements satisfied for every outreach email
- [ ] Third-party processor assessment completed (Google Sheets, SendGrid, Claude API) — what data they handle and whether data processing agreements are needed

### Website — Design Phase Only
- [ ] Visual design system defined: color palette, typography, spacing scale, and key component styles (buttons, cards, navigation) — hospitality-premium aesthetic appropriate for Dozen's client base
- [ ] Design tokens documented and ready for the developer to implement in Sprint 2

### Product Catalog — Structured Markdown
- [ ] Structured markdown files written for all 7 product categories: Bath Towels, Bed Linen, Bedding, F&B Linen, Bathrobes, Slippers, Kitchen & Sanitation
- [ ] Each file includes product variants, sizes, materials, GSM/thread counts, and indicative pricing (as provided in the Dozen PDFs)
- [ ] Files are formatted for RAG ingestion — ready to be loaded into the AI assistant's product knowledge base

---

## Deferred to Later Sprints

- Cold email sequences and outreach launch (Sprint 2 — requires legal gate ✅ + warmup in progress)
- Website build (Sprint 2 — requires design system from Sprint 1)
- AI inbound conversation handler (Sprint 3 — requires catalog RAG to be built first)
- Quote approval routing via WhatsApp (Phase 2 — requires WABA provisioning which takes 2–6 weeks from application submission)
- New prospect discovery via Google Maps (Sprint 2 — requires Google Maps API key)

---

*To approve: reply "approved" or change Status to APPROVED. Sprint 1 cannot begin until approved.*
