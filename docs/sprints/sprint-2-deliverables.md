# Sprint 2 Deliverables — Dozen Hotel Supplies AI System

**Status:** APPROVED
**Sprint:** 2
**Prepared:** 2026-05-08
**Approved:** 2026-05-08 — website-only scope confirmed by Abbie

---

## What Will Be Completed This Sprint

### dozensupplies.com Website — Phase 1
- [ ] Next.js 14 App Router project scaffolded in `website/` directory with Tailwind CSS, Framer Motion, design system tokens from `docs/design/design-system.md`
- [ ] Homepage — hero section, value proposition, existing client logo wall (30+ including TUI Blue, LUX*, Baraza, Fundu Lagoon), services overview
- [ ] Products page — 7 product category cards linking to category detail pages
- [ ] 7 product category detail pages — Bath Towels, Bed Linen, Bedding, F&B Linen, Bathrobes, Slippers, Kitchen & Sanitation (content from catalog markdown files; all prices indicative)
- [ ] Request-a-Quote page — form (name, property, category, quantity, message); submits to `privacy@dozensupplies.com`; no automated pricing returned
- [ ] About page — Dozen story, Zanzibar presence, team
- [ ] Privacy Policy page — required before first outreach send (PDPA condition 7)
- [ ] One-click unsubscribe page — required before first outreach send (PDPA condition 6); connects to `unsubscribe_handler.py`
- [ ] Mobile-first responsive design; Lighthouse score ≥ 90 on all pages

---

## Deferred to Later Sprints

- Email pipeline tools (`send_email.py`, `inbound_handler.py`, `bounce_handler.py`, `unsubscribe_handler.py`) — Sprint 3 (after SendGrid + DNS setup is complete)
- Production Claude prompts — Sprint 3 (alireza-senior-prompt-engineer)
- RAG vector store setup (ChromaDB — decision confirmed 2026-05-08) and `ingest_catalog.py` — Sprint 3
- WhatsApp Business API integration — Phase 2 (pending Meta WABA provisioning, 2–6 weeks)
- AI web chat widget — Phase 2
- Prospect discovery tool (`discover_prospects.py`) — Phase 2
- End-to-end integration testing with live credentials — Sprint 4
