// website/components/quote/QuoteCart.tsx
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useQuote } from './QuoteContext'
import QuoteCartItem from './QuoteCartItem'

export default function QuoteCart() {
  const { state } = useQuote()
  const { cartItems, isSaving, lastSaved } = state

  return (
    <div className="bg-white border border-cloud p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-terracotta" />
          <h2 className="text-sm font-heading font-semibold text-onyx uppercase tracking-[0.1em]">
            Your Quote
          </h2>
        </div>
        <span className="text-xs font-body text-bark">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-sm font-body text-bark py-4 text-center">
          Add items from the catalog to begin.
        </p>
      ) : (
        <>
          <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1">
            {cartItems.map(item => (
              <QuoteCartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-cloud">
            <p className="text-xs font-body text-bark mb-4">
              All pricing is indicative. Formal quote requires owner approval.
            </p>
            <Link
              href={`/quote/submit${state.session ? `?s=${state.session}` : ''}`}
              className="block w-full text-center bg-terracotta text-white px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              Submit Quote Request →
            </Link>
          </div>
        </>
      )}

      {lastSaved && (
        <p className="text-xs font-body text-bark mt-3 text-center">
          {isSaving ? 'Saving…' : `Auto-saved`}
        </p>
      )}
    </div>
  )
}
