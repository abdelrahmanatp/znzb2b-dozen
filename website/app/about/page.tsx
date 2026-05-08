import type { Metadata } from 'next'
import Link from 'next/link'
import ClientLogo from '@/components/ClientLogo'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'About Dozen Hotel Supplies',
  description:
    'Dozen Hotel Supplies is an Egyptian-origin company supplying premium linen to Zanzibar\'s hospitality market. Learn about our story, supply chain, and 30+ hotel clients.',
}

const clients = [
  'TUI Blue',
  'LUX* Resorts',
  'Neptune Hotels',
  'Baraza Resort & Spa',
  'Fundu Lagoon',
  'The Manta Resort',
  'Zawadi Hotel',
  'Chumbe Island',
  'Matemwe Lodge',
  'Zanzibar Collection',
  'Nungwi Beach Resort',
  'Kilindi Zanzibar',
  'Zanzibar White Sand Luxury Villas',
]

const productCategories = [
  'Bath Towels (400–900 GSM, 6 styles)',
  'Bed Linen (200–500 TC, Egyptian cotton & poly-cotton)',
  'Bedding (pillows, duvets, mattress protectors)',
  'F&B Linen (tablecloths, napkins, chair covers)',
  'Bathrobes (terry, waffle, velour — M to XXL)',
  'Slippers (terry, waffle, velour — OSFA)',
  'Kitchen & Sanitation (kitchen towels, glass cloths, dusters)',
]

export default function AboutPage() {
  return (
    <>
      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">About Dozen</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Egyptian-origin hotel supplies. Zanzibar presence. Hospitality-grade quality.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <SectionReveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-medium text-onyx mb-6">
                  Who We Are
                </h2>
                <div className="space-y-4 text-base font-body text-bark leading-relaxed">
                  <p>
                    Dozen Hotel Supplies is an Egyptian-origin company with deep roots in the premium linen trade. Egypt
                    is home to the world&apos;s finest long-staple cotton — the raw material behind the towels and bed
                    linen used in the best hotels globally. We bring that supply chain expertise directly to the
                    Zanzibar hospitality market.
                  </p>
                  <p>
                    We established a Zanzibar presence to serve the island&apos;s growing hospitality sector directly —
                    cutting the 4–8 week import delays typical of direct overseas sourcing, and providing local support
                    that larger international suppliers cannot offer.
                  </p>
                  <p>
                    Today we supply 30+ properties across Zanzibar, from luxury resorts to boutique lodges and
                    guesthouses. Every product we stock has been specified for high-volume hospitality use — designed to
                    survive commercial laundry at 60–80°C, daily turnover, and the coastal humidity of the Swahili
                    coast.
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <div className="bg-sand border border-cloud p-8">
                <h3 className="text-xl font-heading font-medium text-onyx mb-6">Our Location</h3>
                <address className="not-italic text-base font-body text-bark leading-relaxed">
                  <strong className="font-semibold text-onyx">Dozen Hotel Supplies</strong><br />
                  303 Silversand, Kibweni<br />
                  P.O. Box 4212<br />
                  Zanzibar, Tanzania
                </address>
                <div className="mt-6 pt-6 border-t border-cloud space-y-2">
                  <p className="text-sm font-body">
                    <span className="text-driftwood">General enquiries: </span>
                    <a
                      href="mailto:info@dozensupplies.com"
                      className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                    >
                      info@dozensupplies.com
                    </a>
                  </p>
                  <p className="text-sm font-body">
                    <span className="text-driftwood">Privacy & data: </span>
                    <a
                      href="mailto:privacy@dozensupplies.com"
                      className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                    >
                      privacy@dozensupplies.com
                    </a>
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-onyx mb-6">
              What We Supply
            </h2>
            <p className="text-lg font-body text-bark mb-10 max-w-prose-lg">
              Seven product categories covering every linen and textile need across a hotel property.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.map((cat, i) => (
              <SectionReveal key={cat} delay={i * 0.05}>
                <div className="bg-linen border border-cloud p-4 flex items-start gap-3">
                  <span className="text-gold text-lg font-heading mt-0.5" aria-hidden="true">—</span>
                  <p className="text-sm font-body text-bark">{cat}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-onyx text-onyx bg-transparent px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body hover:bg-onyx hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-onyx focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Browse Full Catalog
            </Link>
          </SectionReveal>
        </div>
      </section>

      <section className="bg-linen py-16 md:py-24" aria-label="Hotel clients who trust Dozen">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <SectionReveal>
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-onyx mb-4">
              Our Clients
            </h2>
            <p className="text-lg font-body text-bark mb-10">
              30+ properties across Zanzibar trust Dozen for their linen supply.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {clients.map((name, i) => (
              <SectionReveal key={name} delay={i * 0.04}>
                <ClientLogo name={name} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
