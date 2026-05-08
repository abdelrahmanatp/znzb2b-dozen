// website/components/quote/RoomConfigurator.tsx
'use client'

import Link from 'next/link'
import { useQuote } from './QuoteContext'
import { PRODUCT_CATEGORIES, LAUNDRY_FREQUENCY_OPTIONS } from '@/lib/quote/catalog'

export default function RoomConfigurator() {
  const { state, dispatch } = useQuote()
  const config = state.roomConfig ?? {
    roomCount: 0,
    categoriesPerRoom: [],
    laundryFrequency: '',
    notes: '',
  }

  function update(partial: Partial<typeof config>) {
    dispatch({ type: 'SET_ROOM_CONFIG', config: { ...config, ...partial } })
  }

  function toggleCategory(cat: string) {
    const cats = config.categoriesPerRoom.includes(cat)
      ? config.categoriesPerRoom.filter(c => c !== cat)
      : [...config.categoriesPerRoom, cat]
    update({ categoriesPerRoom: cats })
  }

  const isReady = config.roomCount > 0 && config.categoriesPerRoom.length > 0 && config.laundryFrequency

  return (
    <div className="space-y-8">
      {/* Room count */}
      <div>
        <label htmlFor="roomCount" className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Number of Rooms
        </label>
        <input
          id="roomCount"
          type="number"
          min={1}
          max={9999}
          value={config.roomCount || ''}
          onChange={e => update({ roomCount: Math.max(0, Math.min(10000, parseInt(e.target.value, 10) || 0)) })}
          placeholder="e.g. 24"
          className="w-40 border border-mist px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      {/* Categories per room */}
      <div>
        <p className="text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          What do you need per room?
        </p>
        <p className="text-sm font-body text-bark mb-4">Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRODUCT_CATEGORIES.map(cat => {
            const selected = config.categoriesPerRoom.includes(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                aria-pressed={selected}
                className={`text-left px-4 py-3 border text-sm font-body transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  selected
                    ? 'border-terracotta bg-terracotta-light/30 text-terracotta font-semibold'
                    : 'border-cloud bg-white text-bark hover:border-terracotta'
                }`}
              >
                {selected ? '✓ ' : ''}{cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Laundry frequency */}
      <div>
        <label className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Laundry / Linen Change Frequency
        </label>
        <div className="flex flex-wrap gap-2">
          {LAUNDRY_FREQUENCY_OPTIONS.map(opt => {
            const selected = config.laundryFrequency === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => update({ laundryFrequency: opt.value })}
                aria-pressed={selected}
                className={`px-4 py-2 border text-xs font-body font-semibold uppercase tracking-[0.08em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  selected
                    ? 'border-terracotta bg-terracotta text-white'
                    : 'border-cloud bg-white text-bark hover:border-terracotta'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="roomNotes" className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-3">
          Additional Notes <span className="text-bark font-normal normal-case">(optional)</span>
        </label>
        <textarea
          id="roomNotes"
          rows={4}
          value={config.notes}
          onChange={e => update({ notes: e.target.value })}
          placeholder="e.g. Some rooms are suites and need extra towels. Pool area needs 50 additional pool towels. Restaurant seats 80."
          className="w-full border border-mist px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta resize-none"
        />
      </div>

      {/* CTA */}
      <div className="pt-4 border-t border-cloud">
        <p className="text-xs font-body text-bark mb-4">
          All pricing is indicative. Our team will build a full product list based on your configuration.
        </p>
        {isReady ? (
          <Link
            href={`/quote/submit${state.session ? `?s=${state.session}` : ''}`}
            className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body bg-terracotta text-white hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            Submit Room Configuration →
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body bg-mist text-bark cursor-not-allowed"
          >
            Complete the fields above to continue
          </button>
        )}
      </div>
    </div>
  )
}
