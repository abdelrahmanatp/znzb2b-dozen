# Contract — lead-research-assistant

**Hired:** 2026-05-07
**Source:** library
**Source file:** `.claude/.agents/lead-research-assistant.md`

## Role in this project
Discover new hotel/resort/lodge/villa prospects in Zanzibar and Tanzania via Google Maps API and web search, enrich with contact details and property type, score by fit for Dozen's product lines, and append qualified leads to the live prospect tracker.

## Task types this agent participates in

| Task type | Phase | Position |
|-----------|-------|----------|
| prospect-discovery | Implementation | lead — search + identify + enrich new leads |
| lead-triage | Implementation | lead — score and qualify each discovered lead |
| campaign-performance-report | Ongoing | parallel — reports new leads added each week |

## Inputs (what this agent needs to start)
- Search parameters: geographic area (Zanzibar, Tanzania), property types (hotel, resort, boutique, villa, lodge, guesthouse, restaurant)
- Existing prospect list from Google Sheets (to avoid duplicating already-known prospects)
- ICP definition: B2B hospitality businesses that purchase linen, towels, F&B linen, bathrobes, slippers in bulk
- `tools/discover_prospects.py` from `python-pro` — Google Maps API search tool

## Outputs (what this agent delivers)
- Qualified prospect records matching the 14-column schema (No., Category, Subcategory, Company Name, Trading Name, Location, Region, Contact Person, Position, Phone, Email, Website, Source, Org Type)
- Fit score (1-10) per discovered prospect with reasoning
- Source notation: "Google Maps API - [search term]" or "Web search - [URL]"
- Deduplication flag: checked against existing 522 to confirm it's a new lead

## Handoffs (who receives the output)
- Downstream agent: `data-engineer` — receives validated prospect records to append to Google Sheets
- Downstream agent: `research-analyst` — receives discovery run summary for weekly report
- Expected acknowledgement: data-engineer confirms records appended without schema violations

## Tools / MCPs this agent uses
- `tools/discover_prospects.py` — Google Maps Places API search (python-pro builds this tool)
- WebSearch — for web search discovery of prospects not on Google Maps
- Read (for existing prospect list)

## Success criteria (how output is judged)
- New leads: minimum 20 qualified new prospects per weekly discovery run
- Fit score accuracy: >80% of score-8+ prospects should be genuinely relevant when reviewed by Abbie
- Deduplication: zero existing prospects re-added
- Schema compliance: all 14 columns populated (missing fields marked as "Unknown" not blank)
- Reviewer: `research-analyst` reviews discovery run quality; Abbie spot-checks 5 leads per run

## Improvement loop
- Who gives feedback: Abbie (spot-check of discovered leads quality) + `data-analyst` (conversion rate of discovered leads vs original 522)
- When: after each discovery run (weekly initially)
- What happens: adjust search terms, geographic radius, or fit scoring criteria based on feedback

## Escalation triggers
- Google Maps API quota exceeded mid-run → pause, log progress, notify Abbie
- Discovery run finds < 5 qualified leads after full search → expand search terms and retry once, then escalate
- Any discovered lead that appears to be a direct competitor of Dozen → flag but include (competitive intelligence value)
- Escalation target: Abbie

## Dependencies
- Agent cannot start without: `tools/discover_prospects.py` built and tested by `python-pro`, Google Maps API key in `.env`
- Google Sheets lead tracker live (data-engineer migrates xlsx first)
- Tool/MCP status: GOOGLE_MAPS_API_KEY ⚠️ (not yet provisioned — must set up before first run)

## Open questions at hire time
- Geographic scope: Zanzibar islands only, or mainland Tanzania (Dar es Salaam, Arusha) too? — [confirm with Dozen before first run]
- LinkedIn prospecting: which tool (Sales Navigator, Apollo.io, Hunter.io)? — deferred to Phase 2; [to be finalized in /workflow]
