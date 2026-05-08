// website/app/api/quote/draft/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { upsertDraft } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'

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
  sessionUuid: z.string().refine(isValidSession, 'Invalid session UUID'),
  cartItems: z.array(CartItemSchema).max(100),
  roomConfig: z.object({
    roomCount: z.number().int().min(1).max(10_000),
    categoriesPerRoom: z.array(z.string().max(100)).max(20),
    laundryFrequency: z.string().max(100),
    notes: z.string().max(1000),
  }).nullable(),
})

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

  try {
    await upsertDraft({ ...parsed.data, status: 'active' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[quote/draft POST]:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
