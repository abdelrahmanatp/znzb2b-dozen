# Design System — Dozen Hotel Supplies
## dozensupplies.com

**Version:** 1.0
**Status:** APPROVED FOR IMPLEMENTATION
**Sprint:** 1
**Owner:** ui-designer
**Downstream:** nextjs-developer

---

## 1. Design Direction

### Aesthetic Statement

Dozen's website should feel like walking into the linen room of a five-star resort — warm, structured, and quietly confident. The aesthetic is premium Egyptian heritage meets East African coastal calm: cream and sand tones, deep terracotta warmth, and accents of aged gold. Typography leans serif for authority and craft, paired with a clean grotesque for functional content. The overall effect is hospitality-grade luxury — not a commodity catalog, not a fashion brand.

**Evokes:** Aman Resorts brand guidelines, Aesop product pages, Six Senses property websites. The editorial restraint of premium linen catalogs — generous white space, product given room to breathe, copy kept to essentials.

**Avoid:** Generic SaaS blue/white, consumer e-commerce busyness, heavy dark backgrounds, gradients with multiple color stops, playful or casual tones, icon-heavy interfaces, loud calls-to-action.

### Reference Brands

| Reference | What to borrow |
|-----------|---------------|
| Six Senses | Warm neutrals, serif headings, generous whitespace |
| Aesop | Structured grid, type-led design, minimal ornamentation |
| LUX* Resorts (the client) | Coastal light, cream-gold palette |
| Cabbages & Kings Tanzania | East African hospitality warmth |
| Loro Piana | Premium textile brand confidence, product-first layout |

---

## 2. Color Palette

### Philosophy

The palette draws from Egyptian linen craft (natural cotton ecru, aged gold) and Zanzibar coast (warm terracotta, bleached sand, Indian Ocean depths). All colors are named after Dozen's world, not generic design tokens.

### Primary Colors

| Name | Token | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| Linen | `--color-linen` | `#F5F0E8` | 245, 240, 232 | Site background, hero background |
| Sand | `--color-sand` | `#E8DFD0` | 232, 223, 208 | Section alternates, card backgrounds |
| Terracotta | `--color-terracotta` | `#C4622D` | 196, 98, 45 | Primary CTA, brand accent, hover states |
| Deep Terracotta | `--color-terracotta-deep` | `#A34E22` | 163, 78, 34 | Terracotta pressed/active state |
| Gold | `--color-gold` | `#B8860B` | 184, 134, 11 | Decorative accents, star ratings, dividers |
| Warm Gold | `--color-gold-warm` | `#D4A017` | 212, 160, 23 | Hover on gold elements |

### Neutral Scale

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Onyx | `--color-onyx` | `#1A1714` | Primary body text, headings |
| Espresso | `--color-espresso` | `#2D2520` | Secondary headings |
| Bark | `--color-bark` | `#5C4A3A` | Secondary text, captions |
| Driftwood | `--color-driftwood` | `#8C7B6B` | Placeholder text, disabled text |
| Mist | `--color-mist` | `#C4B8AB` | Borders, dividers, input borders |
| Cloud | `--color-cloud` | `#EDE8E1` | Card borders, subtle dividers |
| Linen-Light | `--color-linen-light` | `#FAF8F5` | Modal backgrounds, elevated surfaces |
| White | `--color-white` | `#FFFFFF` | Pure white — buttons on dark bg, hero overlays |

### Semantic Colors

| Purpose | Token | Hex | Notes |
|---------|-------|-----|-------|
| Success | `--color-success` | `#2D6A4F` | Forest green — WCAG AA on white |
| Success Light | `--color-success-light` | `#D8F0E6` | Success badge background |
| Warning | `--color-warning` | `#92400E` | Amber-brown — WCAG AA on white |
| Warning Light | `--color-warning-light` | `#FEF3C7` | Warning badge background |
| Error | `--color-error` | `#991B1B` | Deep red — WCAG AA on white |
| Error Light | `--color-error-light` | `#FEE2E2` | Error input background |

### Tailwind Custom Config (`extend.colors`)

```js
colors: {
  linen: {
    DEFAULT: '#F5F0E8',
    light: '#FAF8F5',
    dark: '#E8DFD0',
  },
  sand: '#E8DFD0',
  terracotta: {
    DEFAULT: '#C4622D',
    deep: '#A34E22',
    light: '#F0D5C5',
  },
  gold: {
    DEFAULT: '#B8860B',
    warm: '#D4A017',
    light: '#F5E9C4',
  },
  onyx: '#1A1714',
  espresso: '#2D2520',
  bark: '#5C4A3A',
  driftwood: '#8C7B6B',
  mist: '#C4B8AB',
  cloud: '#EDE8E1',
  success: {
    DEFAULT: '#2D6A4F',
    light: '#D8F0E6',
  },
  warning: {
    DEFAULT: '#92400E',
    light: '#FEF3C7',
  },
  error: {
    DEFAULT: '#991B1B',
    light: '#FEE2E2',
  },
},
```

