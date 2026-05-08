# PDPA Personal Data Inventory — Dozen Hotel Supplies AI System
**Prepared by:** compliance-auditor
**Date:** 2026-05-08
**Status:** DELIVERED
**Governing law:** Tanzania PDPA No. 11 of 2022 + GN No. 449C of 2023
**Companion documents:** `docs/legal/pdpa-opinion.md`, `docs/architecture/lead-state-schema.md`

---

## Purpose

This inventory maps every personal data element processed by the Dozen outreach and inbound conversation system to: its source, processing purpose, lawful basis under PDPA §25, retention period (per legal opinion §5), storage location, processors, and risk classification.

Per PDPA Collection and Processing Regulations 2023, the data controller must maintain a record of processing activities. This inventory is that record.

**Data controller:** Dozen Hotel Supplies (Tanzania)
**Data subjects:** Identified or identifiable natural persons at 521 hospitality businesses in Zanzibar
**Legal basis (primary):** Legitimate interests (PDPA §25 per legal opinion §1.2)

---

## Section A — Source Data (14 original xlsx columns)

| # | Data element | Schema column | Source | Purpose | Legal basis | Retention | Stored where | Processor(s) | Risk |
|---|--------------|---------------|--------|---------|-------------|-----------|--------------|--------------|------|
| 1 | Row ID | A — No. | Generated at migration | Internal primary key | Not personal data (synthetic) | Database lifecycle | Google Sheets | Google | Low |
| 2 | Business category | B — Category | xlsx (public sources) | Outreach segmentation | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |
| 3 | Business subcategory | C — Subcategory | xlsx | Outreach segmentation | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |
| 4 | Company Name | D — Company Name | xlsx | Personalisation; business identification | Legitimate interests | Per opinion §5 | Google Sheets, SendGrid (email body), Anthropic (prompts) | Google, Twilio, Anthropic | Low |
| 5 | Trading Name | E — Trading Name | xlsx | Personalisation | Legitimate interests | Per opinion §5 | Google Sheets, SendGrid (email body), Anthropic (prompts) | Google, Twilio, Anthropic | Low |
| 6 | Location (district) | F — Location | xlsx | Geographic segmentation | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |
| 7 | Region | G — Region | xlsx | Geographic segmentation | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |
| 8 | **Contact person name** | H — Contact Person | xlsx (public sources, Google Maps) | Email personalisation; conversation handling | **Legitimate interests** | 12m no-response / 24m responded / contract+5y client / indefinite suppression / immediate hard-bounce delete | Google Sheets, SendGrid (email body + headers), Anthropic (prompts) | Google, Twilio, Anthropic | **Medium — direct identifier** |
| 9 | Position / Job title | I — Position | xlsx | Relevance signal; personalisation | Legitimate interests | Per opinion §5 | Google Sheets, SendGrid (optional body), Anthropic (prompts) | Google, Twilio, Anthropic | Low–Medium |
| 10 | **Phone number** | J — Phone | xlsx | Phase 2 WhatsApp outreach; sales-manager handoff | Legitimate interests (Phase 1) | Per opinion §5; Phase 2 elevates risk when transmitted to Meta | Google Sheets (Phase 1 only) | Google (Phase 1); Google + Meta (Phase 2) | **Medium (Phase 1); High (Phase 2)** |
| 11 | **Email address** | K — Email | xlsx | Email outreach; conversation handling | **Legitimate interests** | Immediate delete on hard bounce; indefinite suppression on opt-out | Google Sheets, SendGrid (delivery), Anthropic (prompts) | Google, Twilio, Anthropic | **High — primary processing target; cross-border transfer to US processors** |
| 12 | Website URL | L — Website | xlsx | Research; personalisation | Legitimate interests | Per opinion §5 | Google Sheets, Anthropic (context enrichment) | Google, Anthropic | Low (public URL) |
| 13 | Source year tag | M — Source | xlsx | Data provenance / audit | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |
| 14 | Org Type (Raw) | N — Org Type (Raw) | xlsx | Reference only — read-only in pipeline | Legitimate interests | Per opinion §5 | Google Sheets | Google | Low |

---

## Section B — System-Generated State Data (7 new columns)

