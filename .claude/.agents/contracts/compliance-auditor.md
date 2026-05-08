# Contract — compliance-auditor

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/compliance-auditor.md`

## Role in this project
Conduct formal compliance audits across all three regulatory surfaces: Tanzania PDPA 2022 for the 522-prospect outreach pipeline, Meta WABA template policy for Phase 2 WhatsApp, and CAN-SPAM / email campaign requirements; also audit third-party data processors (Google Sheets, SendGrid/SMTP, Claude API) for compliance obligations.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Pre-launch | lead — formal PDPA data inventory + CAN-SPAM checklist before launch |
| lead-state-sync | Implementation | reviewer — audits Google Sheets data access controls and retention policy |
| quote-approval-routing | Implementation | reviewer — audits WABA template submission for Phase 2 readiness |
| campaign-performance-report | Ongoing | reviewer — validates that analytics data is anonymized / aggregated appropriately |

## Inputs (what this agent needs to start)
- PDPA Lawful Basis Opinion from `legal-advisor`
- Email sequences from `alireza-cold-email`
- Google Sheets schema from `data-engineer` (to assess what PII is stored and where)
- Python tools from `python-pro` (to audit data handling at code level)
- Third-party processor list: Google Sheets, SendGrid/SMTP relay, Claude API, Google Maps API

## Outputs (what this agent delivers)
- **PDPA Data Inventory:** Table of all PII fields collected (name, email, phone, hotel name, role), their purpose, retention period, and lawful basis — mapped to the 522-prospect Sheets schema
- **CAN-SPAM Compliance Checklist:** All six requirements verified (physical address, opt-out mechanism, honest subject lines, sender ID, opt-out processing within 10 days, no deceptive routing)
- **Third-Party Processor Assessment:** For each processor (Google Sheets, SendGrid, Claude API, Google Maps API) — data processor vs. data controller classification, DPA status, adequacy concerns
- **WABA Template Compliance Review (Phase 2):** Categorization of planned message templates (utility vs. marketing vs. authentication); policy compliance verdict
- **Compliance Gap Register:** All gaps found with severity + required remediation before launch
- **Ongoing Audit Reports:** Monthly compliance spot-checks once campaign is live

## Handoffs (who receives the output)
- Downstream: `python-pro` — receives data handling remediation requirements (e.g., "delete PII from logs within 7 days")
- Downstream: `alireza-cold-email` — receives CAN-SPAM checklist to implement in sequences
- Downstream: `data-engineer` — receives Sheets retention policy requirements
- Downstream: Abbie — receives compliance gap register for go/no-go decision before launch
- Expected acknowledgement: each agent confirms remediation implemented; Abbie approves gap register before launch

## Tools / MCPs this agent uses
- Read, Grep (for code and schema review)
- WebSearch (for current regulatory text, Meta WABA policy)
- Write (for audit reports)
- Model: **Opus** (compliance analysis requires thorough legal-adjacent reasoning)

## Success criteria (how output is judged)
- PDPA data inventory complete before first email batch — no prospect PII processed without documented lawful basis
- CAN-SPAM checklist 100% green before first email sends (all six requirements met)
- Zero unaddressed CRITICAL compliance gaps at launch
- Third-party processor assessment complete for all four processors
- Reviewer: `legal-advisor` validates compliance interpretations; Abbie signs off on gap register

## Improvement loop
- Who gives feedback: `legal-advisor` (interpretation corrections) + `python-pro` (implementation feasibility of compliance requirements)
- When: after each sprint that touches data handling; monthly post-launch
- What happens: update data inventory, refresh gap register, flag new regulatory developments

## Escalation triggers
- PDPA lawful basis is absent or invalid for a prospect segment → escalate to Abbie + legal-advisor; halt outreach to that segment
- Third-party processor found to have inadequate DPA or data residency outside Tanzania/acceptable regions → escalate to Abbie
- CAN-SPAM opt-out mechanism not implemented before scheduled first send → block launch, escalate to Abbie
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: PDPA Lawful Basis Opinion from legal-advisor; Google Sheets schema from data-engineer
- Tool/MCP status: WebSearch ✅ available

## Open questions at hire time
- Tanzania PDPA enforcement: is the Data Protection Commission actively enforcing as of 2026? — [to be researched by compliance-auditor at audit time]
- Claude API data handling: does Anthropic's data processing agreement cover processing of hotel prospect PII? — [to be assessed in third-party processor review]