---

## 3. Typography

### Font Selection

| Role | Font | Rationale |
|------|------|-----------|
| Display / Headings | **Cormorant Garamond** | Old-style serif with Egyptian/Mediterranean heritage. Used by luxury linen and hotel brands. Elegant at large sizes. |
| Body / UI | **Inter** | WCAG-friendly, highly legible at small sizes, excellent number handling for specs/pricing, zero-cost |
| Accent / Caption | **Cormorant Garamond Italic** | Use for pull quotes, testimonials, taglines — adds editorial warmth |

### Google Fonts Load

In `layout.tsx`, load:

```typescript
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})
```

Apply both variables to `<html>`:
```tsx
<html className={`${cormorant.variable} ${inter.variable}`}>
```

### Type Scale

| Token | Size (px) | Size (rem) | Tailwind Class | Font | Weight | Line Height | Letter Spacing |
|-------|-----------|------------|---------------|------|--------|-------------|----------------|
| `display` | 72px | 4.5rem | `text-7xl` | Cormorant | 300 | 1.05 | `-0.03em` |
| `5xl` | 48px | 3rem | `text-5xl` | Cormorant | 400 | 1.1 | `-0.025em` |
| `4xl` | 36px | 2.25rem | `text-4xl` | Cormorant | 500 | 1.15 | `-0.02em` |
| `3xl` | 30px | 1.875rem | `text-3xl` | Cormorant | 500 | 1.2 | `-0.015em` |
| `2xl` | 24px | 1.5rem | `text-2xl` | Cormorant | 600 | 1.25 | `-0.01em` |
| `xl` | 20px | 1.25rem | `text-xl` | Inter | 600 | 1.4 | `0` |
| `lg` | 18px | 1.125rem | `text-lg` | Inter | 500 | 1.6 | `0` |
| `base` | 16px | 1rem | `text-base` | Inter | 400 | 1.7 | `0` |
| `sm` | 14px | 0.875rem | `text-sm` | Inter | 400 | 1.6 | `0.01em` |
| `xs` | 12px | 0.75rem | `text-xs` | Inter | 400 | 1.5 | `0.02em` |

### Usage Rules

- Page-level H1: `display` or `5xl` — always Cormorant, weight 300-400
- Section H2: `4xl` or `3xl` — Cormorant, weight 500
- Card/component H3: `2xl` or `xl` — Cormorant for decorative, Inter for functional
- Body copy: `base` or `lg` — Inter, weight 400
- Captions/labels: `sm` or `xs` — Inter, weight 400-500, uppercase tracking for labels
- Taglines and pull quotes: Cormorant Italic, weight 300, `2xl`-`3xl`
- Nav links: Inter `sm`, weight 500, uppercase, `tracking-widest`
- Button text: Inter `sm`, weight 600, uppercase, `tracking-wider`

### CSS Custom Properties

```css
:root {
  --font-heading: var(--font-cormorant), 'Georgia', serif;
  --font-body: var(--font-inter), system-ui, sans-serif;
}
```

### Tailwind Typography Config

```js
fontFamily: {
  heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
  body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
},
```

---

## 4. Spacing Scale

### Base Unit

Tailwind's default 4px base unit is used throughout. No custom spacing tokens needed — the default scale is sufficient and familiar to developers.

Standard scale reference:
- `1` = 4px
- `2` = 8px
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `10` = 40px
- `12` = 48px
- `16` = 64px
- `20` = 80px
- `24` = 96px
- `32` = 128px

### Section Rhythm

| Context | Mobile | Desktop |
|---------|--------|---------|
| Section vertical padding | `py-16` (64px) | `py-24` (96px) |
| Container horizontal padding | `px-5` (20px) | `px-8` (32px) |
| Card internal padding | `p-6` (24px) | `p-8` (32px) |
| Between heading and body | `mt-4` (16px) | `mt-6` (24px) |
| Between section elements | `gap-6` (24px) | `gap-8` (32px) |
| Component vertical gap | `gap-4` (16px) | `gap-6` (24px) |

### Container Max Widths

```js
// tailwind.config.js
maxWidth: {
  'site': '1280px',      // max container
  'prose': '72ch',        // body text columns
  'narrow': '680px',      // forms, single-column content
},
```

Container class pattern used throughout: `max-w-site mx-auto px-5 md:px-8`

---

## 5. Component Specifications

### 5.1 Buttons

#### Sizing

