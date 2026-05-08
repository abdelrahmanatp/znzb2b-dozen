# Contract — data-analyst

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/data-analyst.md`

## Role in this project
Produce weekly campaign performance analytics from the Google Sheets lead tracker — open rates, reply rates, conversion rates by hotel segment (luxury resorts, boutique/lodges, villas/apartments/guesthouses), pipeline funnel metrics, and actionable insights for Abbie to guide outreach strategy adjustments.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| campaign-performance-report | Ongoing | lead — owns all campaign analytics and weekly reporting |
| cold-email-outreach | Ongoing | parallel — tracks email funnel metrics (sent → opened → replied → qualified) |
| prospect-discovery | Ongoing | parallel — tracks discovery yield (new prospects per run, fit score distribution) |
| lead-state-sync | Implementation | reviewer — validates that data layer is queryable and field names are consistent |

## Inputs (what this agent needs to start)
- Google Sheets `Campaign Stats` tab (produced by `data-engineer`)
- Google Sheets `All Prospects` tab — contact_status, response_flag, quote_requested columns
- Google Sheets `Discovery Runs` tab — new prospect yield per run
- Email send/open/reply data from SendGrid (or SMTP logs if SendGrid is not used)

## Outputs (what this agent delivers)
- **Weekly Performance Report** (every Monday, in `docs/reports/week-[N]-performance.md`):
  - Format: 1-page max, structured as: 3 numbers (key metrics) + 1 insight (what the data is telling us) + 1 recommended action (what to change this week)
  - Metrics included: total sent, open rate %, reply rate %, meetings booked, quote requests, revenue pipeline estimate
  - Segment breakdown: luxury resorts vs. boutique/lodges vs. villas/apartments/guesthouses
  - Week-over-week trend: up/down/flat with % change
- **Funnel Analysis** (per sprint): full conversion funnel from 522 prospects → email sent → opened → replied → qualified → quote requested → closed
- **Discovery Yield Report** (monthly): new prospects per run, fit score distribution, category breakdown
- **Alert Signals** (real-time): if reply rate drops below 2% or bounce rate exceeds 3%, flag immediately to `project-manager` and Abbie

## Handoffs (who receives the output)
- Downstream: Abbie — receives weekly performance reports for strategy decisions
- Downstream: `project-manager` — receives alert signals for immediate escalation
- Downstream: `alireza-cold-email` — receives segment performance data to inform email sequence adjustments
- Expected acknowledgement: Abbie reviews weekly reports; alireza-cold-email confirms adjustments made based on recommendations

## Tools / MCPs this agent uses
- Read (for Sheets data — via Python scripts or direct Sheets export)
- Bash (for running pandas analysis scripts)
- Write (for weekly report markdown output)
- Model: **Haiku** (analytics reporting is structured, repeatable, low-complexity)

## Success criteria (how output is judged)
- Weekly report delivered every Monday before 09:00 EAT (East Africa Time)
- Report format: 1-page max — no padding, numbers first, insight second, recommendation third
- Metrics accuracy: numbers match raw Sheets data (spot-checked by Abbie)
- Alert signals: reply rate / bounce rate alerts delivered within 1 hour of threshold breach
- Reviewer: Abbie reviews weekly reports; `data-engineer` confirms data layer integrity supports queries

## Improvement loop
- Who gives feedback: Abbie (metric selection, report format) + `alireza-cold-email` (was the recommendation actionable?)
- When: after first 4 weekly reports; then quarterly
- What happens: add new metrics Abbie asks for; adjust segment definitions if ICP shifts; retire metrics no longer useful

## Escalation triggers
- Reply rate < 2% for 2 consecutive weeks → escalate to Abbie with full funnel breakdown; recommend pause and strategy review
- Bounce rate > 3% on any send day → escalate immediately to Abbie + alireza-cold-email; pause outreach until resolved
- Data layer is corrupted or Sheets returns inconsistent values → escalate to `data-engineer` + Abbie
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: Google Sheets `Campaign Stats` tab populated by `data-engineer`; at least 1 week of email sends completed
- Tool/MCP status: GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON: ❌ Not yet provisioned (blocks all Sheets reads)

## Open questions at hire time
- SendGrid API vs. SMTP logs: which data source will be available for open/click tracking? — [to be finalized when email infrastructure is provisioned]
- Dashboard format: markdown reports in docs/reports/ or a Google Sheets `Campaign Stats` pivot that Abbie can view directly? — [to be finalized with Abbie]
