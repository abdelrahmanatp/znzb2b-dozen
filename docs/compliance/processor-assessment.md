# Third-Party Data Processor Assessment — Dozen Hotel Supplies AI System
**Prepared by:** compliance-auditor
**Date:** 2026-05-08
**Status:** DELIVERED
**Governing law:** Tanzania PDPA No. 11 of 2022 §32 + GN No. 449C of 2023 Reg. 20 (cross-border transfers)
**Companion documents:** `docs/legal/pdpa-opinion.md` §6, `docs/compliance/pdpa-data-inventory.md`

---

## Scope

Every third-party processor that receives personal data of the 521 Tanzanian prospects. Evaluated against PDPA §32 cross-border transfer requirements and the legal-advisor's Data Transfer Agreement condition (legal opinion §6.3).

**Data controller:** Dozen Hotel Supplies (Tanzania)
**Processors assessed:** 4
**Out of scope (Phase 2):** Meta Platforms (WhatsApp Business API) — separate assessment required at WABA activation per legal opinion §6.4

---

## Processor 1 — Google (Google Sheets / Google Workspace)

| Field | Value |
|-------|-------|
| Legal entity | Google LLC (US) |
| Service | Google Sheets — operational lead database |
| Role | Data processor (PDPA §32) |

**Personal data received:** All 21 columns of `All Prospects` and `Discovery Runs` tabs — including contact names (Medium risk), email addresses (High risk), phone numbers (Medium risk), all derivative state columns and audit-log entries. **Most concentrated PII pool in the system.**

**Cross-border transfer:** Tanzania → United States. No adequacy designation from PDPC. Requires Data Transfer Agreement (DTA) per legal opinion §6.2.

**Standard DPA:** Google Workspace Data Processing Amendment — accepted via Admin Console.
- URL: https://workspace.google.com/terms/dpa_terms.html
- Sub-processor list: https://workspace.google.com/terms/subprocessors.html

**DTA condition satisfied?** Conditionally — standard DPA covers all required clauses (purpose limitation, sub-processor controls, security, data-subject rights, 72h breach notification, deletion, audit rights). Gap: DPA is GDPR-anchored; PDPC not named. Workaround: internal Tanzania-PDPA acknowledgement memo filed by Dozen.

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Activate Google Workspace DPA via Admin Console | Abbie | NEEDS ACTION |
| 2 | Download executed DPA + sub-processor list → `docs/legal/contracts/google-dpa-2026.pdf` | Developer | NEEDS ACTION |
| 3 | Draft internal Tanzania-PDPA acknowledgement memo | compliance-auditor | NEEDS ACTION |
| 4 | Verify Workspace plan (Business Standard or higher recommended) | Abbie | NEEDS ACTION |

**Current status: NEEDS ACTION — blocks outreach launch.**

---

## Processor 2 — Twilio Inc. (SendGrid)

| Field | Value |
|-------|-------|
| Legal entity | Twilio Inc. (US) |
| Service | SendGrid email delivery + suppression management + bounce/event webhooks |
| Role | Data processor |

**Personal data received:** All email addresses (High risk), contact names in email body, email body content (outbound + inbound), send/open/click/bounce events, suppression list.

**Cross-border transfer:** Tanzania → United States. Requires DTA per PDPA §32.

**Standard DPA:** Twilio Data Protection Addendum.
- URL: https://www.twilio.com/legal/data-protection-addendum
- Sub-processor list: https://www.twilio.com/legal/sub-processors
- Activation: Twilio Console → Account → Legal → DPA → Accept

**DTA condition satisfied?** Conditionally — same analysis as Google. All required clauses covered; PDPC not named. Internal acknowledgement memo required.

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Sign / accept Twilio DPA via SendGrid console | Abbie | NEEDS ACTION |
| 2 | Download executed DPA + sub-processor list → `docs/legal/contracts/sendgrid-dpa-2026.pdf` | Developer | NEEDS ACTION |
| 3 | Draft internal Tanzania-PDPA acknowledgement memo | compliance-auditor | NEEDS ACTION |
| 4 | Confirm dedicated subdomain configuration (in progress per `docs/email/infrastructure-checklist.md`) | Email infra | IN PROGRESS |

**Current status: NEEDS ACTION — blocks outreach launch.**

---

## Processor 3 — Anthropic, PBC (Claude API)

**⚠️ New finding — not in the original PDPA opinion.** The legal-advisor's opinion addressed SendGrid and Google. The compliance audit identifies Anthropic as a third processor with equivalent PDPA §32 cross-border transfer obligations. This adds new blocking condition C-3.5.

| Field | Value |
|-------|-------|
| Legal entity | Anthropic, PBC (US) |
| Service | Claude API — used for email generation, inbound classification, conversation responses, RAG queries |
| Role | Data processor |

**Personal data received:** Contact names and email addresses when generating personalised emails or replies; email body content (outbound drafts + inbound prospect replies — **High risk** when replies contain unsolicited PII); conversation transcripts when constructing response context.

**Cross-border transfer:** Tanzania → United States. Requires DTA per PDPA §32.

**Standard DPA:** Anthropic Data Processing Agreement (incorporated in Commercial Terms).
- URL: https://www.anthropic.com/legal/dpa
- Sub-processor list: https://www.anthropic.com/legal/subprocessors
- Activation: Accepted at API account creation via Commercial Terms; downloadable from Anthropic console

