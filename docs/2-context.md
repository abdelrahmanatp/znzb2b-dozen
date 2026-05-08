# Project Context

**Status:** FINALIZED
**Created:** 2026-05-07
**Updated:** 2026-05-07

## Stakeholders
| Name/Role | Decision power |
|-----------|---------------|
| Abbie (us — co-founder/operator) | Project owner, full authority |
| Dozen Hotel Supplies — Owner | Quote approver #1; final business decisions |
| Dozen Hotel Supplies — Sales Manager | Quote approver #2; day-to-day sales ops |
| Hotel procurement managers (prospects) | End-users of the AI agent |

## The Business — Dozen Hotel Supplies

**What they are:** Egyptian hotel supplies company operating from Zanzibar, Tanzania. B2B only.

**Contact:**
- Phone/WhatsApp: +255 772 502 076 / +255 773 808 718
- Email: info@dozensupplies.com
- Instagram: @dozen.supplies_zanzibar
- Address: 303 Silversand, Kibweni P.O. Box 4212 Zanzibar, Tanzania
- Existing website: www.dozensupplies.com (being replaced)

**Product catalog (fully documented in _context/ PDFs):**
- **Towels:** 100% Egyptian cotton — face (30–33cm), hand (50*70/100), bath (70*140/75*150/90*180), bath mat (50*70), pool (100*200), beach (90*180/100*200/75*150). Multiple colors/GSM. Full set collections: "Bianca" ($16.50), "Seville" ($21.00), grey set ($15.75). Custom embroidery/logo available.
- **Bed linen:** 100% cotton (300/400/500 TC) + Poly Cotton (200/250/300 TC). Bed sheets, pillow cases, duvet covers. Full customization.
- **Bedding comfort:** Pillows (150TC poly cotton, virgin microfiber filling, 800–1400g), duvet inserts (200TC poly cotton, 150–250 GSM), mattress toppers (on request), pillow protectors, mattress protectors (3 types).
- **Cushions:** 45*45cm, case-only ($7.50) or case+pillow ($10.50). Full customization.
- **F&B linen:** Tablecloths (square 190*190 $18, round 230/320 diameter $21.75/$31, chair covers $7). Napkins (6 variants, $1.50–$2.50). Full customization.
- **Bathrobes & Slippers:** Terry/waffle/velour, M–XXL ($21–$22). Slippers OSFA ($1.10–$1.50).
- **Kitchen & sanitation:** Kitchen/chef/glass cloth/microfiber duster (priced per dozen).
- **Expanding (not yet priced):** Kitchen equipment, laundry equipment, stainless steel, cutlery, plates, uniforms, amenities, curtains, accessories.

**Key supply partnerships:**
- Garrana Group (Egypt) — kitchen/bakery/laundry equipment
- Alazima & Hedjet (Egypt/USA) — textiles (since 1995)
- The Tailor Uniform (Egypt) — uniforms (since 2015)

**Existing clients (30+):** TUI Blue, LUX*, Nungwi Beach Resort, Neptune Hotels, The One Resort, Zanzibar Palace Hotel, Kilindi, Gold Zanzibar, Diamonds Mapenzi Beach, Pongwe Bay (5★), Hotel Verde (5★), Kisiwa, Zuri, Blue Moon, The Rock, Pongwe Bay, Tulia, Hidden Valley Lodge, Zanzibar White Sand, Palumbo, and more.

## The Lead Pipeline

**File:** `Zanzibar Prospects - Consolidated.xlsx`

**Sheets:**
- `All Prospects` — 522 rows, 14 columns
- `Priority Leads` — 462 rows (subset)
- `Category Summary` — 68 category/subcategory breakdowns

**Columns:** No. | Category | Subcategory | Company Name | Trading Name | Location | Region | Contact Person | Position | Phone | Email | Website | Source | Org Type (Raw)

**Categories include:** Hotels (115), Boutique Hotels (48), Villas (46), Resorts (40), Lodges (27), Apartments (23), Bungalows (18), Guesthouses (15), Beach Hotels (13), + more

**Sources:** 2024, 2025, "2024 & 2025" — indicates when the lead was collected

**Note:** None of these leads have been contacted by the AI system yet. This is the activation starting point.

## Prior work
- WAT CLAUDE.md is authored and defines mandatory framework architecture
- brief.md was written as initial client brief before this session
- Full PDF catalog read and cataloged — all product/pricing data available
- `/start` written `docs/1-brief.md` and `docs/2-context.md` (now validated)

## Domain rules
1. **Pricing is a floor, not a ceiling.** Catalog prices are list prices before VAT. Hotels routinely receive volume discounts and custom deals. AI must present prices as indicative and escalate final quote approval to owner + sales manager.
2. **VAT not included** in any listed price — must be stated clearly in all client-facing outputs.
3. **B2B hospitality sales cycle:** Bulk purchases, relationship-driven, custom arrangements are the norm. AI must be warm and consultative, not robotic.
4. **Zanzibar/Tanzania context:** WhatsApp is the primary business communication channel. English is the language of B2B hotel trade.
5. **Customization is a key selling point.** Embroidery, logo imposition, custom sizes/colors available across most lines — must be surfaced prominently.
6. **WAT architecture invariant:** No agent handles execution directly. Tools (Python scripts) do all deterministic work. Agents orchestrate.
7. **WABA compliance:** WhatsApp Business API messages must comply with Meta's messaging policies — template messages for outbound, free-form for inbound within 24h window.
8. **LinkedIn prospecting:** Must use compliant methods (API, Sales Navigator, enrichment tools) — no raw scraping.

## Assumptions (confirmed in /validator)
- The xlsx lead file will be migrated to Google Sheets as the live operational database
- "Request a quote" on the website routes to the AI agent, not a static form
- Quote-approvers (owner + sales manager) are reachable via WhatsApp for approval pings
- LinkedIn prospecting uses a compliant method

## Resolved in /validator 2026-05-07
1. Lead sheets = xlsx, 522 prospects, 14 columns, segmented by category/subcategory/region
2. Communication channels = WhatsApp Business API + web chat + email (all three)
3. Website = brand new build from scratch
4. Success metric = first orders placed via AI-initiated or AI-assisted interactions
5. Prospecting scope = work existing 522 + find new via Google Maps API + LinkedIn + web search
6. Email = existing (info@dozensupplies.com); WABA = not yet set up, to be provisioned
7. Website sections = catalog + company story + client logo wall + interactive request-a-quote
8. Budget = open
9. Quote approval = owner + sales manager (2 people)
10. Timeline = ASAP, no hard deadline

## Open questions (for /sparring)
1. Which LinkedIn method specifically — Sales Navigator, Apollo.io, Hunter.io, or another enrichment tool?
2. Which BSP (Business Solution Provider) for WABA — Twilio, 360dialog, Meta direct, or other?
3. Which web chat widget platform — Tidio, Crisp, custom-built, or embedded agent?
4. What email service/ESP is in use — Gmail/Google Workspace, or a dedicated ESP?
5. What website platform/stack — per `/website-builder-setup` skill output
