// website/lib/quote/email.ts
import nodemailer from 'nodemailer'
import type { QuoteSubmission } from './types'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
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
        `<li><strong>${esc(item.productName)}</strong> × ${item.quantity}${item.notes ? ` — <em>${esc(item.notes)}</em>` : ''}${item.customSizeRequest ? ` [Custom size: ${esc(item.customSizeRequest)}]` : ''}</li>`
      ).join('')}</ul>`
    : ''

  const roomHtml = submission.roomConfig
    ? `<h3>Room Configuration</h3>
       <ul>
         <li>Rooms: ${submission.roomConfig.roomCount}</li>
         <li>Categories per room: ${esc(submission.roomConfig.categoriesPerRoom.join(', '))}</li>
         <li>Laundry frequency: ${esc(submission.roomConfig.laundryFrequency)}</li>
         ${submission.roomConfig.notes ? `<li>Notes: ${esc(submission.roomConfig.notes)}</li>` : ''}
       </ul>`
    : ''

  const viewLink = `${appUrl}/quote/view/${submission.submissionId}`

  const html = `
    <h2>New Quote Request — Dozen Hotel Supplies</h2>
    <p><strong>Customer:</strong> ${esc(submission.customerName)}</p>
    <p><strong>Property:</strong> ${esc(submission.propertyName)}</p>
    <p><strong>Email:</strong> <a href="mailto:${esc(submission.customerEmail)}">${esc(submission.customerEmail)}</a></p>
    <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString('en-GB', { timeZone: 'Africa/Dar_es_Salaam' })} EAT</p>
    <p><strong>View quote:</strong> <a href="${esc(viewLink)}">${esc(viewLink)}</a></p>
    <hr />
    ${cartHtml}
    ${roomHtml}
  `

  const safeSubject = `New Quote: ${submission.propertyName.replace(/[\r\n]/g, '')} — ${submission.customerName.replace(/[\r\n]/g, '')}`

  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Dozen Quote System" <${process.env.SMTP_USER}>`,
    to: teamEmail,
    subject: safeSubject,
    html,
  })
}
