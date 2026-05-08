# Interactive Quote System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a three-path interactive quote system on dozensupplies.com — Add-to-Quote catalog builder, Room Configurator, and the existing Quick Form — with server-side auto-save, Google Sheets storage, Twilio WhatsApp alerts, and a permanent quote view URL.

**Architecture:** Quote state lives in a React Context + useReducer in the client. A session UUID embedded in the URL (`/quote/builder?s=uuid`) is the persistence key — auto-saved to a Google Sheets "Quote Drafts" tab on every meaningful action. Submission promotes the draft to a "Quote Submissions" tab, triggers a Twilio WhatsApp + team email, and returns a permanent view URL. All API routes are Next.js App Router Route Handlers under `app/api/quote/`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Google Sheets API (`googleapis`), Twilio SDK (`twilio`), nodemailer, zod (validation), crypto.randomUUID (built-in, no uuid package needed).

---

## File Map

```
website/
├── .env.local                              MODIFY — add new env vars
├── lib/quote/
│   ├── types.ts                            CREATE
│   ├── catalog.ts                          CREATE
│   ├── sheets.ts                           CREATE
│   ├── session.ts                          CREATE
│   ├── rateLimit.ts                        CREATE
│   ├── twilio.ts                           CREATE
│   └── email.ts                            CREATE
├── components/quote/
│   ├── QuoteContext.tsx                    CREATE
│   ├── QuoteProductBrowser.tsx             CREATE
│   ├── QuoteCartItem.tsx                   CREATE
│   ├── QuoteCart.tsx                       CREATE
│   ├── RoomConfigurator.tsx                CREATE
│   ├── QuoteBuilderShell.tsx               CREATE
│   └── QuoteSubmitForm.tsx                 CREATE
└── app/
    ├── quote/
    │   ├── page.tsx                        MODIFY — 3-path landing
    │   ├── builder/
    │   │   └── page.tsx                    CREATE
    │   ├── submit/
    │   │   └── page.tsx                    CREATE
    │   └── view/
    │       └── [token]/
    │           └── page.tsx                CREATE
    └── api/quote/
        ├── draft/
        │   ├── route.ts                    CREATE — POST upsert draft
        │   └── [session]/
        │       └── route.ts                CREATE — GET draft by session
        ├── submit/
        │   └── route.ts                    CREATE — POST submit quote
        └── view/
            └── [token]/
                └── route.ts               CREATE — GET submission by token
```

---

## Google Sheets Schema

The spreadsheet (ID in `GOOGLE_SHEETS_QUOTE_ID`) needs two tabs created manually before first run.

**Tab: Quote Drafts**
| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | session_uuid | string | Primary key. UUID v4. |
| B | created_at | ISO8601 | Set on first upsert. |
| C | updated_at | ISO8601 | Updated on every upsert. |
| D | cart_items_json | JSON string | Array of CartItem. Empty array `[]` if unused. |
| E | room_config_json | JSON string | RoomConfig object. Empty string `""` if unused. |
| F | status | enum | `active` \| `submitted` |

**Tab: Quote Submissions**
| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | submission_id | string | UUID v4. Permanent retrieval token. |
| B | session_uuid | string | FK to Quote Drafts. |
| C | submitted_at | ISO8601 | Submission timestamp. |
| D | customer_name | string | |
| E | customer_email | string | |
| F | property_name | string | |
| G | submission_type | enum | `catalog` \| `rooms` \| `both` |
| H | cart_items_json | JSON string | Serialised CartItem[]. `[]` if unused. |
| I | room_config_json | JSON string | Serialised RoomConfig. `""` if unused. |
| J | room_count | number | 0 if catalog-only. |
| K | laundry_frequency | string | Empty string if catalog-only. |
| L | notes | string | Customer freeform notes. |
| M | status | enum | `new` \| `viewed` \| `quoted` |

Row 1 in each tab = headers exactly as above. Data starts row 2.

---

## Environment Variables

Add to `website/.env.local`:

```
# Google Sheets — Quote System
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
GOOGLE_SHEETS_QUOTE_ID=your-spreadsheet-id

# Twilio
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+255772502076

# Team email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
TEAM_EMAIL=abdelrahman@znznow.com

# App
NEXT_PUBLIC_APP_URL=https://dozensupplies.com
```

---

## Task 1: Install packages

**Files:** `website/package.json`

**Step 1: Install new dependencies**
```bash
cd website
npm install googleapis twilio nodemailer zod
npm install --save-dev @types/nodemailer
```

**Step 2: Verify install**
```bash
node -e "require('googleapis'); require('twilio'); require('nodemailer'); require('zod'); console.log('OK')"
```
Expected: `OK`

**Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "feat(quote): install googleapis, twilio, nodemailer, zod"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `website/lib/quote/types.ts`

**Step 1: Create the types file**

```typescript
// website/lib/quote/types.ts

export interface CartItem {
  id: string
  category: string
  productName: string
  quantity: number
  notes: string
  customSizeRequest: string  // empty string if not requested
  priceFrom: string          // indicative, display only
  image: string
}

export interface RoomConfig {
  roomCount: number
  categoriesPerRoom: string[]   // from PRODUCT_CATEGORIES keys
  laundryFrequency: string      // 'daily' | 'every-2-days' | 'every-3-days' | 'weekly' | custom string
  notes: string
}

export interface QuoteDraft {
  sessionUuid: string
  createdAt: string
  updatedAt: string
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  status: 'active' | 'submitted'
}

export interface QuoteSubmission {
  submissionId: string
  sessionUuid: string
  submittedAt: string
  customerName: string
  customerEmail: string
  propertyName: string
  submissionType: 'catalog' | 'rooms' | 'both'
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  status: 'new' | 'viewed' | 'quoted'
}

export type QuoteAction =
  | { type: 'SET_SESSION'; session: string }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'UPDATE_NOTES'; id: string; notes: string }
  | { type: 'UPDATE_CUSTOM_SIZE'; id: string; customSizeRequest: string }
  | { type: 'SET_ROOM_CONFIG'; config: RoomConfig }
  | { type: 'LOAD_DRAFT'; draft: QuoteDraft }
  | { type: 'CLEAR' }

export interface QuoteState {
  session: string | null
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  isDirty: boolean      // true when local state differs from last server save
  isSaving: boolean
  lastSaved: string | null
}
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

**Step 3: Commit**
```bash
git add lib/quote/types.ts
git commit -m "feat(quote): add TypeScript types for quote system"
```

---

## Task 3: Product catalog data

**Files:**
- Create: `website/lib/quote/catalog.ts`

This extracts the canonical product list from the scattered page files into one importable source of truth used by both the quote builder and (optionally) the existing product pages.

**Step 1: Create catalog file**

```typescript
// website/lib/quote/catalog.ts

export interface CatalogProduct {
  id: string
  category: string
  categorySlug: string
  name: string
  description: string
  priceFrom: string
  image: string
  hasCustomSize: boolean
}

export const LAUNDRY_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'every-2-days', label: 'Every 2 days' },
  { value: 'every-3-days', label: 'Every 3 days' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Other (describe in notes)' },
]

export const PRODUCT_CATEGORIES = [
  'Bath Towels',
  'Bed Linen',
  'Bedding',
  'F&B Linen',
  'Bathrobes',
  'Slippers',
  'Kitchen & Sanitation',
] as const