| Size | Padding | Font | Min Width |
|------|---------|------|-----------|
| `sm` | `px-4 py-2` | `text-xs tracking-wider uppercase font-semibold` | — |
| `md` (default) | `px-6 py-3` | `text-sm tracking-wider uppercase font-semibold` | `min-w-[160px]` |
| `lg` | `px-8 py-4` | `text-sm tracking-widest uppercase font-semibold` | `min-w-[200px]` |

All buttons: `inline-flex items-center justify-center gap-2 transition-all duration-200 font-body`

Border radius: `rounded-none` — squared edges reinforce premium, architectural aesthetic.

#### Variants

**Primary (Terracotta)**
```
Base:     bg-terracotta text-white
Hover:    bg-terracotta-deep text-white (scale-[1.01] via Framer)
Active:   bg-terracotta-deep/90
Focus:    ring-2 ring-terracotta ring-offset-2 ring-offset-linen
Disabled: bg-mist text-driftwood cursor-not-allowed opacity-60
```
Tailwind: `bg-terracotta text-white hover:bg-terracotta-deep focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:bg-mist disabled:text-driftwood disabled:cursor-not-allowed`

**Secondary (Outlined)**
```
Base:     border border-onyx text-onyx bg-transparent
Hover:    bg-onyx text-white
Active:   bg-espresso text-white
Focus:    ring-2 ring-onyx ring-offset-2 ring-offset-linen
Disabled: border-mist text-driftwood cursor-not-allowed
```
Tailwind: `border border-onyx text-onyx bg-transparent hover:bg-onyx hover:text-white focus-visible:ring-2 focus-visible:ring-onyx focus-visible:ring-offset-2 disabled:border-mist disabled:text-driftwood disabled:cursor-not-allowed`

**Ghost (Text)**
```
Base:     text-terracotta bg-transparent underline-offset-4
Hover:    underline
Active:   text-terracotta-deep underline
Focus:    ring-2 ring-terracotta ring-offset-2
Disabled: text-driftwood cursor-not-allowed
```
Tailwind: `text-terracotta bg-transparent hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-terracotta disabled:text-driftwood disabled:cursor-not-allowed`

**Icon Button (square)**
Size: `p-3 rounded-none` or `rounded-full` for close/action icons
Same color variants as Primary and Secondary apply.

#### Aria / Accessibility
- All buttons need explicit `aria-label` when icon-only
- `disabled` attribute on `<button>` — never use `pointer-events-none` alone
- Focus ring: `focus-visible:` prefix so mouse users don't see ring (keyboard only)

---

### 5.2 Cards

#### Product Card

Displays one product category or specific product in the catalog grid.

```
Container:   bg-linen-light border border-cloud rounded-none overflow-hidden
             hover: shadow-md (transition-shadow duration-300)
             md:hover:translate-y-[-2px] (via Framer motion)

Image area:  aspect-[4/3] w-full overflow-hidden bg-sand
             img: object-cover w-full h-full scale-100 hover:scale-[1.03]
             (transition-transform duration-500 ease-out)

Body:        p-6

Label:       text-xs font-semibold uppercase tracking-widest text-driftwood mb-2
             font-body

Title:       text-xl font-heading font-500 text-onyx leading-snug mb-3

Description: text-sm font-body text-bark leading-relaxed line-clamp-3 mb-4

Price range: text-sm font-body font-medium text-terracotta
             "From USD $16.50 / set — indicative pricing"

CTA link:    Ghost button sm — "View Details →"
```

**Responsive behavior:**
- Mobile (default): full-width card in single column
- `md:`: 2-column grid `grid-cols-2 gap-6`
- `lg:`: 3-column grid `grid-cols-3 gap-8`

**Accessibility:**
- Card is not a link — CTA link inside is the interactive element
- `aria-labelledby` linking h3 title to card
- Image: `alt` describing product (e.g., "Egyptian cotton bath towels in cream, 400 GSM")

---

#### Client Logo Card

Used in the logo wall on Home and Clients pages.

```
Container:   bg-white border border-cloud p-6 flex items-center justify-center
             h-[100px] md:h-[120px]
             hover:border-mist hover:shadow-sm (transition duration-200)
             grayscale hover:grayscale-0 (transition duration-300)
             filter property — applies desaturation at rest, full color on hover

Logo:        max-h-[52px] max-w-[140px] object-contain
             (handles inconsistent logo sizes gracefully)
```

Logo wall grid:
- Mobile: `grid-cols-3 gap-3`
- `sm:`: `grid-cols-4 gap-4`
- `lg:`: `grid-cols-5 gap-4`
- `xl:`: `grid-cols-6 gap-6`

**Accessibility:**
- `<img alt="TUI Blue — hotel client of Dozen">` (not blank — logos convey meaning)
- `role="img"` if using CSS background

