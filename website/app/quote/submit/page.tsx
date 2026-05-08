// website/app/quote/submit/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteSubmitForm from '@/components/quote/QuoteSubmitForm'

export const metadata: Metadata = {
  title: 'Submit Your Quote — Dozen Hotel Supplies',
  description: 'Enter your details to submit your quote request to the Dozen team.',
}

export default function QuoteSubmitPage() {
  return (
    <Suspense>
      <QuoteSubmitForm />
    </Suspense>
  )
}
