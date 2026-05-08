# Contract — alireza-cold-email

**Hired:** 2026-05-07
**Source:** library (Alireza Rezvani)
**Source file:** `.claude/.agents/alireza-cold-email.md`

## Role in this project
Write and sequence all outreach emails to the 522 prospects — personalized by hotel category (resort vs boutique vs villa vs lodge), multi-touch follow-up cadence, breakup email; owns email deliverability setup (SPF/DKIM/DMARC, sending subdomain, inbox warming schedule).

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Strategy + Implementation | lead — email sequence strategy, template writing, deliverability setup |
| campaign-performance-report | Ongoing | parallel — diagnoses underperforming email segments and recommends rewrites |
| inbound-email-response | Implementation | reviewer — ensures inbound response tone is consistent with outreach voice |

## Inputs (what this agent needs to start)
- `docs/2-context.md` — Dozen brand context, product lines, existing clients (TUI Blue, LUX*, etc. as credibility proof)
- Prospect segment profiles from `lead-research-assistant` — hotel types, locations, property sizes
- AI persona brief from `alireza-senior-prompt-engineer` — approved tone of voice
- Deliverability checklist: sending domain, SPF/DKIM/DMARC status

## Outputs (what this agent delivers)
- 6-email sequence (Email 1 through breakup) per prospect segment:
  - Segment A: Luxury resorts/5-star hotels
  - Segment B: Boutique hotels/lodges
  - Segment C: Villas/apartments/guesthouses
- Subject line variants (3 per email)
- Personalization field map: which fields from the prospect sheet to use in each template
- Deliverability setup checklist (SPF/DKIM/DMARC config steps for info@dozensupplies.com sending domain)
- Inbox warming schedule: Day 0-7: 20/day, Day 8-21: 40/day, Day 22-42: 80/day, Day 43+: up to 150/day

## Handoffs (who receives the output)
- Downstream agent: `alireza-senior-prompt-engineer` — receives sequence structure to write Claude prompts for AI-generated personalization
- Downstream agent: `python-pro` — receives email templates to integrate into sending tool
- Expected acknowledgement: python-pro confirms templates are parseable; prompt-engineer confirms personalization logic is promptable

## Tools / MCPs this agent uses
- Read (for prospect context)
- Write (for email sequence files in `outreach/sequences/`)
- No external MCPs — deliverability uses SMTP/SendGrid configured via python-pro tools

## Success criteria (how output is judged)
- Email 1 passes "peer test": would a thoughtful colleague send this to a hotel GM?
- Open rate target: >40% (cold B2B, strong personalization)
- Reply rate target: >8% (first email) / >5% (aggregate sequence)
- Subject lines: short (≤5 words), no ALL CAPS, no "I hope this finds you well"
- Sequence: each email has a distinct angle (no "just following up")
- Reviewer: `legal-advisor` checks PDPA compliance; `compliance-auditor` verifies opt-out mechanism

## Improvement loop
- Who gives feedback: `data-analyst` (open/reply rate data per segment and per email number)
- When: after first 50 sends per segment, then monthly
- What happens: Mode 3 (iterate from performance data) — diagnose subject line vs body vs CTA, rewrite underperformer, A/B test variant

## Escalation triggers
- Reply rate < 3% after 100 sends → pause and diagnose; escalate to Abbie before continuing
- Bounce rate > 5% → pause immediately; investigate list quality and domain health
- Any reply expressing legal concern (unsubscribe demand, spam complaint) → flag immediately to `legal-advisor`
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: domain warm-up initiated (new sending subdomain must be provisioned first), legal clearance from `legal-advisor` on PDPA legitimate interest basis
- Prospect data: `/xlsx` skill migrates Consolidated.xlsx to Google Sheets first

## Open questions at hire time
- Sending subdomain: `outreach.dozensupplies.com` or `mail.dozensupplies.com`? — [confirm with Dozen before DNS setup]
- ESP/SMTP choice: Google Workspace SMTP vs SendGrid vs Mailgun — [to be finalized in /workflow]
- Personalization depth: can we use hotel website info and TripAdvisor reviews as personalization triggers, or only the 14 columns in the spreadsheet? — [to be finalized in /workflow]
