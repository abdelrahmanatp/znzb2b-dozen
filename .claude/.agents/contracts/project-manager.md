# Contract — project-manager

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/project-manager.md`

## Role in this project
Coordinate parallel workstreams across the 10+ agent team — tracking sprint progress, managing approval gates, flagging the WABA 2-6 week provisioning dependency, and ensuring Abbie has daily visibility into blockers without needing to read every contract or log.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Pre-launch | parallel — tracks deliverability setup milestones (domain warming schedule, SPF/DKIM/DMARC) |
| lead-state-sync | Implementation | parallel — tracks Google Sheets provisioning dependency |
| quote-approval-routing | Implementation | parallel — tracks WABA provisioning (HIGH risk: 2-6 week Meta approval) |
| website-sprint | Implementation | parallel — tracks hotel logo delivery dependency from Dozen |
| campaign-performance-report | Ongoing | lead — owns weekly status summary delivery to Abbie |
| code-review-cycle | All sprints | parallel — tracks review turnaround, flags reviews that breach 4-hour SLA |

## Inputs (what this agent needs to start)
- `docs/4-deliverables.md` — approved deliverables list (scope baseline)
- Contracts for all 18 agents (in `.claude/.agents/contracts/`) — to extract dependencies and blockers
- Sprint deliverables documents (in `docs/sprints/`) — to track progress per sprint
- Status updates from each agent as their work completes

## Outputs (what this agent delivers)
- **Daily Blocker Report** (to Abbie): one-paragraph summary — what's blocked, why, what's needed to unblock, and who owns it
- **Sprint Status Dashboard** (in `docs/sprints/sprint-[N]-status.md`): checklist of sprint deliverables with current status (NOT STARTED / IN PROGRESS / BLOCKED / COMPLETE)
- **Risk Register** (in `docs/risk-register.md`): maintained and updated every sprint:
  - WABA provisioning (HIGH — 2-6 week timeline; must start Meta application at project launch)
  - Email deliverability warmup (MEDIUM — 4-6 weeks before full volume; warmup must start Day 1)
  - PDPA compliance gap (MEDIUM — outreach cannot begin until legal-advisor + compliance-auditor sign off)
  - Google Maps API cost overrun (LOW — capped queries per run; monitor via billing dashboard)
  - Hotel logo delivery from Dozen (MEDIUM — /clients page and logo wall blocked without 30+ logos)
- **Approval Gate Tracking:** Monitors status of `docs/4-deliverables.md` (Gate 1) and each `docs/sprints/sprint-[N]-deliverables.md` (Gate 2) — flags immediately if any execution begins before APPROVED status
- **WABA Dependency Escalation:** Proactively tracks Meta WABA application status from Day 1; escalates to Abbie if no confirmation within 1 week of submission

## Handoffs (who receives the output)
- Downstream: Abbie — receives daily blocker reports and sprint status dashboards
- Downstream: All agents — receive task assignments when their dependencies are unblocked
- Expected acknowledgement: Abbie reviews blocker reports; agents confirm task receipts

## Tools / MCPs this agent uses
- Read (for contract files, sprint deliverables, status docs)
- Write (for status dashboards, risk register)
- Model: **Haiku** (status tracking and coordination is low-complexity, high-volume)

## Success criteria (how output is judged)
- Zero surprises: no blocker reaches Abbie's attention later than 24 hours after it emerges
- WABA application submitted within first 3 days of project launch (before any other Phase 2 work begins)
- Email warmup schedule started Week 1, tracked daily
- All approval gates respected: no sprint begins without APPROVED status on sprint deliverables doc
- Review SLA: code-reviewer breach of 4-hour turnaround flagged same day
- Reviewer: Abbie reviews sprint status and risk register weekly

## Improvement loop
- Who gives feedback: Abbie (dashboard format, frequency) + agents (dependency accuracy)
- When: after each sprint close
- What happens: update risk register; adjust reporting format if Abbie requests; add new risks discovered

## Escalation triggers
- Any sprint deliverable slips by more than 3 days without a plan → escalate to Abbie with options
- WABA provisioning not started within first week of project launch → escalate to Abbie immediately
- Two or more agents blocked simultaneously on the same dependency → escalate to Abbie as project-level risk
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: approved docs/4-deliverables.md (Gate 1 cleared)
- Tool/MCP status: no external MCPs required

## Open questions at hire time
- Daily blocker report delivery format: ✅ FINALIZED — Written to `docs/status/daily-[YYYY-MM-DD].md` in project repo. Abbie reads these at session start. project-manager creates a new file per day during active sprints; skips days with no blockers.
- Sprint cadence: 1-week or 2-week sprints? — [to be finalized with Abbie]
