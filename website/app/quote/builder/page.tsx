// website/app/quote/builder/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteBuilderShell from '@/components/quote/QuoteBuilderShell'

export const metadata: Metadata = {
  title: 'Build a Quote — Dozen Hotel Supplies',
  description: 'Browse our full catalog and add items to your quote with quantities, notes, and custom size requests.',
}

export default function QuoteBuilderPage() {
  return (
    <Suspense>
      <QuoteBuilderShell />
    </Suspense>
  )
}
