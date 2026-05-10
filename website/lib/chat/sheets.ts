// website/lib/chat/sheets.ts
import { google } from 'googleapis'

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function sanitize(v: string): string {
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v
}

export interface ChatLead {
  name: string
  hotel: string
  email: string
  productInterest: string
  roomCount: string
  sessionId: string
}

export async function submitChatLead(lead: ChatLead): Promise<void> {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const id = process.env.GOOGLE_SHEETS_QUOTE_ID
  if (!id) throw new Error('GOOGLE_SHEETS_QUOTE_ID not set')

  const now = new Date().toISOString()
  const submissionId = `chat-${lead.sessionId}-${Date.now()}`

  const row = [
    submissionId,
    lead.sessionId,
    now,
    sanitize(lead.name),
    sanitize(lead.hotel),
    sanitize(lead.email),
    'website-widget',
    JSON.stringify([]),
    '',
    0,
    sanitize(lead.roomCount),
    sanitize(lead.productInterest),
    'new',
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range: 'Quote Submissions!A:M',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  })
}
