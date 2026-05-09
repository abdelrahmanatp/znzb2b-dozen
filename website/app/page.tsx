import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import PartnerSlider from '@/components/PartnerSlider'
import ProductCard from '@/components/ProductCard'
import SectionReveal from '@/components/SectionReveal'

const productCategories = [
  {
    title: 'Bath Towels',
    description:
      'Premium 100% Egyptian cotton towels in multiple GSM weights, sizes, and colors. From face towels to oversized pool sheets — with custom embroidery available.',
    href: '/products/towels',
    productCount: 6,
    priceFrom: 'From USD $0.95 / unit',
    category: 'Bath Towels',
    image: '/images/towels-stack.png',
  },
  {
    title: 'Bed Linen',
    description:
      'Egyptian cotton and poly-cotton bed sheets, pillowcases, and duvet covers in 200–500 thread counts. Soft, durable, and available with logo imposition.',
    href: '/products/bed-linen',
    productCount: 5,
    priceFrom: 'From USD $13.04 / sheet',
    category: 'Bed Linen',
    image: '/images/bed-linen-white.png',
  },
  {
    title: 'Bedding',
    description:
      'Pillows, duvet inserts, mattress protectors, and decorative cushions. Hypoallergenic microfiber filling options tailored for Zanzibar\'s warm climate.',
    href: '/products/bedding',
    productCount: 8,
    priceFrom: 'From USD $2.00 / protector',
    category: 'Bedding',
    image: '/images/bedding-throw.png',
  },
  {
    title: 'F&B Linen',
    description:
      'Tablecloths, napkins, and chair covers for fine dining, banquets, and events. Full customization with logo imposition and embroidery.',
    href: '/products/fb-linen',
    productCount: 7,
    priceFrom: 'From USD $1.50 / napkin',
    category: 'F&B Linen',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Bathrobes',
    description:
      'Terry, waffle weave, and velour bathrobes in sizes M–XXL. Lightweight waffle options perfect for Zanzibar\'s warm climate. Custom embroidery available.',
    href: '/products/bathrobes',
    productCount: 3,
    priceFrom: 'From USD $21.00 / robe',
    category: 'Bathrobes',
    image: '/images/bathrobes-colored.png',
  },
  {
    title: 'Slippers',
    description:
      'One-size-fits-all guest slippers in terry, waffle, and velour. Simple inventory management with premium guest presentation. Embroidery available.',
    href: '/products/slippers',
    productCount: 3,
    priceFrom: 'From USD $1.10 / pair',
    category: 'Slippers',
    image: '/images/slippers-basket.png',
  },
  {
    title: 'Kitchen & Sanitation',
    description:
      'Professional-grade kitchen towels, chef towels, glass cloths, and microfiber dusters. Priced per dozen for efficient bulk ordering.',
    href: '/products/kitchen-sanitation',
    productCount: 4,
    priceFrom: 'From USD $6.00 / dozen',
    category: 'Kitchen & Sanitation',
    image: '/images/kitchen-commercial.png',
  },
  {
    title: 'Kitchen & Laundry Equipment',
    description:
      'Commercial kitchen equipment via Garrana Group — Egypt\'s leading manufacturer. Cooking ranges, refrigeration, stainless-steel furniture, and industrial laundry. Full design, installation, and maintenance.',
    href: '/quote',
    productCount: undefined,
    priceFrom: 'By enquiry — design & install',
    category: 'Equipment',
    image: '/images/kitchen-wash.png',
  },
]

const whyDozen = [
  {
    title: 'Egyptian-Origin Quality',
    body: 'Every product is sourced from Egypt\'s finest cotton-producing regions. The long-staple fibres used in our towels and linen are the same used by the world\'s leading luxury hotel groups — now accessible to Zanzibar properties of all sizes.',
  },
  {
    title: 'Zanzibar Stock & Delivery',
    body: 'We maintain local inventory in Zanzibar, eliminating the 4–8 week lead times typical of direct imports. Your order ships from island stock, not Cairo. Replacement stock arrives fast when you need it.',
  },
  {
    title: 'Hospitality-Grade Specs',
    body: 'Our products are specified to survive commercial laundry cycles at 60–80°C, bleach treatment, and daily high-volume use. We work with properties from guesthouses to luxury resorts — and we match product specs to your operational grade.',
  },
]

