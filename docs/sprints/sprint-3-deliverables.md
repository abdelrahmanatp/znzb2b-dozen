# Sprint 3 Deliverables — Interactive Quote System

**Status:** APPROVED
**Sprint:** 3
**Prepared:** 2026-05-08

---

## What We Are Building

An interactive quote submission system on dozensupplies.com that gives hotel procurement managers two structured ways to request a quote — browse the catalog and add specific items, or describe their property and let the Dozen team build the full list for them. Both paths produce structured data the Dozen team can act on immediately, and that the AI sales rep (Sprint 5) can process automatically.

---

## Deliverables

### Quote Entry — Landing Page
- [ ] The existing `/quote` page becomes a clear three-path entry point: Quick Form (existing, kept as-is), Build a Quote (catalog-based), and Configure by Rooms (property-based)
- [ ] Each path is clearly labelled with a one-line description of who it's for

### Path 1 — Quick Form (existing)
- [ ] Existing simplified quote form kept exactly as-is — no changes

### Path 2 — Build a Quote (Add-to-Quote)
- [ ] Customer browses all 7 product categories with product images and descriptions
- [ ] "Add to Quote" button on each product with a quantity selector (min 1, no max)
- [ ] Free-text notes field per item (e.g., "needs logo embroidery", "white only")
- [ ] "Request custom size" option per item — opens a text input for the customer to describe what they need (e.g., "100×150cm instead of standard, 600 GSM")
- [ ] Live quote summary panel showing all selected items, quantities, and notes
- [ ] Items can be removed or quantity-adjusted at any point before submission
- [ ] Quote state auto-saves to the server every time an item is added, removed, or changed — customer never loses their work if they close the tab

### Path 3 — Configure by Rooms
- [ ] Customer enters the number of rooms at their property
- [ ] Selects which product categories they want per room (from the existing 7 categories)
- [ ] Specifies laundry frequency (daily / every 2 days / every 3 days / weekly / custom)
- [ ] Free-text notes field for additional context ("we also need pool towels", "some rooms are suites", etc.)
- [ ] Room config auto-saves to the server as the customer fills it in

### Combined Submission (Paths 2 + 3 together)
- [ ] Customer can complete both Path 2 and Path 3 before submitting — a single submission includes both the item list and the room brief
- [ ] The submission screen clearly shows a summary of both before the customer confirms

### Quote Submission & Persistence
- [ ] On submission, customer enters their name, property name, and email address
- [ ] On-screen confirmation page shows a unique URL to view their submitted quote — bookmarkable, shareable, works without email
- [ ] The unique URL is permanent (does not expire for 12 months) and accessible from any device
- [ ] "Edit and resubmit" button on the view page — reloads the quote into the builder for changes; submitting creates a new quote with a reference to the original (original is not overwritten)

### Team Notifications
- [ ] Email notification sent to abdelrahman@znznow.com on every submission — includes customer name, property, submission type, full item list or room config, and a direct link to the Google Sheets row
- [ ] WhatsApp alert sent to the sales team via Twilio on every submission — includes customer name, property name, headline numbers (e.g., "8 items across 3 categories" or "12 rooms"), and a link to the Sheets row
- [ ] WhatsApp fallback: if Twilio/WABA is not yet active, alert is sent as an email to a second team address (does not block launch)

### Data & Storage
- [ ] All submitted quotes saved to a "Quote Submissions" tab in Google Sheets with full structured data (one row per submission, all fields captured)
- [ ] Quote drafts saved to a "Quote Drafts" tab in Google Sheets as customers build (auto-save, not just on submission)
- [ ] Sheets schema designed for AI consumption — consistent column names, no merged cells, no formulas in data columns

---

## Not Included in This Sprint

- Customer confirmation email (wired in Sprint 4 when email infrastructure is ready — the on-screen URL is the Sprint 3 substitute)
- Pricing shown to customers at any point
- User accounts, login, or authentication
- Hygiene kits or any new product categories
- AI handling or auto-responding to quote submissions (Sprint 5)
- Payment, invoicing, or formal quote document generation
- Quote status updates to customers ("your quote is being reviewed")
- Multi-language support (English only)

---

*To approve: reply "approved" or change Status to APPROVED. Sprint execution cannot begin until approved.*
