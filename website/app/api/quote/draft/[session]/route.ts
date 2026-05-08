// website/app/api/quote/draft/[session]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDraftBySession } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { session } = await params
  if (!isValidSession(session)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }
  try {
    const draft = await getDraftBySession(session)
    if (!draft) return NextResponse.json({ draft: null })
    return NextResponse.json({ draft })
  } catch (err) {
    console.error('[quote/draft GET]:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to retrieve draft' }, { status: 500 })
  }
}
