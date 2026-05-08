# CAN-SPAM Compliance Checklist — Dozen Hotel Supplies Outreach
**Prepared by:** compliance-auditor
**Date:** 2026-05-08
**Status:** DELIVERED
**Scope:** All outreach emails sent to the 521 Tanzanian hotel/hospitality prospects via SendGrid (US infrastructure)
**Companion document:** `docs/legal/pdpa-opinion.md`

---

## Why CAN-SPAM Applies Here

The Dozen outreach pipeline routes through SendGrid (Twilio Inc., US-based ESP). The CAN-SPAM Act of 2003 (15 U.S.C. § 7701 et seq.) governs commercial email originating from or transiting US infrastructure, regardless of recipient jurisdiction. Applying CAN-SPAM provides:

1. Legal coverage for the US-based sending infrastructure
2. A globally accepted best-practice baseline that strengthens the PDPA legitimate-interests balancing test
3. SendGrid Acceptable Use Policy compliance (SendGrid contractually requires CAN-SPAM compliance)

Maximum CAN-SPAM penalty: USD 51,744 per violating email (FTC adjusted figure, 2024).

---

## The Six Mandatory CAN-SPAM Requirements

### 1. Don't use false or misleading header information

**Rule:** The "From," "To," "Reply-To," and routing information must accurately identify the person or business who initiated the message.

**Implementation:**
- From name: `Dozen Hotel Supplies` (matches registered business name)
- From address: `[firstname]@outreach.dozensupplies.com` (named human sender, not generic noreply)
- Reply-To: same as From address — replies route to the inbound handler
- SPF, DKIM, and DMARC must be aligned on the sending subdomain (per `docs/email/infrastructure-checklist.md`)

**Status: COMPLIANT** — conditional on SPF/DKIM/DMARC alignment confirmed before first send.

---

### 2. Don't use deceptive subject lines

**Rule:** The subject line must accurately reflect the content of the message. Forbidden: false urgency, fake Re:/Fwd: threads, fake transaction confirmations.

**Implementation:**
- Subject lines must reference the commercial nature of the email
- Banned phrases: "Re:", "Fwd:", "URGENT", "ACTION REQUIRED", "Your invoice", anything implying a pre-existing relationship
- Allowed patterns: descriptive ("Premium linen for [Hotel Name]"), question-form ("Linen supplier review for [Hotel Name]?"), introductory ("Introducing Dozen — hotel linen specialists in Zanzibar")
- Subject-line library reviewed and locked by compliance-auditor before alireza-cold-email finalises templates

**Status: NEEDS ACTION** — subject-line library must be reviewed and locked before first send (blocking gate).

---

### 3. Identify the message as an advertisement

**Rule:** The message must clearly disclose that it is a commercial solicitation.

**Implementation:**
- Email body opens with explicit purpose: "We are reaching out because your property may benefit from our hotel linen and supplies range"
- Footer: "This is a commercial introduction from Dozen Hotel Supplies."
- Maps directly to PDPA §4.1 element 3 (purpose of contact) — single implementation satisfies both regimes

**Status: COMPLIANT** — verified in locked template by compliance-auditor.

---

### 4. Tell recipients where you are located

**Rule:** The message must include a valid physical postal address.

**Implementation:**
- Footer of every email: `303 Silversand, Kibweni, P.O. Box 4212, Zanzibar, Tanzania`
- Must be plain text (not image-only)
- Must appear in every email in the sequence (initial + all follow-ups)

**Status: COMPLIANT** — address confirmed; compliance-auditor verifies presence in locked template.

---

### 5. Tell recipients how to opt out

**Rule:** Clear explanation of how to opt out, mechanism functional for at least 30 days.

**Implementation:**
- One-click unsubscribe link in every email footer — frictionless, no login required
- `List-Unsubscribe` header (RFC 2369) and `List-Unsubscribe-Post` header (RFC 8058) in every message
- Unsubscribe handler live, monitored, and load-tested before first send
- Mechanism remains functional indefinitely (PDPA grants absolute ongoing right to object — exceeds the 30-day minimum)

**Status: NEEDS ACTION** — unsubscribe page and headers must be deployed and tested before first send (PDPA opinion condition C-6, blocking).

---

### 6. Honor opt-out requests promptly

**Rule:** Opt-out requests honored within 10 business days. No conditions beyond a single web page visit.

**Implementation:**
- Tanzania PDPA mandates 48-hour action window (per legal opinion C-6) — Dozen operates to 48-hour standard, well inside the CAN-SPAM ceiling
- Opt-out triggers immediate `contact_status = UNSUBSCRIBED` write via inbound handler
- `send_email.py` preflight check excludes UNSUBSCRIBED rows from send queue
- Suppression record retained indefinitely — only email + opt-out date + flag retained
- No transfer of opted-out addresses to any third party

**Status: COMPLIANT** — design enforces 48-hour action and indefinite suppression.

---

## Item 7 — Tanzania PDPA Mandatory Email Disclosure Elements (per legal opinion §4.1)

| # | PDPA Element | CAN-SPAM Overlap | Implementation | Status |
|---|--------------|------------------|----------------|--------|
| 1 | Sender identity (full legal name) | Item 1 | "Dozen Hotel Supplies" in From field and body | COMPLIANT |
| 2 | Physical address | Item 4 | `303 Silversand, Kibweni, P.O. Box 4212, Zanzibar, Tanzania` in footer | COMPLIANT |
| 3 | Purpose of contact | Item 3 | Opening line discloses commercial intent | COMPLIANT |
| 4 | Source of data | None — PDPA-specific | "We found your contact details via Google Maps / public hospitality directory" | NEEDS ACTION (template wording) |
| 5 | Lawful basis statement | None — PDPA-specific | "We are contacting you on the basis of our legitimate business interest in reaching relevant hospitality buyers" | NEEDS ACTION (template wording) |
| 6 | Opt-out mechanism | Items 5 & 6 | One-click unsubscribe + List-Unsubscribe header | NEEDS ACTION (deployment) |
| 7 | Data rights notice | None — PDPA-specific | "You have the right to access, correct, delete, or object to processing of your personal data. See [privacy policy link]." | NEEDS ACTION (template wording + privacy policy live) |
| 8 | Contact for data inquiries | None — PDPA-specific | `privacy@dozensupplies.com` (or `info@dozensupplies.com` until dedicated alias provisioned) | NEEDS ACTION (alias provisioning) |
| 9 | No deceptive subject line | Item 2 | Subject-line library locked by compliance-auditor | NEEDS ACTION (library lock) |
| 10 | Pricing disclaimer | None — Dozen business rule | Required only when prices appear in email body — cold outreach templates contain no pricing | COMPLIANT |

---

## Compliance Verdict — CAN-SPAM Layer

| Status | Count |
|--------|-------|
| COMPLIANT | 4 of 6 CAN-SPAM items + 4 of 10 PDPA elements |
| NEEDS ACTION | 2 of 6 CAN-SPAM items + 6 of 10 PDPA elements |
| CANNOT DETERMINE | 0 |

**Blocking actions before first send:**
1. Subject-line library reviewed and locked by compliance-auditor
2. Unsubscribe landing page deployed, tested, and List-Unsubscribe headers configured in SendGrid
3. Email template incorporates PDPA elements 4, 5, 7 (source of data, lawful basis statement, data rights notice)
4. `privacy@dozensupplies.com` alias provisioned and routed to a monitored inbox
5. Privacy policy published on dozensupplies.com

**Owner:** project-manager coordinates; alireza-cold-email implements template changes; nextjs-developer deploys unsubscribe page and privacy policy; compliance-auditor verifies and locks before first send.
