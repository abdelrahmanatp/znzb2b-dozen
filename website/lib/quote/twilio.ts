// website/lib/quote/twilio.ts
import twilio from 'twilio'
import type { QuoteSubmission } from './types'

function stripControl(s: string): string {
  return s.replace(/[\r\n\t]/g, ' ').trim()
}

export async function sendWhatsAppAlert(submission: QuoteSubmission): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const to = process.env.TWILIO_WHATSAPP_TO

  if (!accountSid || !authToken || !from || !to) {
    console.warn('[Twilio] Missing env vars — skipping WhatsApp alert')
    return
  }

  const typeLabel: Record<QuoteSubmission['submissionType'], string> = {
    catalog: `${submission.cartItems.length} item${submission.cartItems.length !== 1 ? 's' : ''} across ${new Set(submission.cartItems.map(i => i.category)).size} categories`,
    rooms: `${submission.roomConfig?.roomCount ?? 0} rooms, ${submission.roomConfig?.categoriesPerRoom.length ?? 0} categories selected`,
    both: `${submission.cartItems.length} catalog items + ${submission.roomConfig?.roomCount ?? 0} rooms`,
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dozensupplies.com'
  const sheetsUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_QUOTE_ID}`

  const body = [
    `🏨 New Quote Request — Dozen`,
    `Customer: ${stripControl(submission.customerName)} | ${stripControl(submission.propertyName)}`,
    `Email: ${stripControl(submission.customerEmail)}`,
    `Type: ${submission.submissionType} — ${typeLabel[submission.submissionType]}`,
    `View quote: ${appUrl}/quote/view/${submission.submissionId}`,
    `Sheets: ${sheetsUrl}`,
  ].join('\n')

  const client = twilio(accountSid, authToken)
  await client.messages.create({ from, to, body })
}