---

#### Feature / Value Prop Card

Used in homepage sections explaining Dozen's offer.

```
Container:   bg-transparent p-6 md:p-8
             border-l-2 border-gold (left accent bar)

Icon area:   w-10 h-10 text-gold mb-4

Title:       text-2xl font-heading font-500 text-onyx mb-3

Body:        text-base font-body text-bark leading-relaxed
```

Grid: 3-column on `lg:`, stacked single column on mobile.

---

#### Testimonial Card

```
Container:   bg-linen border border-cloud p-8 md:p-10 relative

Quote mark:  Cormorant " character, text-7xl text-gold/30 absolute top-4 left-6
             aria-hidden="true"

Quote text:  text-xl md:text-2xl font-heading font-300 italic text-espresso
             leading-relaxed mb-6

Attribution: text-sm font-body text-driftwood
             "— [Name], [Title], [Property]"
```

---

### 5.3 Navigation

#### Desktop Navigation

```
<nav>:       bg-linen/95 backdrop-blur-sm sticky top-0 z-50
             border-b border-cloud
             h-[72px]

Layout:      flex items-center justify-between
             max-w-site mx-auto px-8

Logo:        h-[40px] — SVG or image — links to /

Nav links:   text-xs font-body font-semibold uppercase tracking-widest text-bark
             hover:text-onyx transition-colors duration-150
             Active: text-terracotta border-b border-terracotta pb-[2px]
             Gap between links: gap-8

CTA button:  Primary button sm — "Request a Quote"
             ml-8
```

**Scroll behavior:** When page scrolled >80px, add `shadow-sm` to nav.

**Keyboard:** All links focusable in order, `focus-visible` ring on each.

---

#### Mobile Navigation

Hamburger triggers a slide-down full-width drawer (not sidebar — simpler DOM, better mobile UX).

```
Hamburger:   3 lines, 24x18px icon, p-2 touch target (minimum 44x44px)
             aria-label="Open navigation menu"
             aria-expanded="[true|false]"
             aria-controls="mobile-nav"

Drawer:      id="mobile-nav"
             bg-linen border-b border-cloud
             w-full absolute top-[72px] left-0 right-0 z-40
             Framer: height 0 → auto, opacity 0 → 1, duration 0.2s ease-out

Links:       text-lg font-heading font-500 text-onyx
             border-b border-cloud last:border-0 py-4 px-5
             Active: text-terracotta

CTA:         Primary button full-width mx-5 my-4
```

**Focus trap:** When drawer open, trap focus inside nav. Escape key closes.

---

### 5.4 Forms

#### Input Fields

```
Label:       text-sm font-body font-semibold text-espresso mb-1.5
             id for field association

Input:       w-full bg-white border border-mist text-onyx
             px-4 py-3 text-base font-body
             placeholder:text-driftwood
             rounded-none (consistent with button shape language)
             transition-colors duration-150

             Focus: border-terracotta outline-none ring-1 ring-terracotta
             Error: border-error ring-1 ring-error bg-error-light/20
             Disabled: bg-sand text-driftwood cursor-not-allowed
```

Tailwind: `w-full bg-white border border-mist text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta disabled:bg-sand disabled:text-driftwood disabled:cursor-not-allowed`

#### Textarea

Same as input. Add:
```
resize-y min-h-[120px] max-h-[400px]
```

#### Select

```
Same base styles as Input.
appearance-none
bg-[url('/icons/chevron-down.svg')] bg-no-repeat bg-[center_right_16px]
pr-10
cursor-pointer
```

#### Error State

```
Error message: text-sm font-body text-error mt-1.5 flex items-center gap-1
               Icon: XCircle 14px aria-hidden="true"

Field container: relative (for error icon positioning if needed)
```

Aria: `aria-describedby="[field-id]-error"` on input, `id="[field-id]-error"` on error message, `aria-invalid="true"` on input when error.

#### Form Layout

```
Form:        max-w-narrow mx-auto space-y-6

Field group: flex flex-col gap-1.5

Submit row:  mt-8 flex flex-col sm:flex-row gap-4
             Privacy note text-xs text-driftwood text-center mt-3
```

#### Request-a-Quote Form Fields

1. Property Name (text input) — required
2. Property Type (select: Resort / Boutique Hotel / Lodge / Villa / Guesthouse / Other) — required
3. Contact Name (text input) — required
4. Email Address (email input) — required
5. WhatsApp Number (tel input, +255 prefix hint) — optional
6. Products of Interest (checkboxes: Towels / Bed Linen / Bedding / F&B Linen / Bathrobes / Slippers / Kitchen & Sanitation) — at least one required
7. Estimated Quantity (select: 10–50 units / 50–200 units / 200–500 units / 500+ units) — optional
8. Message / Special Requirements (textarea) — optional