export const CATALOG: CatalogProduct[] = [
  // Bath Towels
  {
    id: 'towel-face',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Face Towel',
    description: '30×30cm. 400–600 GSM Egyptian cotton. Available in white, ivory, and sand.',
    priceFrom: 'From USD $0.95 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'towel-hand',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Hand Towel',
    description: '50×90cm. 400–600 GSM Egyptian cotton. Hemstitched or plain border.',
    priceFrom: 'From USD $1.80 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'towel-bath',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Bath Towel',
    description: '70×140cm. 500–700 GSM Egyptian cotton. Most popular hotel standard.',
    priceFrom: 'From USD $4.50 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'towel-bath-sheet',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Bath Sheet',
    description: '90×150cm. 600–900 GSM. Luxury oversized format for suites and spas.',
    priceFrom: 'From USD $7.20 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'towel-pool',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Pool / Beach Towel',
    description: '90×180cm. 400–500 GSM. Lightweight, quick-dry, stripe patterns available.',
    priceFrom: 'From USD $5.50 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'towel-gym',
    category: 'Bath Towels',
    categorySlug: 'towels',
    name: 'Gym / Sport Towel',
    description: '40×80cm. 400 GSM. Compact, absorbent, suitable for fitness centres.',
    priceFrom: 'From USD $2.20 / unit',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  // Bed Linen
  {
    id: 'linen-single-sheet',
    category: 'Bed Linen',
    categorySlug: 'bed-linen',
    name: 'Single Flat Sheet',
    description: '160×260cm. 200–500 TC Egyptian cotton or poly-cotton blend.',
    priceFrom: 'From USD $13.04 / sheet',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'linen-double-sheet',
    category: 'Bed Linen',
    categorySlug: 'bed-linen',
    name: 'Double / Queen Flat Sheet',
    description: '230×260cm. 200–500 TC. White, ivory, or custom colour.',
    priceFrom: 'From USD $18.50 / sheet',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'linen-king-sheet',
    category: 'Bed Linen',
    categorySlug: 'bed-linen',
    name: 'King Flat Sheet',
    description: '270×290cm. 200–500 TC. Satin stripe or plain weave.',
    priceFrom: 'From USD $22.00 / sheet',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'linen-pillowcase',
    category: 'Bed Linen',
    categorySlug: 'bed-linen',
    name: 'Pillowcase',
    description: '50×75cm standard. 200–400 TC. Oxford or housewife style.',
    priceFrom: 'From USD $4.80 / pair',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'linen-duvet-cover',
    category: 'Bed Linen',
    categorySlug: 'bed-linen',
    name: 'Duvet Cover',
    description: 'Single to Super King. 300–500 TC. Button or zip closure.',
    priceFrom: 'From USD $24.00 / cover',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  // Bedding
  {
    id: 'bedding-pillow',
    category: 'Bedding',
    categorySlug: 'bedding',
    name: 'Pillow Insert',
    description: '50×75cm. Microfiber hollow-fibre fill. Hypoallergenic. Medium or firm.',
    priceFrom: 'From USD $5.50 / pillow',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'bedding-duvet',
    category: 'Bedding',
    categorySlug: 'bedding',
    name: 'Duvet Insert',
    description: 'Single to Super King. 150–300 GSM. Lightweight fill for warm climates.',
    priceFrom: 'From USD $18.00 / duvet',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'bedding-mattress-protector',
    category: 'Bedding',
    categorySlug: 'bedding',
    name: 'Mattress Protector',
    description: 'Single to Super King. Waterproof, breathable, fitted or flat.',
    priceFrom: 'From USD $2.00 / protector',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'bedding-mattress-topper',
    category: 'Bedding',
    categorySlug: 'bedding',
    name: 'Mattress Topper',
    description: 'Single to Super King. 500–1000 GSM microfiber. Adds luxury to standard mattresses.',
    priceFrom: 'From USD $28.00 / topper',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'bedding-cushion',
    category: 'Bedding',
    categorySlug: 'bedding',
    name: 'Decorative Cushion',
    description: '45×45cm or 60×60cm. Poly-cotton cover, microfiber fill. Custom colours.',
    priceFrom: 'From USD $6.50 / cushion',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  // F&B Linen
  {
    id: 'fb-tablecloth',
    category: 'F&B Linen',
    categorySlug: 'fb-linen',
    name: 'Tablecloth',
    description: '100% cotton or poly-cotton. Round, square, rectangular. Custom sizing.',
    priceFrom: 'From USD $8.50 / cloth',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'fb-napkin',
    category: 'F&B Linen',
    categorySlug: 'fb-linen',
    name: 'Dinner Napkin',
    description: '45×45cm. 200–300 GSM cotton. White or ivory. Logo embroidery available.',
    priceFrom: 'From USD $1.50 / napkin',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  {
    id: 'fb-chair-cover',
    category: 'F&B Linen',
    categorySlug: 'fb-linen',
    name: 'Chair Cover',
    description: 'Banquet chair cover. Poly-cotton or lycra stretch. Multiple colours.',
    priceFrom: 'From USD $3.20 / cover',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'fb-table-runner',
    category: 'F&B Linen',
    categorySlug: 'fb-linen',
    name: 'Table Runner',
    description: '30×180cm. 100% cotton. Adds style to banquet or fine dining setups.',
    priceFrom: 'From USD $4.00 / runner',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: true,
  },
  // Bathrobes
  {
    id: 'robe-terry',
    category: 'Bathrobes',
    categorySlug: 'bathrobes',
    name: 'Terry Bathrobe',
    description: 'M–XXL. 380 GSM looped terry. Heavy, plush, classic luxury feel.',
    priceFrom: 'From USD $21.00 / robe',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'robe-waffle',
    category: 'Bathrobes',
    categorySlug: 'bathrobes',
    name: 'Waffle Bathrobe',
    description: 'M–XXL. 280 GSM waffle weave. Lightweight — ideal for Zanzibar climate.',
    priceFrom: 'From USD $18.50 / robe',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'robe-velour',
    category: 'Bathrobes',
    categorySlug: 'bathrobes',
    name: 'Velour Bathrobe',
    description: 'M–XXL. 350 GSM velour. Soft outer finish, terry inner. Premium look.',
    priceFrom: 'From USD $24.00 / robe',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  // Slippers
  {
    id: 'slipper-terry',
    category: 'Slippers',
    categorySlug: 'slippers',
    name: 'Terry Slipper',
    description: 'OSFA. Terry upper, EVA non-slip sole. Open or closed toe.',
    priceFrom: 'From USD $1.10 / pair',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'slipper-waffle',
    category: 'Slippers',
    categorySlug: 'slippers',
    name: 'Waffle Slipper',
    description: 'OSFA. Waffle upper, soft insole. Lightweight and breathable.',
    priceFrom: 'From USD $1.40 / pair',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'slipper-velour',
    category: 'Slippers',
    categorySlug: 'slippers',
    name: 'Velour Slipper',
    description: 'OSFA. Velour upper, EVA sole. Premium presentation for luxury properties.',
    priceFrom: 'From USD $1.90 / pair',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  // Kitchen & Sanitation
  {
    id: 'kitchen-towel',
    category: 'Kitchen & Sanitation',
    categorySlug: 'kitchen-sanitation',
    name: 'Kitchen Towel',
    description: '40×60cm. Cotton or linen. Sold per dozen. High-absorbency for food service.',
    priceFrom: 'From USD $6.00 / dozen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'kitchen-glass-cloth',
    category: 'Kitchen & Sanitation',
    categorySlug: 'kitchen-sanitation',
    name: 'Glass Cloth',
    description: '50×70cm. Lint-free. Sold per dozen. Essential for bar and fine dining.',
    priceFrom: 'From USD $8.00 / dozen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'kitchen-chef-towel',
    category: 'Kitchen & Sanitation',
    categorySlug: 'kitchen-sanitation',
    name: 'Chef Towel',
    description: '35×65cm. Heavy cotton twill. Sold per dozen. Loop for apron attachment.',
    priceFrom: 'From USD $9.00 / dozen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
  {
    id: 'kitchen-microfiber-duster',
    category: 'Kitchen & Sanitation',
    categorySlug: 'kitchen-sanitation',
    name: 'Microfiber Duster',
    description: '30×40cm. 280 GSM microfiber. Sold per dozen. Housekeeping standard.',
    priceFrom: 'From USD $7.50 / dozen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70&auto=format&fit=crop',
    hasCustomSize: false,
  },
]
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -10
```

**Step 3: Commit**
```bash
git add lib/quote/catalog.ts
git commit -m "feat(quote): add canonical product catalog data"
```

---

## Task 4: Google Sheets library

**Files:**
- Create: `website/lib/quote/sheets.ts`

**Step 1: Create sheets utility**

```typescript
// website/lib/quote/sheets.ts
import { google } from 'googleapis'
import type { QuoteDraft, QuoteSubmission, CartItem, RoomConfig } from './types'

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() })
}

const SPREADSHEET_ID = () => {
  const id = process.env.GOOGLE_SHEETS_QUOTE_ID
  if (!id) throw new Error('GOOGLE_SHEETS_QUOTE_ID env var not set')
  return id
}

// ── Quote Drafts ──────────────────────────────────────────────────────────────

export async function upsertDraft(draft: Omit<QuoteDraft, 'createdAt'> & { createdAt?: string }): Promise<void> {
  const sheets = getSheets()
  const id = SPREADSHEET_ID()
  const now = new Date().toISOString()

  // Find existing row by session_uuid
  const existing = await getDraftBySession(draft.sessionUuid)

  const row = [
    draft.sessionUuid,
    existing?.createdAt ?? draft.createdAt ?? now,
    now,
    JSON.stringify(draft.cartItems ?? []),
    draft.roomConfig ? JSON.stringify(draft.roomConfig) : '',
    draft.status ?? 'active',
  ]

  if (existing) {
    // Find row index — re-read col A to locate
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: 'Quote Drafts!A:A',
    })
    const rows = res.data.values ?? []
    const rowIndex = rows.findIndex(r => r[0] === draft.sessionUuid)
    if (rowIndex < 1) return // shouldn't happen if existing was found
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `Quote Drafts!A${rowIndex + 1}:F${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: 'Quote Drafts!A:F',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  }
}

export async function getDraftBySession(sessionUuid: string): Promise<QuoteDraft | null> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: 'Quote Drafts!A:F',
  })
  const rows = res.data.values ?? []
  const row = rows.find(r => r[0] === sessionUuid)
  if (!row) return null
  return {
    sessionUuid: row[0],
    createdAt: row[1],
    updatedAt: row[2],
    cartItems: row[3] ? JSON.parse(row[3]) : [],
    roomConfig: row[4] ? JSON.parse(row[4]) : null,
    status: row[5] as 'active' | 'submitted',
  }
}

// ── Quote Submissions ─────────────────────────────────────────────────────────

export async function createSubmission(sub: QuoteSubmission): Promise<void> {
  const sheets = getSheets()
  const row = [
    sub.submissionId,
    sub.sessionUuid,
    sub.submittedAt,
    sub.customerName,
    sub.customerEmail,
    sub.propertyName,
    sub.submissionType,
    JSON.stringify(sub.cartItems ?? []),
    sub.roomConfig ? JSON.stringify(sub.roomConfig) : '',
    sub.roomConfig?.roomCount ?? 0,
    sub.roomConfig?.laundryFrequency ?? '',
    sub.roomConfig?.notes ?? '',
    sub.status,
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: 'Quote Submissions!A:M',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
  // Mark the draft as submitted
  await upsertDraft({
    sessionUuid: sub.sessionUuid,
    cartItems: sub.cartItems,
    roomConfig: sub.roomConfig,
    status: 'submitted',
  })
}

export async function getSubmissionByToken(token: string): Promise<QuoteSubmission | null> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: 'Quote Submissions!A:M',
  })
  const rows = res.data.values ?? []
  const row = rows.find(r => r[0] === token)
  if (!row) return null
  return {
    submissionId: row[0],
    sessionUuid: row[1],
    submittedAt: row[2],
    customerName: row[3],
    customerEmail: row[4],
    propertyName: row[5],
    submissionType: row[6] as 'catalog' | 'rooms' | 'both',
    cartItems: row[7] ? JSON.parse(row[7]) : [],
    roomConfig: row[8] ? JSON.parse(row[8]) : null,
    status: row[12] as 'new' | 'viewed' | 'quoted',
  }
}
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -10
```

**Step 3: Commit**
```bash
git add lib/quote/sheets.ts
git commit -m "feat(quote): add Google Sheets read/write library"
```

---

## Task 5: Session utility + rate limiter

**Files:**
- Create: `website/lib/quote/session.ts`
- Create: `website/lib/quote/rateLimit.ts`

**Step 1: Create session utility**

```typescript
// website/lib/quote/session.ts

export function generateSession(): string {
  return crypto.randomUUID()
}

export function isValidSession(session: unknown): session is string {
  if (typeof session !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session)
}
```

**Step 2: Create rate limiter**

```typescript
// website/lib/quote/rateLimit.ts
// Simple in-memory sliding window. Resets on server restart.
// For production, replace with Upstash Redis.

interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()
const WINDOW_MS = 60_000   // 1 minute
const MAX_REQUESTS = 10    // per IP per window

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: MAX_REQUESTS - entry.count }
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -10
```

**Step 4: Commit**
```bash
git add lib/quote/session.ts lib/quote/rateLimit.ts
git commit -m "feat(quote): session UUID utility and rate limiter"
```

---

## Task 6: Notification utilities (Twilio + email)

**Files:**
- Create: `website/lib/quote/twilio.ts`
- Create: `website/lib/quote/email.ts`

**Step 1: Create Twilio utility**

```typescript
// website/lib/quote/twilio.ts
import twilio from 'twilio'
import type { QuoteSubmission } from './types'

export async function sendWhatsAppAlert(submission: QuoteSubmission): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const to = process.env.TWILIO_WHATSAPP_TO

  if (!accountSid || !authToken || !from || !to) {
    console.warn('[Twilio] Missing env vars — skipping WhatsApp alert')
    return
  }

  const typeLabel = {
    catalog: `${submission.cartItems.length} item${submission.cartItems.length !== 1 ? 's' : ''} across ${new Set(submission.cartItems.map(i => i.category)).size} categories`,
    rooms: `${submission.roomConfig?.roomCount ?? 0} rooms, ${submission.roomConfig?.categoriesPerRoom.length ?? 0} categories selected`,
    both: `${submission.cartItems.length} catalog items + ${submission.roomConfig?.roomCount ?? 0} rooms`,
  }[submission.submissionType]

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dozensupplies.com'
  const sheetsUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_QUOTE_ID}`

  const body = [
    `🏨 New Quote Request — Dozen`,
    `Customer: ${submission.customerName} | ${submission.propertyName}`,
    `Email: ${submission.customerEmail}`,
    `Type: ${submission.submissionType} — ${typeLabel}`,
    `View quote: ${appUrl}/quote/view/${submission.submissionId}`,
    `Sheets: ${sheetsUrl}`,
  ].join('\n')

  const client = twilio(accountSid, authToken)
  await client.messages.create({ from, to, body })
}
```

**Step 2: Create email utility**

```typescript
// website/lib/quote/email.ts
import nodemailer from 'nodemailer'
import type { QuoteSubmission } from './types'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendTeamNotification(submission: QuoteSubmission): Promise<void> {
  const teamEmail = process.env.TEAM_EMAIL
  if (!teamEmail) {
    console.warn('[Email] TEAM_EMAIL not set — skipping team notification')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dozensupplies.com'

  const cartHtml = submission.cartItems.length > 0
    ? `<h3>Catalog Items</h3><ul>${submission.cartItems.map(item =>
        `<li><strong>${item.productName}</strong> × ${item.quantity}${item.notes ? ` — <em>${item.notes}</em>` : ''}${item.customSizeRequest ? ` [Custom size: ${item.customSizeRequest}]` : ''}</li>`
      ).join('')}</ul>`
    : ''

  const roomHtml = submission.roomConfig
    ? `<h3>Room Configuration</h3>
       <ul>
         <li>Rooms: ${submission.roomConfig.roomCount}</li>
         <li>Categories per room: ${submission.roomConfig.categoriesPerRoom.join(', ')}</li>
         <li>Laundry frequency: ${submission.roomConfig.laundryFrequency}</li>
         ${submission.roomConfig.notes ? `<li>Notes: ${submission.roomConfig.notes}</li>` : ''}
       </ul>`
    : ''

  const html = `
    <h2>New Quote Request — Dozen Hotel Supplies</h2>
    <p><strong>Customer:</strong> ${submission.customerName}</p>
    <p><strong>Property:</strong> ${submission.propertyName}</p>
    <p><strong>Email:</strong> <a href="mailto:${submission.customerEmail}">${submission.customerEmail}</a></p>
    <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString('en-GB', { timeZone: 'Africa/Dar_es_Salaam' })} EAT</p>
    <p><strong>View quote:</strong> <a href="${appUrl}/quote/view/${submission.submissionId}">${appUrl}/quote/view/${submission.submissionId}</a></p>
    <hr />
    ${cartHtml}
    ${roomHtml}
  `

  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Dozen Quote System" <${process.env.SMTP_USER}>`,
    to: teamEmail,
    subject: `New Quote: ${submission.propertyName} — ${submission.customerName}`,
    html,
  })
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -10
```

**Step 4: Commit**
```bash
git add lib/quote/twilio.ts lib/quote/email.ts
git commit -m "feat(quote): Twilio WhatsApp + nodemailer team notification utilities"
```

---

## Task 7: API routes

**Files:**
- Create: `website/app/api/quote/draft/route.ts`
- Create: `website/app/api/quote/draft/[session]/route.ts`
- Create: `website/app/api/quote/submit/route.ts`
- Create: `website/app/api/quote/view/[token]/route.ts`

**Step 1: Draft upsert route**

```typescript
// website/app/api/quote/draft/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { upsertDraft } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'

const Body = z.object({
  sessionUuid: z.string().refine(isValidSession, 'Invalid session UUID'),
  cartItems: z.array(z.object({
    id: z.string(),
    category: z.string(),
    productName: z.string(),
    quantity: z.number().int().min(1),
    notes: z.string(),
    customSizeRequest: z.string(),
    priceFrom: z.string(),
    image: z.string(),
  })),
  roomConfig: z.object({
    roomCount: z.number().int().min(1),
    categoriesPerRoom: z.array(z.string()),
    laundryFrequency: z.string(),
    notes: z.string(),
  }).nullable(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
  }

  try {
    await upsertDraft({ ...parsed.data, status: 'active' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[quote/draft POST]', err)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
```

**Step 2: Draft retrieval route**

```typescript
// website/app/api/quote/draft/[session]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDraftBySession } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }
  try {
    const draft = await getDraftBySession(session)
    if (!draft) return NextResponse.json({ draft: null })
    return NextResponse.json({ draft })
  } catch (err) {
    console.error('[quote/draft GET]', err)
    return NextResponse.json({ error: 'Failed to retrieve draft' }, { status: 500 })
  }
}
```

**Step 3: Submit route**

```typescript
// website/app/api/quote/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSubmission } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'
import { sendWhatsAppAlert } from '@/lib/quote/twilio'
import { sendTeamNotification } from '@/lib/quote/email'
import type { QuoteSubmission } from '@/lib/quote/types'

const Body = z.object({
  sessionUuid: z.string().refine(isValidSession),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  propertyName: z.string().min(2).max(200),
  cartItems: z.array(z.object({
    id: z.string(),
    category: z.string(),
    productName: z.string(),
    quantity: z.number().int().min(1),
    notes: z.string(),
    customSizeRequest: z.string(),
    priceFrom: z.string(),
    image: z.string(),
  })),
  roomConfig: z.object({
    roomCount: z.number().int().min(1),
    categoriesPerRoom: z.array(z.string()),
    laundryFrequency: z.string(),
    notes: z.string(),
  }).nullable(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
  }

  const { sessionUuid, customerName, customerEmail, propertyName, cartItems, roomConfig } = parsed.data

  const hasCart = cartItems.length > 0
  const hasRooms = roomConfig !== null
  const submissionType: QuoteSubmission['submissionType'] =
    hasCart && hasRooms ? 'both' : hasCart ? 'catalog' : 'rooms'

  const submission: QuoteSubmission = {
    submissionId: crypto.randomUUID(),
    sessionUuid,
    submittedAt: new Date().toISOString(),
    customerName,
    customerEmail,
    propertyName,
    submissionType,
    cartItems,
    roomConfig,
    status: 'new',
  }

  try {
    await createSubmission(submission)
  } catch (err) {
    console.error('[quote/submit] Sheets write failed', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }

  // Notifications fire in background — don't block the response
  Promise.allSettled([
    sendWhatsAppAlert(submission).catch(e => console.error('[Twilio]', e)),
    sendTeamNotification(submission).catch(e => console.error('[Email]', e)),
  ])

  return NextResponse.json({ submissionId: submission.submissionId })
}
```

**Step 4: View route**

```typescript
// website/app/api/quote/view/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSubmissionByToken } from '@/lib/quote/sheets'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  try {
    const submission = await getSubmissionByToken(token)
    if (!submission) return NextResponse.json({ submission: null }, { status: 404 })
    return NextResponse.json({ submission })
  } catch (err) {
    console.error('[quote/view GET]', err)
    return NextResponse.json({ error: 'Failed to retrieve submission' }, { status: 500 })
  }
}
```

**Step 5: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 6: Commit**
```bash
git add app/api/quote/
git commit -m "feat(quote): API routes — draft, submit, view"
```

---

## Task 8: Quote Context (React state)

**Files:**
- Create: `website/components/quote/QuoteContext.tsx`

**Step 1: Create context + reducer**

```tsx
// website/components/quote/QuoteContext.tsx
'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { QuoteState, QuoteAction, CartItem, RoomConfig } from '@/lib/quote/types'
import { generateSession, isValidSession } from '@/lib/quote/session'

const initialState: QuoteState = {
  session: null,
  cartItems: [],
  roomConfig: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
}

function reducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.session }
    case 'ADD_ITEM': {
      const existing = state.cartItems.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isDirty: true,
        }
      }
      return { ...state, cartItems: [...state.cartItems, action.item], isDirty: true }
    }
    case 'REMOVE_ITEM':
      return { ...state, cartItems: state.cartItems.filter(i => i.id !== action.id), isDirty: true }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
        isDirty: true,
      }
    case 'UPDATE_NOTES':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, notes: action.notes } : i
        ),
        isDirty: true,
      }
    case 'UPDATE_CUSTOM_SIZE':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, customSizeRequest: action.customSizeRequest } : i
        ),
        isDirty: true,
      }
    case 'SET_ROOM_CONFIG':
      return { ...state, roomConfig: action.config, isDirty: true }
    case 'LOAD_DRAFT':
      return {
        ...state,
        cartItems: action.draft.cartItems,
        roomConfig: action.draft.roomConfig,
        isDirty: false,
        lastSaved: action.draft.updatedAt,
      }
    case 'CLEAR':
      return { ...initialState, session: state.session }
    default:
      return state
  }
}

