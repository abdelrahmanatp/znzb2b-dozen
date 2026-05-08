// website/lib/quote/sheets.ts
import { google } from 'googleapis'
import type { QuoteDraft, QuoteSubmission } from './types'

// Prevent formula injection: prefix values starting with dangerous chars
function sanitizeCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`
  return value
}

function safeParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T } catch { return fallback }
}

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

const DRAFTS_RANGE = 'Quote Drafts'
const SUBMISSIONS_RANGE = 'Quote Submissions'

// ── Quote Drafts ──────────────────────────────────────────────────────────────

export async function upsertDraft(draft: Omit<QuoteDraft, 'createdAt' | 'updatedAt'> & { createdAt?: string }): Promise<void> {
  const sheets = getSheets()
  const id = SPREADSHEET_ID()
  const now = new Date().toISOString()

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
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: `${DRAFTS_RANGE}!A:A`,
    })
    const rows = res.data.values ?? []
    const rowIndex = rows.findIndex(r => r[0] === draft.sessionUuid)
    if (rowIndex < 1) {
      console.warn('[sheets] upsertDraft: existing draft not found by index, appending')
      await sheets.spreadsheets.values.append({
        spreadsheetId: id,
        range: `${DRAFTS_RANGE}!A:F`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      })
      return
    }
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `${DRAFTS_RANGE}!A${rowIndex + 1}:F${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: id,
      range: `${DRAFTS_RANGE}!A:F`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  }
}

export async function getDraftBySession(sessionUuid: string): Promise<QuoteDraft | null> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${DRAFTS_RANGE}!A:F`,
  })
  const rows = res.data.values ?? []
  const row = rows.find(r => r[0] === sessionUuid)
  if (!row) return null
  return {
    sessionUuid: row[0],
    createdAt: row[1] ?? '',
    updatedAt: row[2] ?? '',
    cartItems: safeParse(row[3] ?? '', []),
    roomConfig: row[4] ? safeParse(row[4], null) : null,
    status: (row[5] as 'active' | 'submitted') ?? 'active',
  }
}

// ── Quote Submissions ─────────────────────────────────────────────────────────

export async function createSubmission(sub: QuoteSubmission): Promise<void> {
  const sheets = getSheets()
  const row = [
    sub.submissionId,
    sub.sessionUuid,
    sub.submittedAt,
    sanitizeCell(sub.customerName),
    sanitizeCell(sub.customerEmail),
    sanitizeCell(sub.propertyName),
    sub.submissionType,
    JSON.stringify(sub.cartItems ?? []),
    sub.roomConfig ? JSON.stringify(sub.roomConfig) : '',
    sub.roomConfig?.roomCount ?? 0,
    sanitizeCell(sub.roomConfig?.laundryFrequency ?? ''),
    sanitizeCell(sub.roomConfig?.notes ?? ''),
    sub.status,
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SUBMISSIONS_RANGE}!A:M`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
  // Mark the draft as submitted (non-blocking — submission is the source of truth)
  upsertDraft({
    sessionUuid: sub.sessionUuid,
    cartItems: sub.cartItems,
    roomConfig: sub.roomConfig,
    status: 'submitted',
  }).catch(e => console.warn('[sheets] draft status update failed:', (e as Error).message))
}

export async function getSubmissionByToken(token: string): Promise<QuoteSubmission | null> {
  const sheets = getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SUBMISSIONS_RANGE}!A:M`,
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
    submissionType: (row[6] as 'catalog' | 'rooms' | 'both') ?? 'catalog',
    cartItems: safeParse(row[7] ?? '', []),
    roomConfig: row[8] ? safeParse(row[8], null) : null,
    status: (row[12] as 'new' | 'viewed' | 'quoted') ?? 'new',
  }
}
