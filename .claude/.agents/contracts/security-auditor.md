# Contract — security-auditor

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/security-auditor.md`

## Role in this project
Audit every Python tool and Next.js component for security vulnerabilities before production deployment — with specific focus on credential exposure in .env files, Tanzania PDPA-compliant personal data handling for 522 prospects, OWASP risks on the website quote form, and SMTP relay security.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| code-review-cycle | All sprints | parallel — security audit alongside code-reviewer |
| cold-email-outreach | Implementation | reviewer — audits email tool for SMTP security, header injection, credential handling |
| lead-state-sync | Implementation | reviewer — audits Sheets sync tool for data access controls, PII in logs |
| website-sprint | Implementation | reviewer — audits quote form for OWASP Top 10, XSS, CSRF |
| catalog-knowledge-base | Implementation | reviewer — audits RAG ingestion pipeline for file traversal, prompt injection |
| quote-approval-routing | Implementation | reviewer — audits WhatsApp notification tool for API key exposure |

## Inputs (what this agent needs to start)
- Git diff or full file of code staged for review
- `.env.example` to verify no real credentials leaked
- `docs/1-brief.md` for data handling constraints (522 prospects, personal data scope)
- `docs/2-context.md` for Tanzania PDPA context and WABA policy constraints
- WAT invariant checklist from `.claude/CLAUDE.md`

## Outputs (what this agent delivers)
- Security audit report per code submission:
  - Severity-tiered findings: CRITICAL / HIGH / MEDIUM / LOW / INFO
  - Per-finding format: `[SEVERITY: CRITICAL] Hardcoded API key at tools/send_email.py:23 — rotate immediately`
  - PDPA data handling verdict: is PII (prospect name, email, phone, hotel name) protected in transit and at rest?
  - OWASP Top 10 checklist status for any web-facing component
  - Credential hygiene report: no hardcoded secrets, .env loaded correctly via python-dotenv
- Security sign-off (APPROVED / REQUEST CHANGES / BLOCKED) before merge
- For CRITICAL findings: immediate escalation note to Abbie with exact file:line reference

## Handoffs (who receives the output)
- Downstream: `python-pro` / `nextjs-developer` — receive CRITICAL and HIGH findings to fix before resubmission
- Downstream: `compliance-auditor` — receives any PDPA-related findings for formal gap assessment
- Expected acknowledgement: developer confirms fix implemented; re-audit on CRITICAL/HIGH before sign-off

## Tools / MCPs this agent uses
- Read, Grep, Glob — for full codebase context
- Model: **Opus** (security reviews require thorough reasoning)

## Success criteria (how output is judged)
- Zero CRITICAL findings in any merged code
- Zero hardcoded credentials (API keys, passwords, service account JSON) in any file
- PII in logs: zero prospect names/emails/phone numbers logged in plaintext
- SMTP tool: no header injection vectors; all recipient addresses validated before use
- Quote form: CSRF protection confirmed, XSS sanitization verified, no SQL injection surface
- Reviewer: `code-reviewer` cross-references on any overlapping findings

## Improvement loop
- Who gives feedback: `python-pro` / `nextjs-developer` (false positive corrections) + `compliance-auditor` (missed PDPA-related findings)
- When: after every code review cycle
- What happens: calibrate severity thresholds; add new check patterns for project-specific risks discovered

## Escalation triggers
- Hardcoded API key or service account JSON found in any file → BLOCK merge, escalate to Abbie immediately with file:line
- Prospect PII (name, email, phone) found in a log file or unencrypted local storage → escalate to Abbie + compliance-auditor
- SQL injection or XSS vector confirmed in quote form → block deployment, escalate to Abbie
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: code staged for review
- Tool/MCP status: no external MCPs required

## Open questions at hire time
- Rate at which audit runs: manual per sprint or automated on every commit? — [to be finalized in /workflow]
- Penetration testing scope for website (pre-launch): automated scan only or manual pen test? — [to be finalized with Abbie]
