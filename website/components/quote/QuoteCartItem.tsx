// website/components/quote/QuoteCartItem.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, X, Ruler } from 'lucide-react'
import { useQuote } from './QuoteContext'
import type { CartItem } from '@/lib/quote/types'

export default function QuoteCartItem({ item }: { item: CartItem }) {
  const { dispatch } = useQuote()
  const [showCustomSize, setShowCustomSize] = useState(!!item.customSizeRequest)

  return (
    <div className="flex gap-4 py-4 border-b border-cloud last:border-0">
      <div className="relative w-16 h-16 shrink-0 bg-cloud overflow-hidden">
        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="64px" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-body font-semibold text-onyx leading-tight">{item.productName}</p>
            <p className="text-xs font-body text-bark mt-0.5">{item.category}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
            aria-label={`Remove ${item.productName}`}
            className="text-bark hover:text-onyx transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1}
            className="w-6 h-6 flex items-center justify-center border border-cloud text-bark hover:border-terracotta hover:text-terracotta disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-body font-semibold text-onyx w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
            className="w-6 h-6 flex items-center justify-center border border-cloud text-bark hover:border-terracotta hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
          <span className="text-xs font-body text-bark ml-1">{item.priceFrom}</span>
        </div>

        {/* Notes */}
        <input
          type="text"
          placeholder="Add note (e.g. white only, logo embroidery)"
          value={item.notes}
          onChange={e => dispatch({ type: 'UPDATE_NOTES', id: item.id, notes: e.target.value })}
          className="mt-2 w-full text-xs font-body border border-cloud px-2 py-1.5 text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />

        {/* Custom size */}
        {!showCustomSize ? (
          <button
            onClick={() => setShowCustomSize(true)}
            className="mt-1.5 flex items-center gap-1 text-xs font-body text-terracotta hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <Ruler size={12} />
            Request custom size
          </button>
        ) : (
          <input
            type="text"
            placeholder="Describe your custom size (e.g. 100×150cm, 600 GSM)"
            value={item.customSizeRequest}
            onChange={e => dispatch({ type: 'UPDATE_CUSTOM_SIZE', id: item.id, customSizeRequest: e.target.value })}
            className="mt-1.5 w-full text-xs font-body border border-gold px-2 py-1.5 text-onyx placeholder:text-bark/60 focus:outline-none focus:ring-1 focus:ring-gold bg-linen"
            autoFocus
          />
        )}
      </div>
    </div>
  )
}