**Critical configuration:** API requests are NOT used for model training by default (paid API). Zero Data Retention (ZDR) option available on Enterprise plans — disables 30-day prompt retention. ZDR is recommended if Dozen's plan supports it.

**DTA condition satisfied?** Conditionally — all required clauses covered (SOC 2 Type II attested). Same PDPC-not-named gap; same acknowledgement memo workaround. **Additional risk:** prompt-construction discipline on Dozen's side. Every tool calling the Claude API must pass minimum required fields only — no full Sheets-row dumps into prompts.

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Confirm Anthropic Commercial Terms + DPA accepted on funding account | Abbie | NEEDS ACTION |
| 2 | Download executed DPA → `docs/legal/contracts/anthropic-dpa-2026.pdf` | Developer | NEEDS ACTION |
| 3 | Verify training opt-out confirmed (visible in Anthropic console) | Abbie | NEEDS ACTION |
| 4 | Evaluate and activate ZDR if available on current plan | Abbie | RECOMMENDED |
| 5 | Code-review every Claude-calling tool for prompt-content minimisation | compliance-auditor + ai-engineer | NEEDS ACTION |
| 6 | Draft internal Tanzania-PDPA acknowledgement memo | compliance-auditor | NEEDS ACTION |

**Current status: NEEDS ACTION — blocks outreach launch (new condition C-3.5).**

---

## Processor 4 — Google Maps Platform (Places API)

**Distinct from Processor 1.** Google Workspace DPA covers Workspace products only. Google Maps Platform is governed by Google Cloud Platform terms — separate contractual relationship.

| Field | Value |
|-------|-------|
| Legal entity | Google LLC (US) under Google Maps Platform Terms |
| Service | Places API — used by prospect-discovery tool to find new hospitality venues |
| Role | Data processor for customer-uploaded data; data controller for its own Maps directory |

**Personal data received:** Minimal. Queries are not personal-data-bearing (location/category searches, not prospect-identifying). Responses may contain personal data in public business listings (contact names, personal emails used as business contacts) — but Dozen becomes controller on extraction, not Google.

**Cross-border transfer:** Queries contain no PII outbound. Risk concentrates in what Dozen does with extracted PII after the response (covered by data inventory Section E).

**Standard DPA:** Google Cloud Platform Data Processing Addendum.
- URL: https://cloud.google.com/terms/data-processing-addendum
- Accepted at Google Cloud account creation when API keys are issued

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Confirm Google Cloud Platform DPA accepted on Maps API account | Abbie | NEEDS ACTION |
| 2 | Document that Maps queries carry no PII outbound | data-engineer | NEEDS ACTION |
| 3 | Verify discovery tool discards raw query/response payloads after PII extraction | data-engineer | NEEDS ACTION |
| 4 | File internal note that Maps API is covered under Cloud DPA (separate from Workspace DPA) | compliance-auditor | NEEDS ACTION |

**Current status: NEEDS ACTION (lower urgency — Maps API is Phase 2 only; not blocking for Sprint 1 outreach).**

---

## Summary Matrix

| Processor | Data sensitivity | DPA available? | Blocks outreach? | Status |
|-----------|-----------------|----------------|------------------|--------|
| Google Sheets | **Highest** (master PII copy) | Yes — Workspace DPA | **YES** | NEEDS ACTION |
| SendGrid (Twilio) | **High** (all emails + body) | Yes — Twilio DPA | **YES** | NEEDS ACTION |
| Anthropic (Claude API) | **Medium-High** (prompts + replies) | Yes — Anthropic DPA | **YES** | NEEDS ACTION |
| Google Maps Platform | Low outbound | Yes — Cloud DPA | No (Phase 2 only) | NEEDS ACTION |

---

## Aggregated Action List

**Abbie (5 actions):**
1. Activate Google Workspace DPA via Admin Console
2. Sign / accept Twilio DPA via SendGrid console
3. Confirm Anthropic Commercial Terms + DPA on funding account
4. Verify Anthropic training opt-out + evaluate ZDR
5. Confirm Google Cloud Platform DPA on Maps API account

**Developer / data-engineer (4 actions):**
6. Download and file all 4 executed DPAs in `docs/legal/contracts/`
7. Document Maps-query no-PII-outbound design
8. Verify discovery-tool data-extraction discipline
9. Confirm SendGrid dedicated subdomain (in progress)

**compliance-auditor (5 actions):**
10. Draft 4 Tanzania-PDPA acknowledgement memos (one per processor)
11. Code-review every Claude-calling tool for prompt-content minimisation
12. Re-verify all conditions and issue unconditional CLEARED status once all blockers green
13. Add condition C-3.5 (Anthropic DTA) to PDPA conditions tracker
14. Schedule annual DPA review (May 2027)

**ai-engineer (1 action):**
15. Implement prompt-minimisation patterns in every Claude-calling tool; submit for compliance-auditor review

---

## Final Verdict — Processor Layer

**Status: NEEDS ACTION across all four processors before outreach launch** (Maps API the only deferrable item).

All four standard DPAs satisfy the legal-advisor's §6.3 DTA condition once executed and supplemented with internal Tanzania acknowledgement memos. No bespoke contract negotiation required with any processor — execution risk is purely operational (accepting DPAs, downloading copies, writing four short memos).

**Recommendation to project-manager:** Bundle these 15 actions into a single "DPA Week" sprint task. All actions are independent; can run in parallel. Estimated total effort: 1–2 working days. This is the cheapest blocking gate in the project — once cleared, combined with the other PDPA opinion conditions, the full outreach gate opens.
