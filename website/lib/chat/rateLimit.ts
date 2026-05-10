// website/lib/chat/rateLimit.ts
// Upstash Redis sliding window. Falls back to allow-all if env vars missing (dev mode).

let ratelimit: { limit: (key: string) => Promise<{ success: boolean }> } | null = null

async function getRatelimit() {
  if (ratelimit) return ratelimit

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token || url.includes('your_upstash')) {
    return { limit: async () => ({ success: true }) }
  }

  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: false,
  })

  return ratelimit
}

export async function checkChatRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const rl = await getRatelimit()
  const { success } = await rl.limit(`chat:${ip}`)
  return { allowed: success }
}
