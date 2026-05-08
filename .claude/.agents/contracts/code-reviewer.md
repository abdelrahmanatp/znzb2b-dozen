# Contract — code-reviewer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/code-reviewer.md`

## Role in this project
Review all Python tools in `tools/` and Next.js components in `website/` before merge — security vulnerabilities, WAT invariant compliance, test coverage, credential handling; runs as part of the `plugin-pr-review-toolkit` bundle for all pre-merge submissions.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| code-review-cycle | All sprints | lead — primary reviewer for all code |
| cold-email-outreach | Implementation | reviewer — reviews email sending tool |
| prospect-discovery | Implementation | reviewer — reviews Google Maps tool |
| lead-state-sync | Implementation | reviewer — reviews Google Sheets sync tools |
| website-sprint | Implementation | reviewer — reviews Next.js components |
| quote-approval-routing | Implementation | reviewer — reviews WhatsApp notification tool |

## Inputs (what this agent needs to start)
- Git diff of staged changes (preferred) or full file for new files
- WAT invariant checklist from `.claude/CLAUDE.md`
- `docs/1-brief.md` for constraints (no hardcoded credentials, WAT mandatory)

## Outputs (what this agent delivers)
- Structured code review with confidence-scored findings (only surfacing ≥80 confidence)
- Findings categorized: CRITICAL (block merge) / HIGH / MEDIUM / LOW / INFO
- Per-finding format: `[CONFIDENCE: 92][CRITICAL] SQL injection risk at tools/send_email.py:47`
- WAT compliance summary: does the code respect "tools are deterministic, agents don't execute directly"?
- CLAUDE.md compliance summary: credentials in .env, no hardcoded API keys
- Approval verdict: APPROVED / REQUEST CHANGES / BLOCKED (critical issues)

## Handoffs (who receives the output)
- Downstream: `python-pro` / `nextjs-developer` — receive findings to implement fixes
- Downstream: `security-auditor` — receives critical security findings for deeper audit
- Expected acknowledgement: developer confirms fixes implemented; re-review on critical/high findings

## Tools / MCPs this agent uses
- Read, Grep, Glob — for full codebase context when needed
- Model: **Opus** (most thorough review quality)

## Success criteria (how output is judged)
- Zero CRITICAL findings in any merged code
- WAT invariants verified for every tool reviewed
- CLAUDE.md compliance: zero hardcoded credentials
- Review turnaround: < 4 hours per review request
- False positive rate: < 10% (confidence scoring prevents noise)
- Self-assessment: Abbie and python-pro agree with majority of findings on first review

## Improvement loop
- Who gives feedback: `python-pro` / `nextjs-developer` (false positive corrections) + `security-auditor` (missed findings)
- When: after every review cycle
- What happens: calibrate confidence scoring; update CLAUDE.md compliance checklist if new invariants are discovered

## Escalation triggers
- Any finding that suggests a fundamental architecture problem (not just a code issue) → escalate to `alireza-agent-designer` and Abbie
- Credential exposure discovered (hardcoded key in code) → BLOCK merge immediately, escalate to Abbie and `security-auditor`
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: code staged for review, WAT invariant list in `.claude/CLAUDE.md`
- Tool/MCP status: no external MCPs needed

## Open questions at hire time
- Review trigger: ✅ FINALIZED — Automated on every pre-merge code submission via `plugin-pr-review-toolkit` (see `workflows/code-review-cycle.md`). Never manual-only; the plugin fires both code-reviewer + security-auditor in a single parallel message.
