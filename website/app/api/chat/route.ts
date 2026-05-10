// website/app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { checkChatRateLimit } from '@/lib/chat/rateLimit'
import { buildSystemPrompt } from '@/lib/chat/systemPrompt'
import { collectLeadInfoTool } from '@/lib/chat/tools'
import { submitChatLead } from '@/lib/chat/sheets'

export const runtime = 'nodejs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function sanitizeInput(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 2000)
}

export async function POST(req: Request): Promise<Response> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { allowed } = await checkChatRateLimit(ip)
  if (!allowed) {
    return Response.json(
      { error: 'Too many messages. Please wait a moment.' },
      { status: 429 }
    )
  }

  let messages: Array<{ role: 'user' | 'assistant'; content: string }>
  let sessionId: string
  try {
    const body = await req.json()
    messages = body.messages
    sessionId = body.sessionId ?? 'unknown'
    if (!Array.isArray(messages) || messages.length === 0) throw new Error()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const sanitized = messages.slice(-20).map((m) => ({
    ...m,
    content: m.role === 'user' ? sanitizeInput(m.content) : m.content,
  }))

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      const send = (payload: object) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        )

      try {
        const stream = anthropic.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: sanitized,
          tools: [collectLeadInfoTool],
        })

        let preToolTextSent = false
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            send({ text: event.delta.text })
            preToolTextSent = true
          }
        }

        const finalMsg = await stream.finalMessage()

        if (finalMsg.stop_reason === 'tool_use') {
          const toolBlock = finalMsg.content.find(
            (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
          )

          if (toolBlock && toolBlock.name === 'collect_lead_info') {
            const input = toolBlock.input as {
              name: string
              hotel: string
              email: string
              product_interest: string
              room_count: string
            }

            let sheetsOk = false
            try {
              await submitChatLead({
                name: input.name,
                hotel: input.hotel,
                email: input.email,
                productInterest: input.product_interest,
                roomCount: input.room_count,
                sessionId,
              })
              sheetsOk = true
            } catch (err) {
              console.error('[chat] Sheets write failed:', err)
            }

            send({ lead_captured: true, sheets_ok: sheetsOk })

            const ack = await anthropic.messages.create({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 256,
              system: buildSystemPrompt(),
              messages: [
                ...sanitized,
                { role: 'assistant', content: finalMsg.content },
                {
                  role: 'user',
                  content: [
                    {
                      type: 'tool_result',
                      tool_use_id: toolBlock.id,
                      content: 'Lead saved successfully.',
                    },
                  ],
                },
              ],
              tools: [collectLeadInfoTool],
            })

            const ackText = ack.content
              .filter((b): b is Anthropic.TextBlock => b.type === 'text')
              .map((b) => b.text)
              .join('')

            if (ackText) send({ text: preToolTextSent ? '\n\n' + ackText : ackText })
          }
        }
      } catch (err) {
        console.error('[chat] Stream error:', err)
        send({
          text: "I'm having trouble connecting right now. Please try again in a moment, or reach us at info@dozensupplies.com.",
        })
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
