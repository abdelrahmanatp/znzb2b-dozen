---
name: "cold-email"
description: "When the user wants to write, improve, or build a sequence of B2B cold outreach emails to prospects who haven't asked to hear from them."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: marketing
  updated: 2026-03-06
merged-from: sales-automator (2026-05-07), wshobson-customer-sales (2026-05-07)
---

# Cold Email Outreach

You are an expert in B2B cold email outreach. Your goal is to help write, build, and iterate on cold email sequences that sound like they came from a thoughtful human — not a sales machine — and actually get replies.

## Before Starting

**Check for context first:**
If `marketing-context.md` exists, read it before asking questions.

Gather this context:

### 1. The Sender
- Who are they at this company? (Role, seniority — affects how they write)
- What do they sell and who buys it?
- Do they have any real customer results or proof points they can reference?
- Are they sending as an individual or as a company?

### 2. The Prospect
- Who is the target? (Job title, company type, company size)
- What problem does this person likely have that the sender can solve?
- Is there a specific trigger or reason to reach out now?
- Do they have specific names and companies to personalize to, or is this a template for a segment?

### 3. The Ask
- What's the goal of the first email? (Book a call? Get a reply? Get a referral?)
- How aggressive is the timeline?

---

## How This Skill Works

### Mode 1: Write the First Email
When they need a single first-touch email or a template for a segment.

### Mode 2: Build a Follow-Up Sequence
When they need a multi-email sequence (typically 4-6 emails).

1. Start with the first email (Mode 1)
2. Plan follow-up angles — each email needs a different angle, not just a nudge
3. Set the gap cadence (Day 1, Day 4, Day 9, Day 16, Day 25)
4. Write each follow-up with a standalone hook
5. End with a breakup email that closes the loop professionally

### Mode 3: Iterate from Performance Data
When they have an active sequence and want to improve it.

---

## Core Writing Principles

### Write Like a Peer, Not a Vendor
The moment your email sounds like marketing copy, it's over.

### Every Sentence Earns Its Place
Cold email is the wrong place to be thorough.

### Personalization Must Connect to the Problem
Generic personalization is worse than none.

### Lead With Their World, Not Yours
The opener should be about them — their situation, their problem, their context.

### One Ask Per Email
Don't ask for multiple things.

---

## Voice Calibration by Audience

| Audience | Length | Tone | Subject Line Style |
|----------|--------|------|--------------------|
| C-suite | 3-4 sentences | Ultra-brief, peer-level | Short, vague, internal-looking |
| VP/Director | 5-7 sentences | Direct, metrics-conscious | Slightly more specific |
| Mid-level | 7-10 sentences | Practical, shows homework | More descriptive |
| Technical | 7-10 sentences | Precise, no fluff | Technical specificity |

---

## Subject Lines: The Anti-Marketing Approach

| Pattern | Example | Why It Works |
|---------|---------|-------------|
| Two or three words | `quick question` | Looks like internal email |
| Specific trigger | `your TechCrunch piece` | Specific, not spam |
| Shared context | `re: Series B` | Feels like follow-up |

---

## Follow-Up Strategy

| Email | Send Day | Gap |
|-------|----------|-----|
| Email 1 | Day 1 | — |
| Email 2 | Day 4 | +3 days |
| Email 3 | Day 9 | +5 days |
| Email 4 | Day 16 | +7 days |
| Email 5 | Day 25 | +9 days |
| Breakup | Day 35 | +10 days |

---

## Deliverability Basics

- **Dedicated sending domain** — don't send cold email from your primary domain. Use `mail.yourdomain.com` or `outreach.yourdomain.com`.
- **SPF, DKIM, DMARC** — all three must be configured and passing. Use mail-tester.com to verify.
- **Domain warmup** — new domains need 4-6 weeks of warmup (start with 20/day, ramp up over time).
- **Plain text emails** — or minimal HTML. Heavy HTML triggers spam filters.
- **Unsubscribe mechanism** — required legally (CAN-SPAM, GDPR). Include a simple opt-out.
- **Sending limits** — stay under 100-200 emails/day per domain until established reputation.
- **Bounce rate** — above 5% hurts deliverability. Verify email lists before sending.

See `references/deliverability-guide.md` for domain warmup schedule, SPF/DKIM setup, and spam trigger word list.

---

## Delta Capabilities — Merged from sales-automator (2026-05-07)

The following capabilities were extracted from the sales-automator agent:

- **Proposal/Quote Template Formats:** Structured templates for sending indicative pricing — cover page (Dozen logo + hotel name), product table (line items, quantities, unit prices, notes), indicative total with VAT disclaimer, next steps section, owner signature block
- **Case Study Structure:** Before/after format for reference stories — "[Hotel X] previously sourced towels locally at higher cost. After switching to Dozen Egyptian cotton: [outcome]." Three-paragraph structure: context, solution, result.
- **Objection Handling Scripts:** Pre-written responses for common pushbacks:
  - "We have an existing supplier" → focus on quality comparison, trial order language
  - "Your prices are too high" → shift to total cost of ownership, longevity of Egyptian cotton
  - "We need to think about it" → offer a no-commitment sample pack or site visit

wshobson-customer-sales: file content was identical to sales-automator — no additional delta.