const quotePaths = [
  {
    label: 'Quick Form',
    href: '/quote',
    title: 'Request a Quote',
    description: 'Fill in your property details and what you need — we respond within 2 business days with pricing.',
    icon: '📬',
  },
  {
    label: 'Catalog Builder',
    href: '/quote/builder',
    title: 'Add Items to Quote',
    description: 'Browse our full catalog, select quantities, request custom sizes, and build a detailed line-item quote.',
    icon: '📋',
  },
  {
    label: 'Room Configurator',
    href: '/quote/builder',
    title: 'Configure by Room',
    description: 'Specify your property room-by-room — room count, category, laundry frequency — for a complete supply proposal.',
    icon: '🏨',
  },
]

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* 1 — Signature Collections — product cards */}
      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-3">
              Signature Collections
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-onyx mb-4">
              Our Product Range
            </h2>
            <p className="text-lg font-body text-bark max-w-prose-lg mb-12">
              Hospitality-grade linen and supplies, sourced to spec for Zanzibar properties.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {productCategories.map((cat, i) => (
              <SectionReveal key={cat.title} delay={i * 0.06}>
                <ProductCard {...cat} />
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.2} className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-body font-bold uppercase tracking-[0.12em] text-terracotta border-b border-terracotta pb-0.5 hover:text-terracotta-deep hover:border-terracotta-deep transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              View All Categories →
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* 2 — Why Dozen — editorial reason columns */}
      <section className="bg-sand py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold mb-3">
              Why Discerning Hotels Choose Dozen
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-onyx mb-12">
              Unrivaled Excellence in Every Detail
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-mist">
            {whyDozen.map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.1}>
                <div className="p-6 md:p-10">
                  <div className="w-8 h-[2px] bg-gold mb-6" aria-hidden="true" />
                  <h3 className="text-2xl font-heading font-semibold text-onyx mb-4">
                    {item.title}
                  </h3>
                  <p className="text-base font-body text-bark leading-relaxed">{item.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Partners — infinite slider */}
      <section className="bg-white py-16 md:py-20" aria-label="Our hotel partners">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold text-center mb-2">
              Our Partners
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-onyx text-center mb-10">
              Trusted by Zanzibar&apos;s Leading Properties
            </h2>
          </SectionReveal>
        </div>

        <SectionReveal delay={0.1}>
          <PartnerSlider />
        </SectionReveal>

        <div className="max-w-site mx-auto px-5 md:px-16 mt-6 text-center">
          <p className="text-xs font-body text-driftwood">
            + 20 more properties across Zanzibar
          </p>
        </div>
      </section>

      {/* 4 — Quote Builder Feature Spotlight */}
      <section className="bg-terracotta-deep py-16 md:py-20" aria-label="Interactive quote builder">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 text-[11px] font-body font-bold uppercase tracking-[0.14em] bg-gold text-white">
                New Feature
              </span>
            </div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold-light mb-4">
              Interactive Quote Builder
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-5 max-w-[640px]">
              Build your perfect quote in minutes.
            </h2>
            <p className="text-lg font-body text-white/75 mb-12 max-w-prose">
              Three ways to get exactly the proposal you need — from a quick inquiry to a full room-by-room specification.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {quotePaths.map((path, i) => (
              <SectionReveal key={path.label} delay={i * 0.08}>
                <Link
                  href={path.href}
                  className="group flex flex-col h-full bg-white/5 hover:bg-white/10 border border-white/0 hover:border-gold/40 p-8 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                >
                  <span className="text-2xl mb-5 block" aria-hidden="true">{path.icon}</span>
                  <span className="text-[10px] font-body font-bold uppercase tracking-[0.14em] text-gold-light mb-2 block">
                    {path.label}
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-gold-light transition-colors duration-200">
                    {path.title}
                  </h3>
                  <p className="text-sm font-body text-white/60 leading-relaxed flex-1">
                    {path.description}
                  </p>
                  <span className="mt-6 text-xs font-body font-bold uppercase tracking-[0.12em] text-gold-warm group-hover:text-gold-light transition-colors duration-200 inline-flex items-center gap-1">
                    Get Started →
                  </span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CTA — navy dark section */}
      <section className="bg-terracotta py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <div className="max-w-[600px]">
            <SectionReveal>
              <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-gold-light mb-4">
                Let&apos;s Design Your Guest Experience
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-semibold text-white mb-6">
                Ready to upgrade your property&apos;s linen?
              </h2>
              <p className="text-lg font-body text-white/75 mb-10 max-w-prose">
                We respond within 2 business days with indicative pricing and availability for any Zanzibar property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quote/builder"
                  className="inline-flex items-center justify-center bg-gold text-white px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body min-w-[200px] hover:bg-gold-warm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-terracotta focus-visible:outline-none"
                >
                  Build Your Quote →
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center border border-white/30 text-white px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body min-w-[200px] hover:border-white/60 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-terracotta focus-visible:outline-none"
                >
                  Browse Products
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  )
}
