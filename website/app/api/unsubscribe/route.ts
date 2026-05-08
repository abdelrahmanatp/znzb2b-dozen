import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: string; token?: string }
  const { email, token } = body

  console.log('[unsubscribe] Unsubscribe request received', {
    email,
    token,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for') ?? 'unknown',
  })

  return NextResponse.json({ success: true })
}
