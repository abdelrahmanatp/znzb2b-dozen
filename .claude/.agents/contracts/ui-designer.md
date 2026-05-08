# Contract — ui-designer

**Hired:** 2026-05-07
**Source:** library (core-development dept)
**Source file:** `.claude/.agents/ui-designer.md`

## Role in this project
Design the visual system for the Dozen website — premium B2B hospitality aesthetic aligned with Egyptian/Zanzibar heritage, mobile-first, fully accessible (WCAG 2.1 AA); produce implementation-ready specs for nextjs-developer.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| website-sprint | Design | lead — visual design, design system, component specs |

## Inputs (what this agent needs to start)
- Brand reference: Dozen Instagram (@dozen.supplies_zanzibar) for existing visual style
- Competitor reference: TUI Blue, LUX*, Neptune Hotels websites (the clients Dozen serves — understand the aesthetic they respond to)
- Product catalog PDFs — understand what the products look like visually
- Website copy from `/copy` skill (so design accommodates actual content)
- 30+ hotel logos (from Dozen) — design logo wall layout

## Outputs (what this agent delivers)
- Design system: color palette, typography, spacing system, component tokens
- Tailwind CSS design tokens (directly usable by nextjs-developer)
- Component specs for all website sections:
  - Hero section (mobile + desktop)
  - Product catalog card + grid layout
  - Product detail page
  - "Trusted by Elites" logo wall
  - About page layout
  - Request-a-quote form
- Accessibility annotations: aria-labels, keyboard navigation, focus states
- Handoff documentation: exact Tailwind classes for all states + responsive breakpoints

## Handoffs (who receives the output)
- Downstream: `nextjs-developer` — receives full design system + component specs
- Expected acknowledgement: nextjs-developer confirms specs are implementation-ready before coding begins

## Tools / MCPs this agent uses
- Read (for brand references)
- Write (for design documentation)
- Figma MCP (`mcp__claude_ai_Figma__*`) if Figma integration needed
- /frontend-design skill for design token implementation
- /ui-design-system skill for design system structure

## Success criteria (how output is judged)
- Visual aesthetic: premium B2B hospitality feel (not consumer e-commerce, not generic SaaS)
- Mobile-first: all specs include mobile (375px) + desktop (1440px) layouts
- WCAG 2.1 AA: all text contrast ratios verified, all interactive elements keyboard-navigable
- Implementation-ready: every component includes exact Tailwind class names
- Reviewer: `nextjs-developer` reviews specs for implementation feasibility; Abbie approves visual direction before component work begins

## Improvement loop
- Who gives feedback: Abbie (visual direction) + Dozen owner (brand alignment)
- When: after initial design direction presentation, then after each major section
- What happens: iterate on feedback before handing off to nextjs-developer

## Escalation triggers
- If Dozen doesn't approve visual direction after 2 rounds of iteration → escalate to Abbie for direction decision
- If logo wall layout is impossible with the logos provided (inconsistent sizes, formats) → flag and propose normalization approach
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: Instagram/brand reference reviewed, product catalog PDFs reviewed
- Tool/MCP status: Figma MCP available (mcp__claude_ai_Figma__*) — verify connected this session

## Open questions at hire time
- Primary brand color: does Dozen have an established palette (from their Instagram aesthetic)? — [review Instagram before starting]
- Font: serif vs sans-serif? Premium Egyptian/Zanzibar hospitality context suggests serif might be appropriate — [confirm direction with Abbie]