interface QuoteContextValue {
  state: QuoteState
  dispatch: React.Dispatch<QuoteAction>
  saveNow: () => Promise<void>
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession?: string
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    session: initialSession ?? null,
  })
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: init session + load draft
  useEffect(() => {
    async function init() {
      let session = initialSession

      // Validate or generate session
      if (!session || !isValidSession(session)) {
        session = generateSession()
        // Update URL without navigation
        const url = new URL(window.location.href)
        url.searchParams.set('s', session)
        window.history.replaceState({}, '', url.toString())
      }

      dispatch({ type: 'SET_SESSION', session })

      // Load existing draft
      try {
        const res = await fetch(`/api/quote/draft/${session}`)
        if (res.ok) {
          const { draft } = await res.json()
          if (draft && draft.status !== 'submitted') {
            dispatch({ type: 'LOAD_DRAFT', draft })
          }
        }
      } catch {
        // Non-blocking — start fresh if fetch fails
      }
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveNow = useCallback(async () => {
    if (!state.session || !state.isDirty) return
    try {
      await fetch('/api/quote/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionUuid: state.session,
          cartItems: state.cartItems,
          roomConfig: state.roomConfig,
        }),
      })
      dispatch({ type: 'SET_SESSION', session: state.session }) // triggers lastSaved update
    } catch {
      // Silent — will retry on next change
    }
  }, [state.session, state.isDirty, state.cartItems, state.roomConfig])

  // Debounced auto-save: 2s after last change
  useEffect(() => {
    if (!state.isDirty) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(saveNow, 2000)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [state.isDirty, state.cartItems, state.roomConfig, saveNow])

  return (
    <QuoteContext.Provider value={{ state, dispatch, saveNow }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**
```bash
git add components/quote/QuoteContext.tsx
git commit -m "feat(quote): React context with auto-save and draft loading"
```

---

## Task 9: Quote landing page (3 paths)

**Files:**
- Modify: `website/app/quote/page.tsx`

**Step 1: Replace page with 3-path entry**

```tsx
// website/app/quote/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Request a Quote — Dozen Hotel Supplies',
  description:
    'Request indicative pricing and availability for hotel linen and supplies. Choose between a quick form, a catalog-based builder, or a room-by-room configurator.',
}

const paths = [
  {
    href: '/quote/builder',
    label: 'Build a Quote',
    sub: 'Browse catalog, add specific items',
    description:
      'Browse all 7 product categories. Add items with quantities, notes, and custom size requests. Best for when you know exactly what you need.',
    cta: 'Start building →',
    accent: 'bg-terracotta text-white hover:bg-terracotta-deep',
  },
  {
    href: '/quote/builder?mode=rooms',
    label: 'Configure by Rooms',
    sub: 'Tell us about your property',
    description:
      'Enter your room count, select which product types you need per room, and specify laundry frequency. Our team will build the full product list for you.',
    cta: 'Configure property →',
    accent: 'bg-terracotta text-white hover:bg-terracotta-deep',
  },
]

export default function QuotePage() {
  return (
    <>
      <div className="relative bg-terracotta-deep overflow-hidden py-20 md:py-28 min-h-[280px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=60&auto=format&fit=crop&fm=webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-site mx-auto px-5 md:px-16 w-full">
          <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-4">
            Establish a Partnership
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Request a Quote
          </h1>
          <p className="text-lg font-body text-white/70 mt-4 max-w-prose-lg">
            Three ways to get started — pick the one that fits how you work.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

            {/* Paths 1 + 2 */}
            {paths.map((path) => (
              <div
                key={path.href}
                className="bg-white border border-cloud p-8 flex flex-col"
                style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}
              >
                <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
                <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-2">
                  {path.sub}
                </p>
                <h2 className="text-2xl font-heading font-semibold text-onyx mb-4">
                  {path.label}
                </h2>
                <p className="text-sm font-body text-bark leading-relaxed flex-1 mb-8">
                  {path.description}
                </p>
                <Link
                  href={path.href}
                  className={`inline-flex items-center justify-center px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${path.accent}`}
                >
                  {path.cta}
                </Link>
              </div>
            ))}

            {/* Path 3 — Quick Form (existing) */}
            <div
              className="bg-white border border-cloud p-8 flex flex-col"
              style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}
            >
              <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
              <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-2">
                Simple enquiry
              </p>
              <h2 className="text-2xl font-heading font-semibold text-onyx mb-4">
                Quick Form
              </h2>
              <p className="text-sm font-body text-bark leading-relaxed flex-1 mb-8">
                A short form for a general enquiry. Best for early-stage conversations or if you just want to get in touch before committing to a full quote.
              </p>
              <Link
                href="#quick-form"
                className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                Use quick form →
              </Link>
            </div>
          </div>

          {/* Quick Form (existing) — anchored */}
          <div id="quick-form" className="mt-20 pt-16 border-t border-cloud">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                {/* QuoteForm component — unchanged */}
                {/* Dynamic import here to avoid adding to initial bundle */}
                <QuoteFormLoader />
              </div>
              <aside className="space-y-6">
                <div className="bg-white border border-cloud p-6">
                  <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
                  <h2 className="text-lg font-heading font-semibold text-onyx mb-3">
                    Contact directly
                  </h2>
                  <p className="text-sm font-body text-bark mb-4">
                    Prefer to reach us by email?
                  </p>
                  <a
                    href="mailto:info@dozensupplies.com"
                    className="text-sm font-body text-terracotta hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  >
                    info@dozensupplies.com
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Lazy-load the existing QuoteForm to avoid bundle bloat on the landing page
import dynamic from 'next/dynamic'
const QuoteFormLoader = dynamic(() => import('@/components/QuoteForm'), { ssr: false })
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**
```bash
git add app/quote/page.tsx
git commit -m "feat(quote): 3-path landing page"
```

---

## Task 10: Product browser + cart item components

**Files:**
- Create: `website/components/quote/QuoteCartItem.tsx`
- Create: `website/components/quote/QuoteProductBrowser.tsx`

**Step 1: Create QuoteCartItem**

```tsx
// website/components/quote/QuoteCartItem.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, X, Ruler } from 'lucide-react'
import { useQuote } from './QuoteContext'
import type { CartItem } from '@/lib/quote/types'

export default function QuoteCartItem({ item }: { item: CartItem }) {
  const { dispatch } = useQuote()
  const [showCustomSize, setShowCustomSize] = useState(!!item.customSizeRequest)

  return (
    <div className="flex gap-4 py-4 border-b border-cloud last:border-0">
      <div className="relative w-16 h-16 shrink-0 bg-cloud overflow-hidden">
        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="64px" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-body font-semibold text-onyx leading-tight">{item.productName}</p>
            <p className="text-xs font-body text-bark mt-0.5">{item.category}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
            aria-label={`Remove ${item.productName}`}
            className="text-driftwood hover:text-onyx transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1}
            className="w-6 h-6 flex items-center justify-center border border-cloud text-bark hover:border-terracotta hover:text-terracotta disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-body font-semibold text-onyx w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
            className="w-6 h-6 flex items-center justify-center border border-cloud text-bark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
          <span className="text-xs font-body text-bark ml-1">{item.priceFrom}</span>
        </div>

        {/* Notes */}
        <input
          type="text"
          placeholder="Add note (e.g. white only, logo embroidery)"
          value={item.notes}
          onChange={e => dispatch({ type: 'UPDATE_NOTES', id: item.id, notes: e.target.value })}
          className="mt-2 w-full text-xs font-body border border-cloud px-2 py-1.5 text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />

        {/* Custom size */}
        {!showCustomSize ? (
          <button
            onClick={() => setShowCustomSize(true)}
            className="mt-1.5 flex items-center gap-1 text-xs font-body text-terracotta hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <Ruler size={12} />
            Request custom size
          </button>
        ) : (
          <input
            type="text"
            placeholder="Describe your custom size (e.g. 100×150cm, 600 GSM)"
            value={item.customSizeRequest}
            onChange={e => dispatch({ type: 'UPDATE_CUSTOM_SIZE', id: item.id, customSizeRequest: e.target.value })}
            className="mt-1.5 w-full text-xs font-body border border-gold px-2 py-1.5 text-onyx placeholder:text-bark/60 focus:outline-none focus:ring-1 focus:ring-gold bg-linen"
            autoFocus
          />
        )}
      </div>
    </div>
  )
}
```

**Step 2: Create QuoteProductBrowser**

```tsx
// website/components/quote/QuoteProductBrowser.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { useQuote } from './QuoteContext'
import { CATALOG, PRODUCT_CATEGORIES } from '@/lib/quote/catalog'

export default function QuoteProductBrowser() {
  const { state, dispatch } = useQuote()
  const [activeCategory, setActiveCategory] = useState<string>(PRODUCT_CATEGORIES[0])

  const products = CATALOG.filter(p => p.category === activeCategory)

  function addItem(productId: string) {
    const product = CATALOG.find(p => p.id === productId)
    if (!product) return
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        category: product.category,
        productName: product.name,
        quantity: 1,
        notes: '',
        customSizeRequest: '',
        priceFrom: product.priceFrom,
        image: product.image,
      },
    })
  }

  function isInCart(productId: string) {
    return state.cartItems.some(i => i.id === productId)
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Product categories">
        {PRODUCT_CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-body font-bold uppercase tracking-[0.08em] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
              activeCategory === cat
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-bark border-cloud hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div
        role="tabpanel"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {products.map(product => {
          const inCart = isInCart(product.id)
          return (
            <div
              key={product.id}
              className="bg-white border border-cloud flex gap-4 p-4 group"
            >
              <div className="relative w-20 h-20 shrink-0 bg-cloud overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-body font-semibold text-onyx leading-tight">{product.name}</p>
                  <p className="text-xs font-body text-bark mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-xs font-body text-bark mt-1">{product.priceFrom}</p>
                </div>
                <button
                  onClick={() => addItem(product.id)}
                  disabled={inCart}
                  className={`mt-3 self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-bold uppercase tracking-[0.08em] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                    inCart
                      ? 'border-gold text-gold bg-linen cursor-default'
                      : 'border-terracotta text-terracotta hover:bg-terracotta hover:text-white'
                  }`}
                  aria-label={inCart ? `${product.name} already in quote` : `Add ${product.name} to quote`}
                >
                  {inCart ? <><Check size={12} /> In quote</> : <><Plus size={12} /> Add</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 4: Commit**
```bash
git add components/quote/QuoteCartItem.tsx components/quote/QuoteProductBrowser.tsx
git commit -m "feat(quote): product browser and cart item components"
```

---

## Task 11: Quote cart panel + Room Configurator

**Files:**
- Create: `website/components/quote/QuoteCart.tsx`
- Create: `website/components/quote/RoomConfigurator.tsx`

**Step 1: Create QuoteCart**

```tsx
// website/components/quote/QuoteCart.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useQuote } from './QuoteContext'
import QuoteCartItem from './QuoteCartItem'

export default function QuoteCart() {
  const { state } = useQuote()
  const { cartItems, isSaving, lastSaved } = state

  return (
    <div className="bg-white border border-cloud p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-terracotta" />
          <h2 className="text-sm font-heading font-semibold text-onyx uppercase tracking-[0.1em]">
            Your Quote
          </h2>
        </div>
        <span className="text-xs font-body text-bark">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-sm font-body text-bark py-4 text-center">
          Add items from the catalog to begin.
        </p>
      ) : (
        <>
          <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
            {cartItems.map(item => (
              <QuoteCartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-cloud">
            <p className="text-xs font-body text-bark mb-4">
              All pricing is indicative. Formal quote requires owner approval.
            </p>
            <Link
              href={`/quote/submit${state.session ? `?s=${state.session}` : ''}`}
              className="block w-full text-center bg-terracotta text-white px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              Submit Quote Request →
            </Link>
          </div>
        </>
      )}

      {lastSaved && (
        <p className="text-xs font-body text-bark mt-3 text-center">
          {isSaving ? 'Saving…' : `Auto-saved`}
        </p>
      )}
    </div>
  )
}
```

**Step 2: Create RoomConfigurator**

```tsx
// website/components/quote/RoomConfigurator.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuote } from './QuoteContext'
import { PRODUCT_CATEGORIES, LAUNDRY_FREQUENCY_OPTIONS } from '@/lib/quote/catalog'

export default function RoomConfigurator() {
  const { state, dispatch } = useQuote()
  const config = state.roomConfig ?? {
    roomCount: 0,
    categoriesPerRoom: [],
    laundryFrequency: '',
    notes: '',
  }

  function update(partial: Partial<typeof config>) {
    dispatch({ type: 'SET_ROOM_CONFIG', config: { ...config, ...partial } })
  }

  function toggleCategory(cat: string) {
    const cats = config.categoriesPerRoom.includes(cat)
      ? config.categoriesPerRoom.filter(c => c !== cat)
      : [...config.categoriesPerRoom, cat]
    update({ categoriesPerRoom: cats })
  }

  const isReady = config.roomCount > 0 && config.categoriesPerRoom.length > 0 && config.laundryFrequency

  return (
    <div className="space-y-8">
      {/* Room count */}
      <div>
        <label htmlFor="roomCount" className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Number of Rooms
        </label>
        <input
          id="roomCount"
          type="number"
          min={1}
          max={9999}
          value={config.roomCount || ''}
          onChange={e => update({ roomCount: Math.max(0, parseInt(e.target.value) || 0) })}
          placeholder="e.g. 24"
          className="w-40 border border-mist px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      {/* Categories per room */}
      <div>
        <p className="text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          What do you need per room?
        </p>
        <p className="text-sm font-body text-bark mb-4">Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCT_CATEGORIES.map(cat => {
            const selected = config.categoriesPerRoom.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                aria-pressed={selected}
                className={`text-left px-4 py-3 border text-sm font-body transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  selected
                    ? 'border-terracotta bg-terracotta-light/30 text-terracotta font-semibold'
                    : 'border-cloud bg-white text-bark hover:border-terracotta'
                }`}
              >
                {selected ? '✓ ' : ''}{cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Laundry frequency */}
      <div>
        <label className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Laundry / Linen Change Frequency
        </label>
        <div className="flex flex-wrap gap-2">
          {LAUNDRY_FREQUENCY_OPTIONS.map(opt => {
            const selected = config.laundryFrequency === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => update({ laundryFrequency: opt.value })}
                aria-pressed={selected}
                className={`px-4 py-2 border text-xs font-body font-semibold uppercase tracking-[0.08em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  selected
                    ? 'border-terracotta bg-terracotta text-white'
                    : 'border-cloud bg-white text-bark hover:border-terracotta'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="roomNotes" className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Additional Notes <span className="text-bark font-normal normal-case">(optional)</span>
        </label>
        <textarea
          id="roomNotes"
          rows={4}
          value={config.notes}
          onChange={e => update({ notes: e.target.value })}
          placeholder="e.g. Some rooms are suites and need extra towels. Pool area needs 50 additional pool towels. Restaurant seats 80."
          className="w-full border border-mist px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta resize-none"
        />
      </div>

      {/* CTA */}
      <div className="pt-4 border-t border-cloud">
        <p className="text-xs font-body text-bark mb-4">
          All pricing is indicative. Our team will build a full product list based on your configuration.
        </p>
        <Link
          href={isReady ? `/quote/submit${state.session ? `?s=${state.session}` : ''}` : '#'}
          aria-disabled={!isReady}
          className={`inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${
            isReady
              ? 'bg-terracotta text-white hover:bg-terracotta-deep'
              : 'bg-mist text-bark cursor-not-allowed'
          }`}
          tabIndex={isReady ? 0 : -1}
        >
          {isReady ? 'Submit Room Configuration →' : 'Complete the fields above to continue'}
        </Link>
      </div>
    </div>
  )
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 4: Commit**
```bash
git add components/quote/QuoteCart.tsx components/quote/RoomConfigurator.tsx
git commit -m "feat(quote): QuoteCart panel and RoomConfigurator component"
```

---

## Task 12: Quote builder page

**Files:**
- Create: `website/app/quote/builder/page.tsx`

**Step 1: Create builder page**

```tsx
// website/app/quote/builder/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteBuilderShell from '@/components/quote/QuoteBuilderShell'

export const metadata: Metadata = {
  title: 'Build a Quote — Dozen Hotel Supplies',
  description: 'Browse our full catalog and add items to your quote with quantities, notes, and custom size requests.',
}

export default function QuoteBuilderPage() {
  return (
    <Suspense>
      <QuoteBuilderShell />
    </Suspense>
  )
}
```

**Step 2: Create QuoteBuilderShell (client component)**

```tsx
// website/components/quote/QuoteBuilderShell.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { QuoteProvider } from './QuoteContext'
import QuoteProductBrowser from './QuoteProductBrowser'
import QuoteCart from './QuoteCart'
import RoomConfigurator from './RoomConfigurator'

type Tab = 'catalog' | 'rooms'

export default function QuoteBuilderShell() {
  const searchParams = useSearchParams()
  const session = searchParams.get('s') ?? undefined
  const defaultTab: Tab = searchParams.get('mode') === 'rooms' ? 'rooms' : 'catalog'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  return (
    <QuoteProvider initialSession={session}>
      <div className="bg-linen min-h-screen">
        {/* Builder header */}
        <div className="bg-terracotta-deep py-12 px-5 md:px-16">
          <div className="max-w-site mx-auto">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-3">
              Quote Builder
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Build Your Quote
            </h1>
            <p className="text-base font-body text-white/70 mt-2">
              Add items from the catalog, configure by rooms, or do both — all in one submission.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-cloud">
          <div className="max-w-site mx-auto px-5 md:px-16 flex gap-0">
            {(['catalog', 'rooms'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                className={`px-6 py-4 text-xs font-body font-bold uppercase tracking-[0.1em] border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset ${
                  activeTab === tab
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-bark hover:text-onyx'
                }`}
              >
                {tab === 'catalog' ? 'Browse Catalog' : 'Configure by Rooms'}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="max-w-site mx-auto px-5 md:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {activeTab === 'catalog' ? (
                <QuoteProductBrowser />
              ) : (
                <RoomConfigurator />
              )}
            </div>
            <aside>
              <QuoteCart />
            </aside>
          </div>
        </div>
      </div>
    </QuoteProvider>
  )
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 4: Commit**
```bash
git add app/quote/builder/ components/quote/QuoteBuilderShell.tsx
git commit -m "feat(quote): quote builder page with catalog + room tabs"
```

---

## Task 13: Submit form + page

**Files:**
- Create: `website/app/quote/submit/page.tsx`
- Create: `website/components/quote/QuoteSubmitForm.tsx`

**Step 1: Create submit page**

```tsx
// website/app/quote/submit/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteSubmitForm from '@/components/quote/QuoteSubmitForm'

export const metadata: Metadata = {
  title: 'Submit Your Quote — Dozen Hotel Supplies',
  description: 'Enter your details to submit your quote request to the Dozen team.',
}

export default function QuoteSubmitPage() {
  return (
    <Suspense>
      <QuoteSubmitForm />
    </Suspense>
  )
}
```

**Step 2: Create QuoteSubmitForm component**

```tsx
// website/components/quote/QuoteSubmitForm.tsx
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  property: string
}

export default function QuoteSubmitForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const session = searchParams.get('s')

  const [form, setForm] = useState<FormData>({ name: '', email: '', property: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.property.trim()) e.property = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (!session) {
      setError('No active quote session. Please go back and build your quote first.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Load current draft to get cart + room config
      const draftRes = await fetch(`/api/quote/draft/${session}`)
      const { draft } = await draftRes.json()

      if (!draft) {
        setError('Could not find your quote. Please go back and rebuild it.')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/quote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionUuid: session,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          propertyName: form.property.trim(),
          cartItems: draft.cartItems ?? [],
          roomConfig: draft.roomConfig ?? null,
        }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}))
        throw new Error(msg ?? 'Submission failed')
      }

      const { submissionId } = await res.json()
      router.push(`/quote/view/${submissionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const fields = [
    { key: 'name' as const, label: 'Your Name', type: 'text', placeholder: 'Jane Smith' },
    { key: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'jane@luxuryresort.com' },
    { key: 'property' as const, label: 'Property Name', type: 'text', placeholder: 'The Grand Zanzibar Resort' },
  ]

  return (
    <div className="bg-linen min-h-screen py-16">
      <div className="max-w-lg mx-auto px-5 md:px-8">
        <Link
          href={session ? `/quote/builder?s=${session}` : '/quote/builder'}
          className="text-xs font-body text-terracotta hover:underline hover:underline-offset-4 mb-8 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          ← Back to quote builder
        </Link>

        <div className="bg-white border border-cloud p-8" style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}>
          <div className="w-6 h-[2px] bg-gold mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-heading font-semibold text-onyx mb-2">Submit Your Quote</h1>
          <p className="text-sm font-body text-bark mb-8">
            We&apos;ll respond within 2 business days with indicative pricing. You&apos;ll receive a permanent link to view your submitted quote.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-2">
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  className={`w-full border px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors ${
                    errors[key] ? 'border-error ring-1 ring-error' : 'border-mist focus:border-terracotta'
                  }`}
                />
                {errors[key] && (
                  <p id={`${key}-error`} className="text-xs font-body text-error mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-error-light border border-error/20 px-4 py-3">
                <p className="text-sm font-body text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-terracotta text-white px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta-deep transition-colors duration-200 disabled:bg-mist disabled:text-bark disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              {submitting ? 'Submitting…' : 'Submit Quote Request →'}
            </button>

            <p className="text-xs font-body text-bark text-center">
              All pricing provided is indicative. Formal quotes require owner approval.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
```

**Step 3: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 4: Commit**
```bash
git add app/quote/submit/ components/quote/QuoteSubmitForm.tsx
git commit -m "feat(quote): quote submission form and page"
```

---

## Task 14: Quote view page

**Files:**
- Create: `website/app/quote/view/[token]/page.tsx`

**Step 1: Create view page (Server Component)**

```tsx
// website/app/quote/view/[token]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubmissionByToken } from '@/lib/quote/sheets'
import type { QuoteSubmission } from '@/lib/quote/types'

export const metadata: Metadata = {
  title: 'Your Quote — Dozen Hotel Supplies',
}

// Revalidate every 60s so status updates from team are reflected
export const revalidate = 60

export default async function QuoteViewPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const submission = await getSubmissionByToken(token).catch(() => null)

  if (!submission) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dozensupplies.com'
  const viewUrl = `${appUrl}/quote/view/${token}`

  return (
    <div className="bg-linen min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        {/* Confirmation banner */}
        <div className="bg-terracotta-deep text-white p-8 mb-8">
          <div className="w-6 h-[2px] bg-gold mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-heading font-bold mb-2">Quote Submitted</h1>
          <p className="text-base font-body text-white/75">
            We&apos;ll respond within 2 business days with indicative pricing.
          </p>
        </div>

        {/* Permanent URL callout */}
        <div className="bg-white border border-cloud p-6 mb-6" style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}>
          <p className="text-xs font-body font-bold uppercase tracking-[0.1em] text-gold mb-2">
            Bookmark this page
          </p>
          <p className="text-sm font-body text-bark mb-3">
            This link is permanent. Return any time to view your submitted quote.
          </p>
          <code className="block text-xs font-mono bg-linen px-3 py-2 text-onyx break-all select-all">
            {viewUrl}
          </code>
        </div>

        {/* Submission details */}
        <div className="bg-white border border-cloud p-6 mb-6">
          <h2 className="text-lg font-heading font-semibold text-onyx mb-4">Submission Details</h2>
          <dl className="space-y-2 text-sm font-body">
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Property</dt>
              <dd className="text-onyx font-semibold">{submission.propertyName}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Contact</dt>
              <dd className="text-onyx">{submission.customerName} — {submission.customerEmail}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Submitted</dt>
              <dd className="text-onyx">{new Date(submission.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Type</dt>
              <dd className="text-onyx capitalize">{submission.submissionType === 'both' ? 'Catalog items + Room configuration' : submission.submissionType === 'catalog' ? 'Catalog items' : 'Room configuration'}</dd>
            </div>
          </dl>
        </div>

        {/* Cart items */}
        {submission.cartItems.length > 0 && (
          <div className="bg-white border border-cloud p-6 mb-6">
            <h2 className="text-lg font-heading font-semibold text-onyx mb-4">
              Catalog Items ({submission.cartItems.length})
            </h2>
            <ul className="space-y-3">
              {submission.cartItems.map(item => (
                <li key={item.id} className="text-sm font-body border-b border-cloud pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between gap-4">
                    <span className="text-onyx font-semibold">{item.productName}</span>
                    <span className="text-bark shrink-0">×{item.quantity}</span>
                  </div>
                  <span className="text-bark text-xs">{item.category}</span>
                  {item.notes && <p className="text-bark mt-1">Note: {item.notes}</p>}
                  {item.customSizeRequest && (
                    <p className="text-bark mt-1 italic">Custom size: {item.customSizeRequest}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Room config */}
        {submission.roomConfig && (
          <div className="bg-white border border-cloud p-6 mb-6">
            <h2 className="text-lg font-heading font-semibold text-onyx mb-4">Room Configuration</h2>
            <dl className="space-y-2 text-sm font-body">
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Rooms</dt>
                <dd className="text-onyx font-semibold">{submission.roomConfig.roomCount}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Categories</dt>
                <dd className="text-onyx">{submission.roomConfig.categoriesPerRoom.join(', ')}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Laundry frequency</dt>
                <dd className="text-onyx capitalize">{submission.roomConfig.laundryFrequency.replace(/-/g, ' ')}</dd>
              </div>
              {submission.roomConfig.notes && (
                <div className="flex gap-4">
                  <dt className="text-bark w-40 shrink-0">Notes</dt>
                  <dd className="text-onyx">{submission.roomConfig.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/quote/builder"
            className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            Submit a new quote
          </Link>
          <a
            href="mailto:info@dozensupplies.com"
            className="inline-flex items-center justify-center text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:underline hover:underline-offset-4 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            Contact us directly
          </a>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: TypeScript check**
```bash
cd website && npx tsc --noEmit 2>&1 | head -20
```

**Step 3: Commit**
```bash
git add app/quote/view/
git commit -m "feat(quote): permanent quote view page"
```

---

## Task 15: Full build + Lighthouse + review prep

**Step 1: Clean build**
```bash
cd website && npx next build 2>&1 | tail -10
```
Expected: 0 errors, all pages static or dynamic as expected.

**Step 2: Start production server**
```bash
npx next start -p 3011 &
sleep 4 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3011/quote
```
Expected: 200

**Step 3: Smoke test all new routes**
```bash
# Landing page
curl -s -o /dev/null -w "quote landing: %{http_code}\n" http://localhost:3011/quote
# Builder
curl -s -o /dev/null -w "builder: %{http_code}\n" http://localhost:3011/quote/builder
# Submit
curl -s -o /dev/null -w "submit: %{http_code}\n" "http://localhost:3011/quote/submit?s=00000000-0000-4000-8000-000000000000"
```
Expected: all 200

**Step 4: Test submit API with valid payload**
```bash
curl -s -X POST http://localhost:3011/api/quote/draft \
  -H "Content-Type: application/json" \
  -d '{"sessionUuid":"00000000-0000-4000-8000-000000000001","cartItems":[],"roomConfig":null}' | node -e "process.stdin||(x=>{let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d)))})()"
```
Expected: `{ ok: true }`

**Step 5: Test rate limiter**
```bash
for i in {1..12}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3011/api/quote/draft \
    -H "Content-Type: application/json" -d '{"sessionUuid":"invalid","cartItems":[],"roomConfig":null}'
done
```
Expected: first 10 return 400 (invalid session), 11th and 12th return 429.

**Step 6: Lighthouse on /quote/builder (desktop)**
```bash
npx lighthouse http://localhost:3011/quote/builder --preset=desktop --output=json --output-path=./lh-builder.json --chrome-flags="--headless --no-sandbox" --quiet 2>/dev/null
node -e "const r=require('./lh-builder.json'),c=r.categories;console.log('Perf:',Math.round(c.performance.score*100),'A11y:',Math.round(c.accessibility.score*100),'BP:',Math.round(c['best-practices'].score*100),'SEO:',Math.round(c.seo.score*100))"
```
Expected: A11y ≥ 90, BP ≥ 90, SEO ≥ 90. Performance target ≥ 85 (interactive page, some JS budget used).

**Step 7: Commit all Lighthouse output files to .gitignore**
```bash
echo "website/lh-*.json" >> .gitignore
git add .gitignore
git commit -m "chore: gitignore Lighthouse output files"
```

---

## Task 16: Code review + security audit

Dispatch in parallel:

**code-reviewer agent:** Review all files in `website/lib/quote/`, `website/components/quote/`, `website/app/quote/`, `website/app/api/quote/`. Check: type safety, error handling, edge cases, Next.js App Router conventions, accessibility in components.

**security-auditor agent:** Review all API routes in `website/app/api/quote/`. Check: input validation (zod schemas cover all fields), rate limiting covers all mutation endpoints, no env vars leaked to client, no SQL/Sheets injection via unsanitised user input, CORS headers on API routes, idempotency key handling on submit.

Apply all findings before final commit.

---

## Task 17: QA pass

**qa-expert agent:** Test the following scenarios end-to-end against the running production server:

1. **Catalog-only happy path:** Visit `/quote/builder`, add 3 items with different quantities and notes, navigate to `/quote/submit?s=[session]`, submit → should land on `/quote/view/[token]` with all items shown correctly.

2. **Rooms-only happy path:** Visit `/quote/builder?mode=rooms`, configure 12 rooms, select 3 categories, set laundry frequency, add notes, submit → view page shows room config, no cart items section.

3. **Combined path:** Add catalog items AND complete room config in the same session, submit → view page shows both sections.

4. **Custom size request:** Add a catalog item, click "Request custom size", enter dimensions, submit → view page shows custom size under that item.

5. **Draft persistence:** Add items, close tab, re-visit `/quote/builder?s=[same-session]` → cart should be restored.

6. **Rate limit:** POST to `/api/quote/draft` 11 times in 1 minute from the same IP → 11th should return 429.

7. **Invalid token:** Visit `/quote/view/not-a-real-token` → should return 404 page, not a 500 error.

8. **Empty submission:** Visit `/quote/submit` without building a quote, attempt submit → should show error "Could not find your quote".

9. **Accessibility:** Tab through the entire builder flow with keyboard only. All interactive elements must be reachable and operable.

---

## Post-Sprint Checklist

- [ ] All 4 original Lighthouse pages still ≥ 90 (no regressions from landing page change)
- [ ] `/quote/builder` Lighthouse A11y ≥ 90
- [ ] Google Sheets "Quote Drafts" and "Quote Submissions" tabs exist and headers match schema
- [ ] `.env.local` has all required vars documented (values in `.env.example` with placeholders)
- [ ] `docs/3-decisions.md` updated with any architectural decisions made during implementation
- [ ] Lighthouse output files in `.gitignore`
- [ ] `workflows/quote-submission.md` SOP written for recurring "process incoming quote request" workflow
