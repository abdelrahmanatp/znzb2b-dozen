// website/components/quote/QuoteProductBrowser.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { useQuote } from './QuoteContext'
import { CATALOG, PRODUCT_CATEGORIES } from '@/lib/quote/catalog'

export default function QuoteProductBrowser() {
  const { state, dispatch } = useQuote()
  const [activeCategory, setActiveCategory] = useState<string>(PRODUCT_CATEGORIES[0])

  const products = CATALOG.filter(p => p.category === activeCategory)

  function addItem(productId: string) {
    const product = CATALOG.find(p => p.id === productId)
    if (!product) return
    dispatch({
      type: 'ADD_ITEM',
      item: {
        id: product.id,
        category: product.category,
        productName: product.name,
        quantity: 1,
        notes: '',
        customSizeRequest: '',
        priceFrom: product.priceFrom,
        image: product.image,
      },
    })
  }

  function isInCart(productId: string) {
    return state.cartItems.some(i => i.id === productId)
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Product categories">
        {PRODUCT_CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-body font-bold uppercase tracking-[0.08em] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
              activeCategory === cat
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-white text-bark border-cloud hover:border-terracotta hover:text-terracotta'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div
        role="tabpanel"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {products.map(product => {
          const inCart = isInCart(product.id)
          return (
            <div
              key={product.id}
              className="bg-white border border-cloud flex gap-4 p-4 group"
            >
              <div className="relative w-20 h-20 shrink-0 bg-cloud overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-body font-semibold text-onyx leading-tight">{product.name}</p>
                  <p className="text-xs font-body text-bark mt-1 line-clamp-2">{product.description}</p>
                  <p className="text-xs font-body text-bark mt-1">{product.priceFrom}</p>
                </div>
                <button
                  onClick={() => addItem(product.id)}
                  disabled={inCart}
                  className={`mt-3 self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-bold uppercase tracking-[0.08em] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                    inCart
                      ? 'border-gold text-gold bg-linen cursor-default'
                      : 'border-terracotta text-terracotta hover:bg-terracotta hover:text-white'
                  }`}
                  aria-label={inCart ? `${product.name} already in quote` : `Add ${product.name} to quote`}
                >
                  {inCart ? <><Check size={12} /> In quote</> : <><Plus size={12} /> Add</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
