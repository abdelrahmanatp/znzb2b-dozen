# Contract — qa-expert

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/qa-expert.md`

## Role in this project
Test all system components — email sending (delivery + cadence timing), Google Sheets sync (state updates on reply), website quote flow routing, AI conversation handler (pricing escalation trigger), and mobile website across key device/browser combinations.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Implementation | reviewer — tests email delivery, cadence, personalization |
| lead-state-sync | Implementation | reviewer — tests Sheets sync integrity |
| website-sprint | Implementation | reviewer — tests quote flow, mobile UX, catalog navigation |
| catalog-knowledge-base | Implementation | reviewer — tests catalog retrieval accuracy |
| code-review-cycle | All sprints | parallel — QA review alongside code-reviewer |

## Inputs (what this agent needs to start)
- Acceptance criteria from `docs/4-deliverables.md`
- Test environment access (staging website, test Google Sheets, test email sandbox)
- Email sequence templates from `alireza-cold-email`
- Website build from `nextjs-developer`
- Python tools from `python-pro`

## Outputs (what this agent delivers)
- Test plan per sprint (what will be tested, how, success/fail criteria)
- Test execution results (pass/fail per test case)
- Defect reports (severity, steps to reproduce, expected vs actual)
- Mobile testing results (iPhone 14, Samsung Galaxy S23, minimum)
- QA sign-off (go/no-go per component before it goes to production)

## Handoffs (who receives the output)
- Downstream: `python-pro` / `nextjs-developer` — receive defect reports to fix
- Downstream: Abbie (via project-manager) — receives QA sign-off verdict
- Expected acknowledgement: developers confirm fixes; re-test before sign-off

## Tools / MCPs this agent uses
- /webapp-testing skill for website QA (Playwright-based)
- Bash for running Python tool tests
- Email sandbox (Mailtrap or similar) for email delivery testing

## Success criteria (how output is judged)
- Email tool: zero personalization errors in test run of 20 emails (right hotel name, right category, right product references)
- Sheets sync: zero data corruption in 100 concurrent-write simulation
- Website: all pages load on mobile in < 3 seconds on 4G
- Quote flow: 100% of test submissions reach AI agent and generate response
- Zero critical defects at QA sign-off
- Reviewer: Abbie does final acceptance on core user flows before launch

## Improvement loop
- Who gives feedback: `python-pro` / `nextjs-developer` (contest any defect report); Abbie (missing test coverage)
- When: after each sprint, before close
- What happens: add new test cases for edge cases discovered; update test plan

## Escalation triggers
- Critical defect found in production (post-launch) → escalate immediately to Abbie with severity assessment
- Test environment not available or unstable → escalate to project-manager and Abbie
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: staging environment set up, test data prepared (test prospect list, test email account)

## Open questions at hire time
- CI/CD integration: ✅ FINALIZED — Post-merge regression testing runs automatically in `code-review-cycle` SOP Phase 4 after every merge. Full site QA (mobile, quote flow, email delivery) runs at sprint review gates in `website-sprint` and `cold-email-outreach` SOPs — not on every PR.
