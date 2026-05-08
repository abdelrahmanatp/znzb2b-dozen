// website/app/api/quote/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSubmission } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'
import { sendWhatsAppAlert } from '@/lib/quote/twilio'
import { sendTeamNotification } from '@/lib/quote/email'
import type { QuoteSubmission } from '@/lib/quote/types'

const CartItemSchema = z.object({
  id: z.string().max(100),
  category: z.string().max(100),
  productName: z.string().max(200),
  quantity: z.number().int().min(1).max(100_000),
  notes: z.string().max(500),
  customSizeRequest: z.string().max(500),
  priceFrom: z.string().max(100),
  image: z.string().url().max(500),
})

const Body = z.object({
  sessionUuid: z.string().refine(isValidSession),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email().max(254),
  propertyName: z.string().min(2).max(200),
  cartItems: z.array(CartItemSchema).max(100),
  roomConfig: z.object({
    roomCount: z.number().int().min(1).max(10_000),
    categoriesPerRoom: z.array(z.string().max(100)).max(20),
    laundryFrequency: z.string().max(100),
    notes: z.string().max(1000),
  }).nullable(),
}).refine(
  d => d.cartItems.length > 0 || d.roomConfig !== null,
  'Submission must include at least a catalog item or a room configuration'
)

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
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
    console.error('[quote/submit] Sheets write failed:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }

  // Await notifications so serverless runtime doesn't terminate them early
  await Promise.allSettled([
    sendWhatsAppAlert(submission).catch(e => console.error('[Twilio]', (e as Error).message)),
    sendTeamNotification(submission).catch(e => console.error('[Email]', (e as Error).message)),
  ])

  return NextResponse.json({ submissionId: submission.submissionId })
}