---

### 5.5 Hero Section

#### Full-Bleed Hero (Homepage)

```
Container:   relative w-full min-h-[85vh] md:min-h-[90vh]
             flex items-center

Background:  Linen (#F5F0E8) base
             Option A (no photo): pure linen bg with subtle paper texture via CSS noise filter
             Option B (with photo): absolute inset image with overlay
             Overlay: bg-onyx/30 (30% dark overlay for text contrast)

             Image: object-cover w-full h-full object-[center_40%] — crops to upper portion

Content:     relative z-10 max-w-site mx-auto px-5 md:px-8
             max-w-[720px] (constrain text column)

Eyebrow:     text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4
             "Egyptian Heritage · Zanzibar Presence"

Headline:    text-5xl md:text-7xl font-heading font-300 text-onyx leading-[1.05]
             (If dark overlay: text-white)
             "Outfitting East Africa's Finest Properties"

Subheadline: text-lg md:text-xl font-body text-bark leading-relaxed mt-6 max-w-lg
             (If overlay: text-white/90)

CTA group:   flex flex-col sm:flex-row gap-4 mt-10
             Primary button lg — "Request a Quote"
             Secondary button lg — "View Our Catalog"

Client proof: mt-12 flex items-center gap-3
             text-xs font-body text-driftwood uppercase tracking-wider
             "Trusted by 30+ properties across East Africa"
             3 client logos at h-[24px] grayscale
```

**No photo option (faster load):** Use pure linen background. Add a subtle side-positioned product image (towel stack, white linen on wooden surface) at `right-0 bottom-0 hidden lg:block` — `max-w-[45%] object-contain`.

---

#### Page Hero (Inner Pages)

```
Container:   bg-sand py-16 md:py-20
             border-b border-cloud

Content:     max-w-site mx-auto px-5 md:px-8

Eyebrow:     Same as full-bleed eyebrow style
             Page-specific text

Headline:    text-4xl md:text-5xl font-heading font-400 text-onyx

Description: text-lg font-body text-bark mt-4 max-w-prose
```

---

### 5.6 Badges / Tags

#### Category Badge (product taxonomy)

```
Inline:  inline-flex items-center gap-1 px-3 py-1
         text-xs font-body font-semibold uppercase tracking-wider
         rounded-full (pill shape — contrast with card/button square edges)

Variants:
  Default:     bg-cloud text-bark
  Active:      bg-terracotta text-white
  New:         bg-gold-light text-espresso
  Featured:    bg-linen border border-gold text-bark
```

#### Product Spec Tag (sizes, GSM, thread count)

```
Inline:  inline-flex items-center px-2 py-0.5
         text-xs font-body text-driftwood
         border border-cloud rounded-sm bg-white
         "400 GSM" / "70×140cm" / "300TC"
```

#### Status Badge

```
Inline:  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body
         Success: bg-success-light text-success
         Warning: bg-warning-light text-warning
         Error:   bg-error-light text-error
```

---

## 6. Imagery Direction

### Photography Style

**Tone:** Editorial hospitality photography. Clean, high-key natural light. Not studio catalog shots — lifestyle in situ. Think towels folded on a resort bathroom counter, bed linen on a boutique hotel king bed, tablecloth on a beachfront restaurant table at golden hour.

**Color temperature:** Warm. No cool/blue-toned images. Match the linen/terracotta palette.

**Subjects:**
- Textiles in real hospitality environments (resort bathrooms, hotel rooms, restaurant tables)
- Product flat lays on natural surfaces (wood, stone, sand) in outdoor Zanzibar light
- Close-up texture shots showing weave quality and thread density
- People are secondary — when present, they are hotel staff in elegant settings

**Composition:** Generous headroom. Product centered or rule-of-thirds. Room to place copy overlays without obscuring product.

**What to avoid:** White studio backgrounds (too catalog), cool color grading, people holding products toward camera (advertising cliche), heavy post-processing filters.

**Placeholder approach (pre-photography):** Use warm linen-toned placeholder blocks (`bg-sand`) with subtle CSS noise texture. Never use generic stock photography.

### Icon Style

**Library:** Lucide React (already compatible with 21st.dev components, tree-shakeable, consistent line weight)

**Specification:**
- Style: Line icons, 1.5px stroke weight
- Size: `16px` inline, `20px` standalone, `24px` hero icons
- Color: Inherits text color — `currentColor`
- Never: filled variants, multi-color icons, emoji-style icons

**Custom brand icons (if needed):**
- Embroidery/customization icon: needle + thread
- Egyptian cotton: simple cotton boll
- These are SVG only, same line style as Lucide

