import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ClientLogo from '@/components/ClientLogo'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'About Dozen Hotel Supplies',
  description:
    'Dozen Hotel Supplies is an Egyptian-origin company and sole East Africa distributor for Alazima, Hedjet, and Garrana Group. Premium linen, kitchen equipment, and full supply chain services for hotels, restaurants, and hospitals across Zanzibar.',
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
  'Kitchen & Sanitation Textiles (kitchen towels, glass cloths, dusters)',
  'Kitchen & Laundry Equipment (Garrana — design, supply & install)',
]

const stats = [
  { value: '300+', label: 'Product SKUs' },
  { value: '30+', label: 'Properties Supplied' },
  { value: '1995', label: 'Manufacturing Est.' },
  { value: '4', label: 'Global Regions' },
]

export default function AboutPage() {
  return (
    <>
      {/* Editorial dark header — Stitch "Articulating the Standard of Luxury" */}
      <div className="relative bg-terracotta-deep overflow-hidden py-24 md:py-32 min-h-[400px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=60&auto=format&fit=crop&fm=webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(2,22,86,0.96) 0%, rgba(2,22,86,0.70) 50%, rgba(2,22,86,0.40) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-site mx-auto px-5 md:px-16 w-full">
          <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-5">
            Our Story
          </p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-[1.08] tracking-[-0.02em] max-w-2xl">
            A Legacy in Tourism.
          </h1>
          <p className="text-lg font-body text-white/70 mt-5 max-w-prose-lg">
            Egyptian-origin hotel supplies. Zanzibar presence. Hospitality-grade quality for every property type.
          </p>

          {/* Stats bar */}
          <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap gap-10">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-heading font-bold text-white">{value}</p>
                <p className="text-xs font-body uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Are + Location */}
      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <SectionReveal>
              <div>
                <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-4">
                  Global Reach, Local Precision
                </p>
                <h2 className="text-3xl md:text-4xl font-heading font-semibold text-onyx mb-6">
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
                  <p>
                    For textiles, we are the sole East Africa distributor for <strong className="font-semibold text-onyx">Alazima</strong> and <strong className="font-semibold text-onyx">Hedjet</strong> — two of Egypt&apos;s
                    most respected hospitality textile manufacturers, operating since 1995. Their products serve hotels
                    across Africa, Europe, the USA, and the MENA region. We bring the same factory-direct quality to
                    Zanzibar that international hotel groups have relied on for decades.
                  </p>
                  <p>
                    For kitchen, bakery, and laundry equipment, we are the sole East Africa distributor for{' '}
                    <strong className="font-semibold text-onyx">Garrana Group</strong> — Egypt&apos;s leading manufacturer of commercial kitchen
                    solutions. We design, fabricate, supply, install, commission, and maintain complete kitchen and
                    laundry operations for hotels, resorts, restaurants, bakeries, and hospitals across the region.
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <div>
                {/* Ethical Sourcing block */}
                <div className="bg-white border border-cloud p-8 mb-6">
                  <div className="w-8 h-[2px] bg-gold mb-5" aria-hidden="true" />
                  <h3 className="text-lg font-heading font-semibold text-onyx mb-3">Ethical Sourcing</h3>
                  <p className="text-sm font-body text-bark leading-relaxed">
                    All textiles are sourced from certified Egyptian cotton mills. We work directly with
                    manufacturers — no intermediaries — ensuring full traceability from raw fibre to finished
                    product.
                  </p>
                </div>

                {/* Quality Assurance block */}
                <div className="bg-white border border-cloud p-8 mb-6">
                  <div className="w-8 h-[2px] bg-gold mb-5" aria-hidden="true" />
                  <p className="text-3xl font-heading font-bold text-terracotta mb-2">98%</p>
                  <h3 className="text-lg font-heading font-semibold text-onyx mb-3">Quality Assurance</h3>
                  <p className="text-sm font-body text-bark leading-relaxed">
                    98% of batches pass first-inspection standards. Every delivery includes QA documentation
                    with GSM verification, shrinkage test results, and wash fastness ratings.
                  </p>
                </div>

                {/* Location block */}
                <div className="bg-white border border-cloud p-8">
                  <h3 className="text-lg font-heading font-semibold text-onyx mb-4">Our Location</h3>
                  <address className="not-italic text-sm font-body text-bark leading-relaxed">
                    <strong className="font-semibold text-onyx">Dozen Hotel Supplies</strong><br />
                    303 Silversand, Kibweni<br />
                    P.O. Box 4212<br />
                    Zanzibar, Tanzania
                  </address>
                  <div className="mt-5 pt-5 border-t border-cloud space-y-2">
                    <p className="text-sm font-body">
                      <span className="text-bark">General enquiries: </span>
                      <a
                        href="mailto:info@dozensupplies.com"
                        className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      >
                        info@dozensupplies.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Manufacturing Partners */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-3">
              Factory Partnerships
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-onyx mb-4">
              Our Manufacturing Partners
            </h2>
            <p className="text-lg font-body text-bark mb-10 max-w-prose-lg">
              Sole distributor relationships with two of Egypt&apos;s most respected manufacturers — giving our clients direct access to factory pricing and quality without intermediaries.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alazima & Hedjet */}
            <SectionReveal delay={0.05}>
              <div className="bg-linen border border-cloud p-8 md:p-10 h-full">
                <div className="w-8 h-[2px] bg-gold mb-6" aria-hidden="true" />
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-gold mb-2">
                  Textiles — Sole East Africa Distributor
                </p>
                <h3 className="text-2xl font-heading font-semibold text-onyx mb-4">
                  Alazima &amp; Hedjet
                </h3>
                <p className="text-sm font-body text-bark leading-relaxed mb-6">
                  Established in 1995, Alazima and Hedjet are among Egypt&apos;s most trusted hospitality textile manufacturers. Their product range — bath towels, bed linen, bathrobes, and F&B linen — is specified by hotel groups across <strong className="font-medium text-onyx">Africa, Europe, the USA, and the MENA region</strong>. As their sole distributor in East Africa, we deliver the same factory-grade quality and verified GSM specifications to Zanzibar properties of all sizes.
                </p>
                <ul className="space-y-2">
                  {['Bath towels, hand towels, bath sheets', 'Bed linen — sheets, pillowcases, duvet covers', 'Bathrobes — terry, waffle, velour', 'F&B linen — tablecloths, napkins'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm font-body text-bark">
                      <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            {/* Garrana Group */}
            <SectionReveal delay={0.1}>
              <div className="bg-linen border border-cloud p-8 md:p-10 h-full">
                <div className="w-8 h-[2px] bg-gold mb-6" aria-hidden="true" />
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-gold mb-2">
                  Kitchen &amp; Laundry Equipment — Sole East Africa Distributor
                </p>
                <h3 className="text-2xl font-heading font-semibold text-onyx mb-4">
                  Garrana Group
                </h3>
                <p className="text-sm font-body text-bark leading-relaxed mb-6">
                  Garrana is Egypt&apos;s leading manufacturer of commercial kitchen and laundry equipment, meeting international standards across cooking, refrigeration, and stainless-steel fabrication. As their sole East Africa distributor, we offer the <strong className="font-medium text-onyx">full project lifecycle</strong> — design, fabrication, supply, installation, commissioning, and ongoing maintenance — for hotels, restaurants, bakeries, hospitals, and food service operations.
                </p>
                <ul className="space-y-2">
                  {['Cooking equipment — gas and electric ranges', 'Refrigeration — walk-ins and reach-ins', 'Stainless-steel furniture — sinks, tables, shelves, trolleys', 'Industrial dishwashers and laundry equipment'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm font-body text-bark">
                      <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* What We Supply */}
      <section className="bg-sand py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-3">
              Product Coverage
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-onyx mb-4">
              What We Supply
            </h2>
            <p className="text-lg font-body text-bark mb-10 max-w-prose-lg">
              Eight product and equipment categories serving hotels, resorts, restaurants, hospitals, bakeries, and food service operations across Zanzibar and East Africa.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.map((cat, i) => (
              <SectionReveal key={cat} delay={i * 0.05}>
                <div className="bg-white border border-cloud p-5 flex items-start gap-4">
                  <span className="text-gold font-heading text-xl mt-0.5 shrink-0" aria-hidden="true">—</span>
                  <p className="text-sm font-body text-bark">{cat}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta bg-transparent px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Browse Full Catalog
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* Our Clients */}
      <section className="bg-linen py-16 md:py-24" aria-label="Hotel clients who trust Dozen">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-3">
              Our Partners
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-onyx mb-4">
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
