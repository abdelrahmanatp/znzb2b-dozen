// website/components/quote/QuoteBuilderShell.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { QuoteProvider } from './QuoteContext'
import QuoteProductBrowser from './QuoteProductBrowser'
import QuoteCart from './QuoteCart'
import RoomConfigurator from './RoomConfigurator'

type Tab = 'catalog' | 'rooms'

export default function QuoteBuilderShell() {
  const searchParams = useSearchParams()
  const session = searchParams.get('s') ?? undefined
  const defaultTab: Tab = searchParams.get('mode') === 'rooms' ? 'rooms' : 'catalog'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  return (
    <QuoteProvider initialSession={session}>
      <div className="bg-linen min-h-screen">
        {/* Builder header */}
        <div className="bg-terracotta-deep py-12 px-5 md:px-16">
          <div className="max-w-site mx-auto">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-3">
              Quote Builder
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Build Your Quote
            </h1>
            <p className="text-base font-body text-white/70 mt-2">
              Add items from the catalog, configure by rooms, or do both — all in one submission.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-white border-b border-cloud">
          <div className="max-w-site mx-auto px-5 md:px-16 flex gap-0">
            {(['catalog', 'rooms'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                className={`px-6 py-4 text-xs font-body font-bold uppercase tracking-[0.1em] border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset ${
                  activeTab === tab
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-bark hover:text-onyx'
                }`}
              >
                {tab === 'catalog' ? 'Browse Catalog' : 'Configure by Rooms'}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="max-w-site mx-auto px-5 md:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {activeTab === 'catalog' ? (
                <QuoteProductBrowser />
              ) : (
                <RoomConfigurator />
              )}
            </div>
            <aside>
              <QuoteCart />
            </aside>
          </div>
        </div>
      </div>
    </QuoteProvider>
  )
}
