import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Kitchen & Sanitation Linen — Dozen Hotel Supplies',
  description:
    'Professional kitchen and sanitation textiles for Zanzibar hotel food service: kitchen towels, chef towels, glass cloths, and microfiber dusters. Sold per dozen.',
}

const products = [
  {
    name: 'Kitchen Towel',
    specs: [
      ['Material', '100% cotton — absorbent, lint-free/low-lint'],
      ['Unit', 'Priced per dozen (12 pieces)'],
      ['Colors', 'White (standard) · Custom colors on request'],
      ['Standards', 'Machine washable · Bleach-safe · Food-safe'],
      ['Applications', 'Hotel kitchen cleaning, food prep, counter/equipment maintenance'],
    ],
    priceRange: '$33.00 per dozen (12 pieces) · ~$2.75 per towel',
    applications: 'General food preparation, hand drying, counter and equipment wiping in hotel kitchens.',
  },
  {
    name: 'Chef Towel',
    specs: [
      ['Material', '100% cotton — heavier weight, superior absorbency'],
      ['Unit', 'Priced per dozen (12 pieces)'],
      ['Colors', 'White (standard) · Colored options available'],
      ['Standards', 'Professional food-safe material · High-heat drying compatible'],
      ['Applications', 'Professional kitchen stations, chef uniforms, upscale food service'],
    ],
    priceRange: '$48.00 per dozen (12 pieces) · ~$4.00 per towel',
    applications: 'Professional kitchen operations, head chef stations, upscale hotels and restaurants.',
  },
  {
    name: 'Glass Cloth — 100% Cotton',
    specs: [
      ['Material', '100% cotton — tight weave, lint-free, scratch-free'],
      ['Unit', 'Priced per dozen (12 pieces)'],
      ['Colors', 'White'],
      ['Standards', 'Professional food service standard · Machine washable'],
      ['Applications', 'Polishing glassware, dishes, and serving ware without streaks or lint'],
    ],
    priceRange: '$66.00 per dozen (12 pieces) · ~$5.50 per cloth',
    applications: 'Bar and glassware polishing, fine dining presentation, hotel restaurant service standards.',
  },
  {
    name: 'Duster — Microfiber',
    specs: [
      ['Material', 'Microfiber synthetic blend — traps and holds dust particles'],
      ['Unit', 'Priced per dozen (12 pieces)'],
      ['Colors', 'Various microfiber colors'],
      ['Standards', 'Reusable · Machine washable · No chemical cleaner required'],
      ['Applications', 'General kitchen and public area cleaning, equipment surface maintenance'],
    ],
    priceRange: '$6.00 per dozen (12 pieces) · ~$0.50 per duster',
    applications: 'General kitchen dusting, public area maintenance (lobby, hallways, dining), budget-friendly daily cleaning.',
  },
]

const pricingTable = [
  { product: 'Kitchen Towel', perDozen: '$33.00', perPiece: '~$2.75', minOrder: '1 dozen' },
  { product: 'Chef Towel', perDozen: '$48.00', perPiece: '~$4.00', minOrder: '1 dozen' },
  { product: 'Glass Cloth', perDozen: '$66.00', perPiece: '~$5.50', minOrder: '1 dozen' },
  { product: 'Duster Microfiber', perDozen: '$6.00', perPiece: '~$0.50', minOrder: '1 dozen' },
]

export default function KitchenSanitationPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-driftwood">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Kitchen & Sanitation</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Kitchen & Sanitation</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Kitchen & Sanitation Linen</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Professional-grade kitchen and sanitation textiles for high-volume hotel food service. All products are
            food-safe, machine washable at 60–70°C, and designed for continuous commercial laundry operations.
            Priced per dozen to simplify bulk inventory management — minimum order is one dozen (12 pieces).
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {products.map((product, i) => (
              <SectionReveal key={product.name} delay={i * 0.06}>
                <article className="bg-linen-light border border-cloud p-6 md:p-8">
                  <h2 className="text-2xl font-heading font-medium text-onyx mb-4">{product.name}</h2>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-cloud text-left">
                      <tbody>
                        {product.specs.map(([label, value]) => (
                          <tr key={label}>
                            <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 w-1/3 border-r border-cloud border-t border-cloud">
                              {label}
                            </th>
                            <td className="text-sm text-bark px-4 py-3 border-t border-cloud">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm font-body font-medium text-terracotta mb-1">{product.priceRange}</p>
                  <p className="text-xs font-body text-driftwood mb-4">
                    Indicative pricing — VAT not included. Contact us for a formal quote.
                  </p>
                  <p className="text-sm font-body text-bark italic border-l-2 border-gold pl-3 mb-4">
                    {product.applications}
                  </p>
                  <Link
                    href="/quote"
                    className="inline-flex items-center justify-center bg-terracotta text-white px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Request a Quote
                  </Link>
                </article>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal>
            <div className="bg-sand border border-cloud p-8 mb-8">
              <h2 className="text-2xl font-heading font-medium text-onyx mb-6">Bulk Order Pricing Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-cloud text-left">
                  <thead>
                    <tr>
                      {['Product', 'Per Dozen', 'Per Piece', 'Min. Order'].map((h) => (
                        <th key={h} className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTable.map(({ product, perDozen, perPiece, minOrder }) => (
                      <tr key={product}>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud font-medium">{product}</td>
                        <td className="text-sm text-terracotta font-medium px-4 py-3 border-t border-cloud border-r border-cloud">{perDozen}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{perPiece}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud">{minOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs font-body text-driftwood mt-4">
                All prices are indicative and exclude VAT. Volume pricing for orders of 50+ dozens available upon request. Contact{' '}
                <a href="mailto:info@dozensupplies.com" className="text-terracotta hover:underline">info@dozensupplies.com</a>{' '}
                for formal quotes.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
