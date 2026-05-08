# Project Brief

**Status:** FINALIZED
**Created:** 2026-05-07
**Validated:** 2026-05-07

## What
A full WAT-framework AI system for Dozen Hotel Supplies with two parallel tracks: (1) a brand-new interactive website with company profile, full product catalog, and a request-a-quote flow, and (2) a multi-channel AI sales agent that works the existing 522-prospect pipeline and actively finds new leads via Google Maps API, LinkedIn, and web search — communicating via WhatsApp Business API, web chat, and email to drive first orders.

## Why
Dozen's B2B pipeline is entirely human-dependent. 522 qualified hospitality prospects sit dormant in a spreadsheet. AI activates that pipeline, handles inbound inquiries, and scales prospecting without adding headcount.

## Who
**Client:** Dozen Hotel Supplies — Egyptian-origin company, based in Zanzibar, Tanzania (303 Silversand, Kibweni). Purely B2B — hotels, resorts, restaurants, lodges, boutiques, villas.

**End users of the AI system:**
- Dozen's owner + sales manager (quote approvers, lead reviewers)
- Prospective hotel clients (interact with the agent via WhatsApp, web chat, or email)
- Existing hotel clients (repeat inquiries, new orders)

**Target prospects:** 522 already in the pipeline (xlsx). Additional new leads via Google Maps API, LinkedIn, and web search. Geography: Zanzibar-first, expanding outward.

## Success (target)
A hotel from the 522-prospect list (or a newly found one) places a first order with Dozen as a direct result of an AI-initiated or AI-assisted interaction.

## Constraints
- **WAT architecture is mandatory:** Workflows (markdown SOPs) → Agents (Claude) → Tools (Python scripts). No exceptions.
- **Python stack:** requirements.txt, venv, credentials in `.env`, deliverables to cloud (Google Sheets/Drive)
- **Pricing is indicative only:** All custom quotes require human approval — owner + sales manager must sign off before a quote is sent to a prospect
- **WABA does not yet exist:** WhatsApp Business API account must be provisioned as part of the build
- **Email is live:** Dozen has an existing email account (info@dozensupplies.com)
- **WhatsApp number exists:** +255 772 502 076 (and +255 773 808 718) — to be registered with WABA
- **LinkedIn prospecting:** Must use a compliant approach (API, Sales Navigator, or enrichment tools — not raw scraping)
- **Open budget:** No ceiling
- **Timeline:** ASAP — no hard deadline

## Current state
- 522 prospects in `Zanzibar Prospects - Consolidated.xlsx` (14 columns: No., Category, Subcategory, Company Name, Trading Name, Location, Region, Contact Person, Position, Phone, Email, Website, Source, Org Type) across 68+ accommodation subcategories (hotels, resorts, boutiques, villas, lodges, apartments, guesthouses, etc.)
- Full product catalog documented in PDFs: towels, bed linen, bedding, F&B linen, bathrobes, slippers, kitchen & sanitation
- Existing website at www.dozensupplies.com — being replaced entirely
- No AI system, no outreach automation, no WABA

## Target state
- **Website (scratch):** Company story, 30+ client logo wall, full interactive product catalog, request-a-quote flow that routes to the AI agent
- **AI prospecting agent:** Finds new hotel prospects via Google Maps API, LinkedIn, and web search; enriches and appends to lead sheet
- **AI sales agent:** Reaches out to the 522 + new leads via WhatsApp, web chat, and email; handles inbound inquiries; presents catalog; facilitates pricing conversations; pings owner + sales manager for quote approval
- **Lead sheet:** Synced live (xlsx migrated to Google Sheets or equivalent cloud store)
- **All communication logged** and accessible to Dozen's team

## Key assumptions (confirmed)
- The xlsx lead file migrates to Google Sheets as the live operational database
- "Request a quote" on the website routes to the AI agent, not a static form
- The two quote-approvers are reachable via WhatsApp for approval pings
- LinkedIn prospecting uses a compliant method (not raw scraping)

---

## Validation Record

**Validated:** 2026-05-07
**Confidence at close:** 95%
**Rounds:** 3

**Questions resolved this session:**
1. Lead sheets = xlsx file (`Zanzibar Prospects - Consolidated.xlsx`), 522 prospects, 14 columns, already segmented by category/subcategory/region
2. Communication channels = WhatsApp Business API + web chat + email (all three)
3. Website = brand new build from scratch (not enhancing existing site)
4. Success metric = first orders placed via AI-initiated or AI-assisted interactions
5. Prospecting scope = work existing 522 + find new via Google Maps API + LinkedIn + web search
6. Email = existing (info@dozensupplies.com); WABA = not yet set up, to be provisioned
7. Website sections = catalog + company story + client logo wall + interactive request-a-quote
8. Budget = open
9. Quote approval = owner + sales manager (2 people)
10. Timeline = ASAP, no hard deadline

---

## Sparring Review — 2026-05-07

**Verdict: GO WITH CONDITIONS**

### Blockers 🔴
- **WABA cold outreach violates Meta policy.** Sending unsolicited marketing messages via WhatsApp Business API to the 522 prospects will get the account suspended. Cold outreach must go via email; WABA handles warm/inbound conversations only.
- **No conversation state management defined.** Without a system tracking which prospects were contacted, on which channel, with what result, the multi-channel agent becomes unmanageable within days of launch.
- **WABA provisioning is a 2–6 week hard dependency that hasn't started.** Must be initiated immediately or WhatsApp won't be available at launch.

### Major Concerns 🟡
- LinkedIn is likely the wrong prospecting channel for the Zanzibar hotel market — low penetration, low ROI. Validate before building.
- Email deliverability requires SPF/DKIM/DMARC setup + dedicated sending domain + warming before any campaign runs.
- Quote approval has no SLA or fallback — an hours-long delay kills conversions. Needs auto-response + defined max response time.
- "Interactive catalog" is underspecified — must be defined before the website sprint begins.
- No AI persona or brand voice defined — required before any outreach goes live.
- Tanzania PDPA compliance not addressed — legal basis for outreach needed.
- Scope is 6+ systems — must be phased, not built simultaneously.

### Minor Notes 🟢
- Google Maps API costs need monitoring at prospecting scale.
- Arabic/Swahili language support undefined.
- Dozen team needs an ops interface (approval queue, lead dashboard) — not yet planned.

### Conditions to Reach FINALIZED
1. Redesign WhatsApp outreach: cold outreach via email only; WABA for warm/inbound only
2. Define conversation state management as a first-class architectural component
3. Phase the build: Phase 1 = website + email outreach; Phase 2 = WABA + web chat
