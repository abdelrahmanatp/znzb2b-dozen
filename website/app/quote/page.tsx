import type { Metadata } from 'next'
import QuoteForm from '@/components/QuoteForm'

export const metadata: Metadata = {
  title: 'Request a Quote — Dozen Hotel Supplies',
  description:
    'Request indicative pricing and availability for hotel linen and supplies. We respond within 2 business days.',
}

export default function QuotePage() {
  return (
    <>
      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">
            Request a Quote
          </h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            We&apos;ll respond within 2 business days with indicative pricing and availability.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>

            <aside className="space-y-8">
              <div className="bg-linen-light border border-cloud p-6">
                <h2 className="text-xl font-heading font-medium text-onyx mb-3">
                  What to expect
                </h2>
                <ul className="space-y-3 text-sm font-body text-bark">
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5" aria-hidden="true">—</span>
                    Response within 2 business days
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5" aria-hidden="true">—</span>
                    Indicative pricing based on your specifications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5" aria-hidden="true">—</span>
                    Availability confirmation from local Zanzibar stock
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold mt-0.5" aria-hidden="true">—</span>
                    Formal quote requires owner approval before issue
                  </li>
                </ul>
              </div>

              <div className="bg-linen-light border border-cloud p-6">
                <h2 className="text-xl font-heading font-medium text-onyx mb-3">
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

              <div className="bg-linen-light border border-cloud p-6">
                <h2 className="text-xl font-heading font-medium text-onyx mb-3">
                  Trusted by
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['TUI Blue', 'LUX* Resorts', 'Neptune Hotels', 'Baraza', 'Fundu Lagoon'].map(
                    (name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider bg-cloud text-bark rounded-full"
                      >
                        {name}
                      </span>
                    )
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider bg-cloud text-driftwood rounded-full">
                    + 25 more
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
