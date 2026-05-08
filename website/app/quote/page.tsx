// website/app/quote/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import QuoteForm from '@/components/QuoteForm'

export const metadata: Metadata = {
  title: 'Request a Quote — Dozen Hotel Supplies',
  description:
    'Request indicative pricing and availability for hotel linen and supplies. Choose between a quick form, a catalog-based builder, or a room-by-room configurator.',
}

const paths = [
  {
    href: '/quote/builder',
    label: 'Build a Quote',
    sub: 'Browse catalog, add specific items',
    description:
      'Browse all 7 product categories. Add items with quantities, notes, and custom size requests. Best for when you know exactly what you need.',
    cta: 'Start building →',
    accent: 'bg-terracotta text-white hover:bg-terracotta-deep',
  },
  {
    href: '/quote/builder?mode=rooms',
    label: 'Configure by Rooms',
    sub: 'Tell us about your property',
    description:
      'Enter your room count, select which product types you need per room, and specify laundry frequency. Our team will build the full product list for you.',
    cta: 'Configure property →',
    accent: 'bg-terracotta text-white hover:bg-terracotta-deep',
  },
]


export default function QuotePage() {
  return (
    <>
      <div className="relative bg-terracotta-deep overflow-hidden py-20 md:py-28 min-h-[280px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=60&auto=format&fit=crop&fm=webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-site mx-auto px-5 md:px-16 w-full">
          <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-4">
            Establish a Partnership
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Request a Quote
          </h1>
          <p className="text-lg font-body text-white/70 mt-4 max-w-prose-lg">
            Three ways to get started — pick the one that fits how you work.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

            {/* Paths 1 + 2 */}
            {paths.map((path) => (
              <div
                key={path.href}
                className="bg-white border border-cloud p-8 flex flex-col"
                style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}
              >
                <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
                <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-2">
                  {path.sub}
                </p>
                <h2 className="text-2xl font-heading font-semibold text-onyx mb-4">
                  {path.label}
                </h2>
                <p className="text-sm font-body text-bark leading-relaxed flex-1 mb-8">
                  {path.description}
                </p>
                <Link
                  href={path.href}
                  className={`inline-flex items-center justify-center px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${path.accent}`}
                >
                  {path.cta}
                </Link>
              </div>
            ))}

            {/* Path 3 — Quick Form (existing) */}
            <div
              className="bg-white border border-cloud p-8 flex flex-col"
              style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}
            >
              <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
              <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-2">
                Simple enquiry
              </p>
              <h2 className="text-2xl font-heading font-semibold text-onyx mb-4">
                Quick Form
              </h2>
              <p className="text-sm font-body text-bark leading-relaxed flex-1 mb-8">
                A short form for a general enquiry. Best for early-stage conversations or if you just want to get in touch before committing to a full quote.
              </p>
              <Link
                href="#quick-form"
                className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
              >
                Use quick form →
              </Link>
            </div>
          </div>

          {/* Quick Form (existing) — anchored */}
          <div id="quick-form" className="mt-20 pt-16 border-t border-cloud">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <QuoteForm />
              </div>
              <aside className="space-y-6">
                <div className="bg-white border border-cloud p-6">
                  <div className="w-6 h-[2px] bg-gold mb-5" aria-hidden="true" />
                  <h2 className="text-lg font-heading font-semibold text-onyx mb-3">
                    Contact directly
                  </h2>
                  <p className="text-sm font-body text-bark mb-4">
                    Prefer to reach us by email?
                  </p>
                  <a
                    href="mailto:info@dozensupplies.com"
                    className="text-sm font-body text-terracotta hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  >
                    info@dozensupplies.com
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
