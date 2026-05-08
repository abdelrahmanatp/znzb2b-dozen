# Contract — technical-writer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/technical-writer.md`

## Role in this project
Produce two distinct documentation outputs: WAT Workflow SOPs in `workflows/` (for orchestrator Claude and future project Claudes) and the Dozen Team Ops Manual (for non-technical hotel supplies operators who will run the campaign day-to-day).

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| catalog-knowledge-base | Implementation | lead — structures product catalog data into markdown for RAG ingestion |
| cold-email-outreach | Implementation | parallel — documents email sequence SOP and campaign runbook |
| lead-state-sync | Implementation | parallel — documents Sheets schema and sync tool usage for operators |
| website-sprint | Implementation | parallel — documents website content update process for Dozen team |
| code-review-cycle | All sprints | parallel — writes code-level documentation (tool docstrings, API docs) |

## Inputs (what this agent needs to start)
- Product catalog PDFs from Dozen (towels, bed linen, bedding, F&B, bathrobes, slippers, kitchen) — to structure for RAG
- Python tool implementations from `python-pro` — to document as operator runbooks
- Workflow SOPs from `/workflow` skill — to write final human-readable versions
- Website pages from `nextjs-developer` — to write content update documentation

## Outputs (what this agent delivers)
- **Product Catalog Markdown Files** (in `docs/catalog/`):
  - One file per category: `towels.md`, `bed-linen.md`, `bedding.md`, `fb-supplies.md`, `bathrobes.md`, `slippers.md`, `kitchen-sanitation.md`
  - Each file: product names, GSM weights, sizes, color options, MOQ, indicative price ranges — structured for RAG chunking
  - Format: consistent heading structure, table format for specs, no ambiguous abbreviations
- **WAT Workflow SOPs** (in `workflows/`):
  - One SOP per task type (10 task types) — trigger conditions, step-by-step agent orchestration, tool invocation commands, handoff criteria, escalation paths
  - Written for orchestrator Claude: precise, unambiguous, structured
- **Dozen Team Ops Manual** (in `docs/ops-manual/`):
  - Non-technical audience: hotel supplies operators, not developers
  - Sections: "How to run a new prospect discovery", "How to check campaign status", "How to approve a quote", "How to add a new client logo to the website"
  - Plain English, screenshots or CLI commands in copyable blocks, escalation contacts
- **Tool Docstrings:** All Python tools in `tools/` have clear docstrings explaining purpose, inputs, outputs, and .env requirements

## Handoffs (who receives the output)
- Downstream: `alireza-rag-architect` — receives structured catalog markdown for ingestion pipeline
- Downstream: Abbie — receives WAT Workflow SOPs for review before /workflow finalizes
- Downstream: Dozen owner + team — receives Ops Manual
- Expected acknowledgement: rag-architect confirms catalog markdown chunking-ready; Abbie approves SOP structure before /workflow finalizes

## Tools / MCPs this agent uses
- Read (for source materials — PDFs, Python files, workflow drafts)
- Write (for all documentation output)
- Model: **Haiku** (documentation production is high-volume, low-complexity reasoning)

## Success criteria (how output is judged)
- Catalog markdown: `alireza-rag-architect` confirms files are ingestion-ready without reformatting
- WAT SOPs: each SOP specifies exactly which tool/agent to invoke, with what arguments, in what order — no ambiguity
- Ops Manual: a non-technical operator can run a weekly discovery cycle and check campaign status without asking for help
- Docstrings: every function in `tools/` has purpose, args, returns documented
- Reviewer: Abbie reviews Ops Manual for Dozen team readiness; alireza-agent-designer reviews WAT SOPs for orchestration correctness

## Improvement loop
- Who gives feedback: `alireza-rag-architect` (catalog format feedback) + Abbie (SOP gaps) + Dozen owner (Ops Manual usability)
- When: after first sprint deliverable; whenever a new tool or workflow is added
- What happens: update relevant doc; add new runbook section; re-chunk catalog if format changes

## Escalation triggers
- Product catalog PDFs are not provided by Dozen → flag to Abbie; cannot produce catalog markdown or populate /products pages without source material
- WAT SOP cannot be written because workflow is ambiguous → escalate to `alireza-agent-designer` for architecture clarification
- Escalation target: Abbie

## Dependencies
- Agent cannot start on catalog markdown without: product catalog PDFs from Dozen
- Agent cannot start on WAT SOPs without: /workflow skill has run and produced workflow drafts
- Tool/MCP status: no external MCPs required

## Open questions at hire time
- Catalog update frequency: how often does Dozen update pricing or add products? Will catalog markdown need version control? — [to be finalized with Dozen owner]
- Ops Manual format: delivered as PDF, Notion, or markdown in repo? — [to be finalized with Abbie]
