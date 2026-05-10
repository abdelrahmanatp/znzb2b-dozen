// website/lib/chat/tools.ts
import type Anthropic from '@anthropic-ai/sdk'

export const collectLeadInfoTool: Anthropic.Tool = {
  name: 'collect_lead_info',
  description:
    "Call this tool once you have naturally collected all required quote details: full name, property name, email, products of interest, and approximate quantity or room count. Do not call it speculatively — only when you have all five confirmed. This saves the lead and triggers a follow-up from the Dozen team.",
  input_schema: {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: "Visitor's full name as they provided it",
      },
      hotel: {
        type: 'string',
        description: 'Property or hotel name',
      },
      email: {
        type: 'string',
        description: 'Email address',
      },
      product_interest: {
        type: 'string',
        description: 'Summary of products they want (e.g. "bath towels 70x140cm, bathrobes")',
      },
      room_count: {
        type: 'string',
        description: 'Number of rooms or approximate quantity needed (e.g. "42 rooms" or "200 units")',
      },
    },
    required: ['name', 'hotel', 'email', 'product_interest', 'room_count'],
  },
}
