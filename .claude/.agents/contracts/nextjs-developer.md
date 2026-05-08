# Contract — nextjs-developer

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/nextjs-developer.md`

## Role in this project
Build the brand-new dozensupplies.com website from scratch — company story, "Trusted by Elites" logo wall (30+ hotels), interactive product catalog, and request-a-quote flow that routes to the Dozen AI agent; mobile-first, SEO-optimized.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| website-sprint | Implementation | lead — full Next.js application build |
| catalog-knowledge-base | Implementation | parallel — builds website catalog display that queries RAG |
| code-review-cycle | Implementation | parallel — implements fixes from code-reviewer |

## Inputs (what this agent needs to start)
- Design system and component specs from `ui-designer`
- Website copy from `/copy` skill
- Product catalog data (structured markdown from `technical-writer`)
- 30+ client hotel logos (from Dozen — to be provided)
- Quote flow routing spec from `alireza-agent-designer` (how form submission connects to AI agent)

## Outputs (what this agent delivers)
- Next.js 14+ App Router application in `website/` directory
- Pages:
  - `/` — Hero + company story + CTA
  - `/products` — Interactive catalog with category filter (towels, bed linen, bedding, F&B, bathrobes, slippers, kitchen)
  - `/products/[category]` — Product line detail with specs, sizes, colors, weights, photos
  - `/clients` — "Trusted by Elites" logo wall (30+ hotel logos)
  - `/about` — Company story, Egyptian origin, Zanzibar presence
  - `/quote` — Request-a-quote flow
- Mobile-first responsive design
- Core Web Vitals > 90 (Lighthouse)
- SEO: Metadata API, sitemap, structured data, Open Graph

## Handoffs (who receives the output)
- Downstream: `code-reviewer` — code review before merge
- Downstream: `qa-expert` — QA testing including mobile
- Downstream: `security-auditor` — security review of quote form
- Expected acknowledgement: all three reviewers pass; Lighthouse score verified

## Tools / MCPs this agent uses
- Next.js 14+ App Router, TypeScript strict mode
- Tailwind CSS (per ui-designer specs)
- Vercel deployment (likely)
- Image optimization for product photos + hotel logos
- /senior-frontend skill for optimization patterns
- /webapp-testing skill for QA

## Success criteria (how output is judged)
- Lighthouse score > 90 on all four categories (performance, accessibility, best practices, SEO)
- Mobile-first: all pages render correctly on iPhone 14 and Samsung Galaxy S23
- Quote flow: form submission triggers correct routing to AI agent (not dead-end static form)
- Logo wall: all 30+ hotel logos display without layout break
- Catalog: all product lines, sizes, colors, weights, and indicative prices displayed correctly
- No broken links, no 404s on any page
- Reviewer: `code-reviewer` + `security-auditor` (quote form) + `qa-expert` (full site QA)

## Improvement loop
- Who gives feedback: Abbie (design/content review) + Dozen owner (factual accuracy of about page, product specs)
- When: after initial build (sprint close), then after each content update
- What happens: iterate on Abbie/Dozen feedback before launch

## Escalation triggers
- If quote flow requires complex real-time Claude integration that adds > 1 week to timeline → simplify to email-routing first, upgrade later
- If Dozen doesn't provide hotel logos → use placeholder approach, flag as blocking for launch
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: ui-designer completing design system, `/copy` skill producing website copy, hotel logos provided by Dozen
- Tool/MCP status: no external MCPs needed for website build itself

## Open questions at hire time
- Hosting: Vercel (recommended) vs self-hosted? — [to be finalized in /workflow]
- Domain: www.dozensupplies.com — DNS migration timing vs launch — [coordinate with Dozen]
- CMS for catalog updates: static (update on every catalog change) vs headless CMS (Contentful, Sanity) for Dozen to manage? — [to be finalized in /workflow]
