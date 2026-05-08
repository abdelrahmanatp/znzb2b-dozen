---
name: "senior-prompt-engineer"
description: "Use when the user asks to optimize prompts, design prompt templates, evaluate LLM outputs, build agentic systems, or design AI workflows."
merged-from: prompt-engineer (2026-05-07)
---

# Senior Prompt Engineer

Prompt engineering patterns, LLM evaluation frameworks, and agentic system design.

## Tools Overview

### 1. Prompt Optimizer
Analyzes prompts for token efficiency, clarity, and structure. Generates optimized versions.

```bash
python scripts/prompt_optimizer.py prompt.txt --analyze
python scripts/prompt_optimizer.py prompt.txt --optimize --output optimized.txt
python scripts/prompt_optimizer.py prompt.txt --tokens --model gpt-4
```

### 2. RAG Evaluator
Evaluates RAG quality by measuring context relevance and answer faithfulness.

```bash
python scripts/rag_evaluator.py --contexts retrieved.json --questions eval_set.json
```

### 3. Agent Orchestrator
Parses agent definitions and visualizes execution flows. Validates tool configurations.

```bash
python scripts/agent_orchestrator.py agent.yaml --validate
python scripts/agent_orchestrator.py agent.yaml --visualize
```

## Prompt Engineering Workflows

### Prompt Optimization Workflow
1. Baseline current prompt
2. Identify issues (ambiguous output, verbosity, missing constraints)
3. Apply optimization patterns
4. Generate optimized version
5. Compare results
6. Validate with test cases

### Few-Shot Example Design
- Select diverse examples (3-5 recommended)
- Format consistently
- Include simple, edge, complex, negative cases

### Structured Output Design
- Define schema
- Include schema in prompt
- Add format enforcement
- Validate outputs

## Common Patterns Quick Reference

| Pattern | When to Use |
|---------|-------------|
| Zero-shot | Simple, well-defined tasks |
| Few-shot | Complex tasks, consistent format needed |
| Chain-of-Thought | Reasoning, math, multi-step logic |
| Role Prompting | Expertise needed, specific perspective |
| Structured Output | Need parseable JSON/XML |

## Reference Documentation

| File | Contains |
|------|----------|
| `references/prompt_engineering_patterns.md` | 10 prompt patterns with examples |
| `references/llm_evaluation_frameworks.md` | Evaluation metrics, scoring, A/B testing |
| `references/agentic_system_design.md` | Agent architectures (ReAct, Plan-Execute) |

---

## Delta Capabilities — Merged from prompt-engineer (2026-05-07)

The following capabilities were extracted from the prompt-engineer agent:

- **A/B Testing Framework for Prompts:** Side-by-side prompt variant testing — define test cases, run both variants against identical inputs, compare outputs on faithfulness/relevance/tone metrics, statistical significance check before promoting winner. Script: `scripts/prompt_ab_test.py --variant-a v1.txt --variant-b v2.txt --test-set cases.json`
- **Multi-Model Routing Strategy:** Route different prompt types to appropriate models — Haiku for classification/labeling tasks, Sonnet for implementation/generation, Opus for architecture decisions/root-cause analysis. Defines routing rules and fallback chains.
- **Production Prompt Management Workflows:** Version-controlled prompt files in `prompts/` directory, semantic versioning (major = breaking change to output format, minor = improvement, patch = wording fix), promotion gates: dev → staging (requires eval score ≥ 85%) → prod (requires staging eval score ≥ 90% over 100 test cases).