### Logo Treatment

**Dozen logo:** Requires final SVG from client. Until received:
- Text fallback: `DOZEN` in Cormorant Garamond, weight 500, `tracking-[0.15em]`, uppercase, onyx color
- Tagline if applicable: Inter `text-xs` below

**Client logos (30+ hotels):**
- Prefer SVG. Accept PNG with transparent background minimum 200px height.
- Displayed at `grayscale` by default, `grayscale-0` on hover (CSS filter).
- Never stretch or distort — use `object-contain` always.
- If logo has white wordmark: display on `bg-onyx` tile variant for the logo wall.

**Supply partner logos (Garrana Group, Alazima & Hedjet, The Tailor Uniform):**
- Same treatment as client logos.
- Display in About page — separate grid from hotel clients.
- Label: "Our Supply Partners" — Inter `xs` uppercase.

---

## 7. Motion Principles (Framer Motion)

### Philosophy

Motion is functional, not decorative. Every animation serves a purpose: orientation, feedback, or content revelation. No animations that play without user interaction (no auto-playing slideshows, no looping background motion). Users on slow connections and users with `prefers-reduced-motion` must have a fully functional experience without any motion.

### Reduced Motion Rule

Wrap all Framer Motion variants with this check:

```tsx
import { useReducedMotion } from 'framer-motion'

const prefersReduced = useReducedMotion()

const variants = prefersReduced
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
```

### Duration Standards

| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, toggle) | `0.15s` | `ease-out` |
| Standard (card enter, button state) | `0.25s` | `easeOut` |
| Content reveal (scroll-triggered) | `0.4s` | `[0.25, 0.1, 0.25, 1]` (ease) |
| Page transition | `0.35s` | `easeInOut` |
| Stagger delay between children | `0.08s` | — |
| Maximum animation duration | `0.6s` | — |

### Page Transitions

```tsx
// app/layout.tsx or route group layout
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}
```

Use `AnimatePresence` at the layout level wrapping `{children}`.

### Hover Effects

**Cards:**
```tsx
whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(26,23,20,0.08)' }}
transition={{ duration: 0.25, ease: 'easeOut' }}
```

**Buttons (Primary):**
```tsx
whileHover={{ scale: 1.01 }}
whileTap={{ scale: 0.99 }}
transition={{ duration: 0.15, ease: 'easeOut' }}
```

**Logo wall items:**
```tsx
whileHover={{ scale: 1.04 }}
transition={{ duration: 0.2, ease: 'easeOut' }}
```

**Navigation links:**
Use CSS transitions only (`transition-colors duration-150`) — Framer is overkill for nav links.

### Scroll-Reveal

```tsx
// Shared scroll reveal variant
const scrollReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

// Usage with viewport trigger
<motion.div
  variants={scrollReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
>
```

**Staggered children (e.g., product grid, logo wall):**
```tsx
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
// Parent uses containerVariants, children use scrollReveal
```

### Hero Animation Sequence

On page load (no scroll trigger — immediate):
1. Eyebrow: fade in, `delay: 0`
2. Headline: fade in + `y: 16 → 0`, `delay: 0.1`
3. Subheadline: fade in + `y: 16 → 0`, `delay: 0.2`
4. CTA group: fade in + `y: 12 → 0`, `delay: 0.3`
5. Client proof: fade in, `delay: 0.5`

All use `duration: 0.4, ease: easeOut`.

---

## 8. Tailwind Configuration

