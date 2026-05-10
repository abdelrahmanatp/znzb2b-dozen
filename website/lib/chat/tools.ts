// website/lib/chat/tools.ts
import type Anthropic from '@anthropic-ai/sdk'

export const collectLeadInfoTool: Anthropic.Tool = {
  name: 'collect_lead_info',
  description:
    "Call this tool once you have naturally collected the visitor's full name, property name, and email address through conversation. Do not call it speculatively — only when you have all three confirmed values. This saves the lead and triggers a follow-up from the Dozen team.",
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
        description: 'Brief summary of what products they are interested in',
      },
    },
    required: ['name', 'hotel', 'email'],
  },
}
