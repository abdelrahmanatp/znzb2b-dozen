# Contract — alireza-senior-prompt-engineer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/alireza-senior-prompt-engineer.md`

## Role in this project
Write all Claude prompts powering the Dozen AI sales agent — the warm, consultative B2B hospitality persona for email outreach, inbound inquiry handling, product recommendations, and quote escalation scripts.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| cold-email-outreach | Strategy | lead — writes email persona prompts and personalization instructions |
| inbound-email-response | Implementation | lead — writes inbound handler prompt (catalog Q&A, pricing escalation trigger) |
| quote-approval-routing | Implementation | lead — writes auto-hold response prompt and escalation message |
| catalog-knowledge-base | Implementation | parallel — writes RAG query prompts optimized for catalog retrieval |
| campaign-performance-report | Ongoing | parallel — iterate prompts based on reply rate data |

## Inputs (what this agent needs to start)
- Architecture Decision Documents from `alireza-agent-designer` — agent role specs
- Product catalog structured data from `data-engineer` — for few-shot examples
- `docs/2-context.md` — brand voice context (warm, consultative, B2B hospitality)
- Email sequence strategy from `alireza-cold-email`

## Outputs (what this agent delivers)
- Prompt files in `prompts/` directory, versioned semantically
- AI persona definition document: tone of voice brief (warm, consultative B2B hotel supplies, not transactional)
- Few-shot examples for each prompt type (cold outreach, inbound Q&A, quote escalation)
- Evaluation test cases for each prompt (input → expected output)

## Handoffs (who receives the output)
- Downstream agent: `python-pro` — receives prompt files to integrate into Python tools
- Downstream agent: `alireza-rag-architect` — receives RAG query prompt for catalog retrieval
- Expected acknowledgement: python-pro confirms prompt integration; rag-architect confirms retrieval quality improves with prompt

## Tools / MCPs this agent uses
- `scripts/prompt_optimizer.py` — token analysis and clarity scoring
- `scripts/rag_evaluator.py` — RAG prompt quality evaluation
- `scripts/agent_orchestrator.py` — agent workflow validation
- Read, Write for prompt files

## Success criteria (how output is judged)
- AI persona: warm, consultative, never sounds like a sales bot; passes "peer test" (would a smart colleague send this?)
- Outreach prompts: personalization connects to prospect's property type and likely product needs (not generic)
- Inbound prompt: correctly identifies pricing questions and triggers escalation to quote approval flow
- All prompts: version ≥ 1.0.0, eval score ≥ 85% on test case set before production
- Reviewer: `code-reviewer` validates WAT invariant compliance; Abbie approves persona brief

## Improvement loop
- Who gives feedback: `data-analyst` (reply rate data) + Abbie (qualitative tone review)
- When: after first 50 emails sent (data-driven iteration) + after any reply that feels "off"
- What happens: run Mode 3 iteration (analyze performance data → diagnose issue → rewrite underperforming element → A/B test new variant)

## Escalation triggers
- If reply rate drops below 5% after 100 sends → pause campaign, escalate to Abbie with diagnosis
- If inbound prompt triggers escalation incorrectly (false positives on pricing flag) → fix before next send
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: architecture role specs from `alireza-agent-designer`
- Tool/MCP status: no external MCPs — prompt files stored locally

## Open questions at hire time
- Language: all prompts English only for Phase 1? Arabic/Swahili variants deferred to later? — [to be finalized in /workflow]
- Persona name: does the Dozen AI agent have a name ("Dozen AI", "Zara from Dozen", etc.)? — [confirm with Dozen owner before writing]