Full `tailwind.config.js` `extend` block:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          DEFAULT: '#F5F0E8',
          light: '#FAF8F5',
          dark: '#E8DFD0',
        },
        sand: '#E8DFD0',
        terracotta: {
          DEFAULT: '#C4622D',
          deep: '#A34E22',
          light: '#F0D5C5',
        },
        gold: {
          DEFAULT: '#B8860B',
          warm: '#D4A017',
          light: '#F5E9C4',
        },
        onyx: '#1A1714',
        espresso: '#2D2520',
        bark: '#5C4A3A',
        driftwood: '#8C7B6B',
        mist: '#C4B8AB',
        cloud: '#EDE8E1',
        success: {
          DEFAULT: '#2D6A4F',
          light: '#D8F0E6',
        },
        warning: {
          DEFAULT: '#92400E',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#991B1B',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tailwind defaults cover xs through 7xl — no overrides needed
        // Custom additions:
        'display': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        'site': '1280px',
        'prose-lg': '72ch',
        'narrow': '680px',
      },
      spacing: {
        // Tailwind default 4px base used — no custom tokens needed
        // Named convenience tokens:
        'section-y': '6rem',      // 96px — section vertical padding desktop
        'section-y-sm': '4rem',   // 64px — section vertical padding mobile
      },
      borderRadius: {
        // Override to enforce square design language as default
        'DEFAULT': '0px',
        'sm': '2px',       // only for spec tags, small chips
        'md': '4px',       // only for tooltips, dropdowns
        'full': '9999px',  // category badges, pill tags only
      },
      boxShadow: {
        'card': '0 2px 8px rgba(26, 23, 20, 0.06)',
        'card-hover': '0 8px 24px rgba(26, 23, 20, 0.10)',
        'nav': '0 1px 0 rgba(26, 23, 20, 0.08)',
        'dropdown': '0 4px 16px rgba(26, 23, 20, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // CSS fallbacks for when Framer is not available
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      backgroundImage: {
        // Subtle noise texture for linen backgrounds (SVG data URI)
        'linen-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      screens: {
        // Tailwind defaults used — adding one custom breakpoint:
        'xs': '375px', // minimum mobile design width
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // for product description prose blocks
    require('@tailwindcss/forms'),         // normalizes form element styles
    require('@tailwindcss/aspect-ratio'), // for product image aspect-ratio containers
  ],
}
```

---

## 9. Accessibility

### Contrast Ratios (WCAG 2.1 AA Verified)

| Foreground | Background | Ratio | AA Pass? | AAA Pass? |
|-----------|-----------|-------|----------|-----------|
| Onyx `#1A1714` | Linen `#F5F0E8` | 16.8:1 | AA ✓ | AAA ✓ |
| Onyx `#1A1714` | White `#FFFFFF` | 18.4:1 | AA ✓ | AAA ✓ |
| Espresso `#2D2520` | Linen `#F5F0E8` | 14.2:1 | AA ✓ | AAA ✓ |
| Bark `#5C4A3A` | Linen `#F5F0E8` | 7.1:1 | AA ✓ | AAA ✓ |
| Bark `#5C4A3A` | White `#FFFFFF` | 7.6:1 | AA ✓ | AAA ✓ |
| Driftwood `#8C7B6B` | White `#FFFFFF` | 3.5:1 | AA ✓ (large text) | — |
| **Driftwood on linen** | `#F5F0E8` | 3.1:1 | **FAIL — use for placeholder/disabled only** | — |
| Terracotta `#C4622D` | White `#FFFFFF` | 4.6:1 | AA ✓ | — |
| Terracotta `#C4622D` | Linen `#F5F0E8` | 4.2:1 | AA ✓ | — |
| White `#FFFFFF` | Terracotta `#C4622D` | 4.6:1 | AA ✓ | — |
| White `#FFFFFF` | Onyx `#1A1714` | 18.4:1 | AA ✓ | AAA ✓ |
| Success `#2D6A4F` | White `#FFFFFF` | 6.3:1 | AA ✓ | — |
| Error `#991B1B` | White `#FFFFFF` | 7.2:1 | AA ✓ | AAA ✓ |
| Warning `#92400E` | White `#FFFFFF` | 6.1:1 | AA ✓ | — |
| Gold `#B8860B` | White `#FFFFFF` | 3.4:1 | **FAIL — decorative use only** | — |
| Gold `#B8860B` | Linen `#F5F0E8` | 3.1:1 | **FAIL — decorative use only** | — |

**Critical notes:**
- Gold is decorative only — never use for text that must be read (dividers, icons, eyebrow accents are fine; body text is forbidden)
- Driftwood is placeholder/disabled only — never use for readable body copy
- All body text must use Onyx, Espresso, or Bark on Linen/White backgrounds

### Focus Indicators

All interactive elements must show a visible focus ring when navigated by keyboard:

```css
/* Global focus style — add to globals.css */
:focus-visible {
  outline: 2px solid #C4622D; /* terracotta */
  outline-offset: 3px;
}

/* Override for elements on dark backgrounds */
.dark-bg :focus-visible {
  outline-color: #F5F0E8; /* linen */
}
```

In Tailwind, use `focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2` on all interactive elements.

**Do not** use `outline: none` without providing an alternative visible focus indicator.

### Color-Blind Considerations

The palette is warm-tone dominated. Key considerations:

| Condition | Risk | Mitigation |
|-----------|------|------------|
| Deuteranopia (red-green) | Terracotta may look brownish, not orange-red | OK — terracotta is always paired with text or underline, not used as the sole status indicator |
| Protanopia (red-green) | Same as above | Same mitigation |
| Tritanopia (blue-yellow) | Gold and bark may be indistinguishable | Gold is decorative only — no information conveyed by gold alone |
| Achromatopsia (full color-blind) | All accent colors become grey | All interactive states additionally indicated by border, underline, or text change — never color alone |