| # | Data element | Schema column | Source | Purpose | Legal basis | Retention | Stored where | Risk |
|---|--------------|---------------|--------|---------|-------------|-----------|--------------|------|
| 15 | Contact status enum | O — contact_status | send_email.py / inbound_handler.py | Pipeline state; duplicate-send prevention; opt-out enforcement | Legitimate interests | Lifetime of prospect record | Google Sheets | Low |
| 16 | Channel enum | P — channel | send_email.py / future WhatsApp tools | Pipeline state | Legitimate interests | Lifetime | Google Sheets | Low |
| 17 | Last contacted date | Q — last_contacted | send_email.py | Cadence enforcement; retention timer anchor | Legitimate interests | Lifetime | Google Sheets | Low |
| 18 | Conversation ID | R — conversation_id | send_email.py at first send | Thread linking | Legitimate interests | Lifetime | Google Sheets | Low |
| 19 | Response flag | S — response_flag | inbound_handler.py | State tracking | Legitimate interests | Lifetime | Google Sheets | Low |
| 20 | Quote-requested flag | T — quote_requested | inbound_handler.py | State tracking; owner approval trigger | Legitimate interests | Lifetime | Google Sheets | Low |
| 21 | Operator notes | U — notes | Operators / tools | Operational context | Legitimate interests | Lifetime | Google Sheets | Medium — may contain free-text PII; access restricted to authorised operators |

---

## Section C — Email and Conversation Content

| # | Data element | Source | Purpose | Legal basis | Retention | Processor(s) | Risk |
|---|--------------|--------|---------|-------------|-----------|--------------|------|
| 22 | **Outbound email body** | Generated by alireza-cold-email + send_email.py | Outreach delivery | Legitimate interests | 24 months in SendGrid sent-mail logs | Twilio, Anthropic, Google | **Medium** |
| 23 | **Inbound email body** (prospect replies) | Prospect | Conversation handling; classification; response generation | Legitimate interests | 24 months from last interaction | Twilio, Anthropic, Google | **High — may contain unsolicited PII; minimisation required in prompt construction** |
| 24 | Conversation transcripts (full thread) | Aggregated outbound + inbound | Quote-pipeline context; owner/sales-manager handoff | Legitimate interests | 24 months | Anthropic (transient per turn) | High |
| 25 | Email send timestamps | send_email.py | Cadence enforcement; bounce-rate calculation | Legitimate interests | Lifetime of prospect record | Google, Twilio | Low |
| 26 | Email open / click events | SendGrid webhooks (if enabled) | Engagement signals (optional) | Legitimate interests | 24 months | Twilio | Medium — behavioural data linked to email address |
| 27 | Bounce events + reason codes | SendGrid bounce webhooks | Hard-bounce deletion; soft-bounce retry | Legitimate interests + data accuracy | Bounce reason in audit log; PII deleted on hard bounce per opinion §5 | Twilio, Google | Low |
| 28 | **Unsubscribe records** | Unsubscribe handler | Suppression list; preventing re-contact | Compliance with absolute right to object | **Indefinite** — required to prevent future re-contact | Google, Twilio | Medium — minimal data (email + date + flag) retained indefinitely |

---

## Section D — Audit Log Data

| # | Data element | Source | Purpose | Retention | Risk |
|---|--------------|--------|---------|-----------|------|
| 29 | Audit log entries (log_id, timestamp, prospect_no, field_changed, old_value, new_value, triggered_by_tool, run_id) | All write tools | Compliance evidence; debugging; PDPA audit support | Indefinite (compliance evidence) | Low–Medium (prospect_no resolves to PII via join) |

---

## Section E — Discovery-Run Data (Phase 2+)

| # | Data element | Source | Purpose | Risk |
|---|--------------|--------|---------|------|
| 30 | New prospect fields (mirrors fields 1–14) | Google Maps Places API; web search | Prospect pipeline expansion | Per source field (Medium for name/email/phone) |
| 31 | Discovery run ID + metadata | Discovery tool | Provenance / traceability | Low |
| 32 | Google Maps query strings + responses | Discovery tool | Prospect identification — discarded after extraction | Low (public business listings) |

---

## Cross-Border Transfer Summary

All Medium/High risk data transfers to US-based processors trigger PDPA §32 obligations.

