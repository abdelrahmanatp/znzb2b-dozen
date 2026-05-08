// website/app/api/quote/view/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSubmissionByToken } from '@/lib/quote/sheets'
import { isValidSession } from '@/lib/quote/session'
import { checkRateLimit } from '@/lib/quote/rateLimit'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { token } = await params
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  try {
    const submission = await getSubmissionByToken(token)
    if (!submission) return NextResponse.json({ submission: null }, { status: 404 })
    return NextResponse.json({ submission })
  } catch (err) {
    console.error('[quote/view GET]:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to retrieve submission' }, { status: 500 })
  }
}