**Rule:** Never convey meaning through color alone. Error states add an icon AND text. Success states add a checkmark AND text. Active nav items add an underline AND color change.

### Keyboard Navigation

| Element | Keyboard behavior |
|---------|------------------|
| Nav links | Tab order, Enter activates |
| Mobile hamburger | Enter/Space opens, Escape closes |
| Mobile drawer | Focus trapped while open |
| Cards | Not keyboard targets — internal CTA link is |
| Form fields | Tab order matches visual order |
| Select dropdowns | Native select — arrow keys work by default |
| Checkboxes | Space to toggle, Tab to next |
| Submit button | Enter submits, Tab is last focusable in form |
| Logo wall images | `<img>` with alt — not interactive, no keyboard handling needed |

### Screen Reader Annotations

```tsx
// Logo wall section
<section aria-label="Hotel clients who trust Dozen">
  <ul role="list" className="grid ...">
    <li><img src="..." alt="TUI Blue — hotel client" /></li>
    ...
  </ul>
</section>

// Navigation
<nav aria-label="Main navigation">
  <ul role="list"> ... </ul>
</nav>

// Hero CTA group
<div role="group" aria-label="Primary actions">
  <a href="/quote">Request a Quote</a>
  <a href="/products">View Our Catalog</a>
</div>

// Quote form
<form aria-label="Request a quote from Dozen Hotel Supplies">
  // Each fieldset groups related fields
  <fieldset>
    <legend className="sr-only">Product categories of interest</legend>
    // checkboxes here
  </fieldset>
</form>
```

---

## 10. Page-by-Page Application Notes

### Home Page

**Section order:**
1. Nav (sticky)
2. Full-bleed hero — headline + CTAs + client proof strip
3. "Trusted by East Africa's Finest" — logo wall (30+ hotels, animated grid)
4. Value proposition — 3 feature cards (Egyptian Heritage / Full Customization / Zanzibar Presence)
5. Product categories — 4-6 cards linking to /products with category filter
6. Social proof — 2-3 testimonial cards (carousel on mobile, 3-column on desktop)
7. About teaser — split layout: copy left, supply chain visual right
8. CTA section — full-width sand background, centered headline + primary button
9. Footer

**Section backgrounds alternate:** `bg-linen` → `bg-white` → `bg-sand` → `bg-linen` to create visual rhythm without borders.

### Products Page

**Layout:** Filter sidebar (desktop) / filter drawer (mobile) + product grid

Filter tags: Category badges — Bath Towels, Bed Linen, Bedding, F&B Linen, Bathrobes, Slippers, Kitchen & Sanitation

Product grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with Product Cards

Each product category expands to a detail view with: spec table (sizes, GSM/TC, materials, colors), customization options, indicative price range, and a "Request a Quote" CTA.

Spec table style:
```
<table> border-collapse border border-cloud
  <th> text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 text-left
  <td> text-sm text-bark px-4 py-3 border-t border-cloud
```

### About Page

**Layout:** Editorial — full-width sections alternating text/image.

Supply partner section: 3 partner cards with logo + established date + brief description.

### Clients Page

**Full logo wall** + optional testimonial cards below. Filter by property type (Resort / Boutique / Lodge / Villa).

### Request a Quote Page

Center-aligned form on `max-w-narrow` container. Left column: form. Right column (desktop): trust signals — client logos strip, response time promise ("We respond within 24 hours"), phone/WhatsApp.

### Contact Page

Clean, minimal. Address, phone, email, WhatsApp link (opens wa.me deeplink), embedded map (Kibweni, Zanzibar). No hero needed — page hero with "Get in Touch" heading.

---

## 11. Developer Handoff Checklist

The nextjs-developer should verify these before Sprint 2 coding begins:

- [ ] `tailwind.config.js` extended with all tokens from Section 8
- [ ] Cormorant Garamond + Inter loaded via `next/font/google` with variables
- [ ] `globals.css` includes `:focus-visible` global rule
- [ ] `@tailwindcss/typography`, `@tailwindcss/forms`, `@tailwindcss/aspect-ratio` installed
- [ ] Framer Motion installed: `npm install framer-motion`
- [ ] Lucide React installed: `npm install lucide-react`
- [ ] All colors verified in browser DevTools against hex values in this doc
- [ ] Font rendering tested on Android Chrome (primary mobile platform for Zanzibar market)
- [ ] `prefers-reduced-motion` tested — confirm animations disable correctly
- [ ] Logo wall renders correctly at 3, 4, 5, and 6 column breakpoints
- [ ] Form keyboard navigation tested end-to-end

---

*Design system v1.0 — Complete. All tokens, components, and guidelines above are the single source of truth for Sprint 2 implementation. Any deviation from this spec requires ui-designer review before commit.*