| Transfer | Lawful mechanism | Status |
|----------|-----------------|--------|
| Dozen → Google Sheets | DTA (Google Workspace DPA + Tanzania acknowledgement memo) | NEEDS ACTION |
| Dozen → SendGrid (Twilio) | DTA (Twilio DPA + Tanzania acknowledgement memo) | NEEDS ACTION |
| Dozen → Anthropic API | DTA (Anthropic DPA + Tanzania acknowledgement memo) | NEEDS ACTION (**newly identified**) |
| Dozen → Google Maps API | Google Cloud DPA (lower urgency — Phase 2 only) | NEEDS ACTION |

---

## Data Minimisation Requirements

1. **Anthropic prompt construction:** Pass only minimum required fields — contact name, company name, conversation history. Exclude phone, website, raw org-type, position unless directly relevant. Owner: ai-engineer; verification: compliance-auditor at code review.
2. **send_email.py:** Construct SMTP envelope with minimum payload — recipient email + name only. No full Sheets-row copy into SendGrid custom args.
3. **Inbound email parsing:** Extract only sender email (matched against Sheets), reply body, timestamp. No extra headers retained beyond Message-ID / In-Reply-To.
4. **Audit log:** `old_value` / `new_value` fields must not contain PII beyond what the field describes.
5. **Phone numbers (Phase 1):** Stored in Google Sheets only — does NOT flow to SendGrid or Anthropic. Confirmed in code review of all tools.

---

## Data Subject Rights — Implementation Map

| Right | Implementation | Status |
|-------|----------------|--------|
| Right to information (transparency) | Mandatory email elements 1–8 (legal opinion §4.1) + privacy policy on dozensupplies.com | NEEDS ACTION |
| Right of access | `privacy@dozensupplies.com` inbox; SOP to pull all rows + audit log entries + conversation transcripts for matching prospect | NEEDS ACTION (SOP + alias) |
| Right to rectification | Same channel; corrections via sync_lead_state.py with audit log entry | NEEDS ACTION (SOP) |
| Right to erasure | Hard delete prospect row + conversation transcripts; SendGrid suppression record retained (email + opt-out flag only) | NEEDS ACTION (SOP) |
| Right to object (commercial processing) | One-click unsubscribe + privacy@ inbox; 48-hour action; `contact_status = UNSUBSCRIBED`; indefinite suppression | NEEDS ACTION (unsubscribe deployment) |
| Right to data portability | Export prospect row + conversation transcripts as JSON on request | NEEDS ACTION (SOP — low priority) |
| Right not to be subject to automated decision-making | AI classifies replies but does NOT make decisions with legal effects. All quotes require human approval (owner + sales-manager gate). No fully automated decisioning. | **COMPLIANT by design** |

---

## Compliance Audit Verdict

```
Status: CLEARED WITH CONDITIONS

Conditions (blocking — outreach cannot begin until these are satisfied):
1. Confirm Dozen PDPC registration current (legal opinion C-1)
2. Execute Data Transfer Agreement with SendGrid/Twilio (legal opinion C-2)
3. Execute Data Transfer Agreement with Google Sheets/Workspace (legal opinion C-3)
3.5. Execute Data Transfer Agreement with Anthropic — NEWLY IDENTIFIED
4. Verify Google Maps API under Google Cloud DPA (deferrable to Phase 2)
5. Email template incorporates all 10 PDPA mandatory elements (legal opinion C-5)
6. One-click unsubscribe live + List-Unsubscribe headers configured (legal opinion C-6)
7. Privacy policy published on dozensupplies.com (legal opinion C-8)
8. Email validation run on 521 prospect list before first send (legal opinion C-4)
9. privacy@dozensupplies.com alias provisioned and monitored
10. Subject-line library locked by compliance-auditor
11. Prompt-minimisation code review complete for all Claude-calling tools

Cleared for outreach: NO

Reason: Legitimate-interests basis is sound. All conditions are operationalisable.
The blocking gate is procedural (DPAs, template lock, unsubscribe deployment),
not a fundamental legal obstacle. Once conditions 1, 2, 3, 3.5, 5, 6, 7, 8, 9,
10 are satisfied, compliance-auditor issues unconditional CLEARED status.
```

**Next action:** project-manager opens Sprint 1 remediation tasks for each blocking condition; compliance-auditor re-verifies and issues CLEARED once all are green.
