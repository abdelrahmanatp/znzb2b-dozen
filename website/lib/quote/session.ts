// website/lib/quote/session.ts

export function generateSession(): string {
  return crypto.randomUUID()
}

export function isValidSession(session: unknown): session is string {
  if (typeof session !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session)
}
