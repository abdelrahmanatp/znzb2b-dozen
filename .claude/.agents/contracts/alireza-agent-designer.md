# Contract — alireza-agent-designer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/alireza-agent-designer.md`

## Role in this project
Design the full WAT system architecture — agent interaction patterns, tool schemas, conversation state management, human-in-the-loop quote approval workflow, and evaluation frameworks for the Dozen AI sales system.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| catalog-knowledge-base | Design | lead — design RAG + catalog ingestion architecture |
| quote-approval-routing | Design | lead — design human-in-the-loop approval pattern |
| lead-state-sync | Design | lead — design conversation state schema and persistence |
| cold-email-outreach | Design | reviewer — validate that email pipeline conforms to WAT invariants |
| code-review-cycle | All | reviewer — WAT invariant compliance check |

## Inputs (what this agent needs to start)
- `docs/1-brief.md` — project constraints (WAT mandatory, WABA warm-only, quote approval required)
- `docs/2-context.md` — product catalog, lead pipeline, stakeholder roles
- Task type: what system component is being designed (state management, approval flow, etc.)

## Outputs (what this agent delivers)
- Architecture Decision Documents (ADDs) in `docs/architecture/` — one per major system component
- Tool schema definitions for python-pro to implement (input/output format, error codes)
- Agent communication flow diagrams (Mermaid)
- Evaluation framework specs (what metrics to track per pipeline)

## Handoffs (who receives the output)
- Downstream agent: `python-pro` — receives tool schemas to implement
- Downstream agent: `alireza-senior-prompt-engineer` — receives agent role definitions to write prompts for
- Expected acknowledgement: python-pro confirms schema is implementable; prompt-engineer confirms role spec is promptable

## Tools / MCPs this agent uses
- Read, Write (for architecture docs)
- No external MCPs — this is design work

## Success criteria (how output is judged)
- Tool schema reviewed and accepted by python-pro without modification
- WAT invariants satisfied: all tool schemas are deterministic (no Claude calls inside tools)
- Human-in-the-loop approval pattern includes: auto-response while pending, max SLA, fallback if no approval in N hours
- State schema covers all required fields: contact_status, channel, last_contacted, conversation_id, response_flag, quote_requested
- Reviewer: `code-reviewer` validates WAT compliance; `alireza-senior-prompt-engineer` validates agent role specs

## Improvement loop
- Who gives feedback: Abbie (after system architecture review)
- When: after each architecture component is designed, before implementation begins
- What happens: update ADD, re-brief python-pro with revised schema

## Escalation triggers
- If two possible architecture patterns have real tradeoffs that require a product decision → escalate to Abbie
- If a WAT invariant cannot be satisfied without breaking a required feature → escalate immediately
- Escalation target: Abbie (user)

## Dependencies
- Agent cannot start without: `docs/1-brief.md` FINALIZED (✅ done), `docs/2-context.md` VALIDATED (✅ done)
- Tool/MCP status: no external tools required

## Open questions at hire time
- Which vector DB for product catalog RAG: Chroma (dev/small scale) vs Pinecone (production) — [to be finalized in /workflow]
- Conversation state persistence: Google Sheets (simple) vs SQLite (more structured) — [to be finalized in /workflow]
