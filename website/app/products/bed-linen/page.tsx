import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Bed Linen — Dozen Hotel Supplies',
  description:
    'Premium bed sheets, pillowcases, and duvet covers for Zanzibar hotels. Egyptian cotton 300–500 TC and poly-cotton blends. Logo imposition available.',
}

const products = [
  {
    name: 'Bed Sheets — 100% Egyptian Cotton (300 TC)',
    material: '100% Egyptian cotton',
    threadCount: '300 TC',
    weave: 'Plain white and stripe white',
    sizes: ['225×280 cm', '270×280 cm'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: 'Plain white: $16.00–$17.00 / sheet · Stripe white: $17.00–$20.00 / sheet',
    applications: 'Mid-range to boutique hotels — reliable quality at accessible price points.',
  },
  {
    name: 'Bed Sheets — 100% Egyptian Cotton (400 TC)',
    material: '100% Egyptian cotton',
    threadCount: '400 TC — softer feel, more durable with extended washing',
    weave: 'Plain white',
    sizes: ['225×280 cm', '270×280 cm'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: '$19.00–$22.00 / sheet',
    applications: 'Boutique hotels and lodges seeking elevated comfort without luxury pricing.',
  },
  {
    name: 'Bed Sheets — 100% Egyptian Cotton (500 TC)',
    material: '100% Egyptian cotton',
    threadCount: '500 TC — premium luxury grade',
    weave: 'Plain white',
    sizes: ['225×280 cm', '270×280 cm'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: '$24.00–$29.00 / sheet',
    applications: 'Luxury resorts and premium suites — 500 TC is the specification used by five-star properties.',
  },
  {
    name: 'Bed Sheets — Poly-Cotton Blends',
    material: 'Cotton/polyester blend (easier care, faster drying)',
    threadCount: '200 TC, 250 TC, or 300 TC stripe',
    weave: 'Plain and stripe options',
    sizes: ['225×280 cm', '270×280 cm'],
    colors: 'White',
    customization: 'Available upon request',
    priceRange: '$13.04–$19.67 / sheet',
    applications: 'Villas, guesthouses, and high-volume operations where laundry speed matters.',
  },
  {
    name: 'Pillowcases',
    material: '100% cotton or poly-cotton',
    threadCount: '200–500 TC (matched to sheet grade)',
    weave: 'Plain white',
    sizes: ['50×75 cm'],
    colors: 'White',
    customization: 'Embroidery available',
    priceRange: '$2.50–$3.25 / case',
    applications: 'All property grades — order matched to sheet thread count for consistent bed sets.',
  },
  {
    name: 'Duvet Covers',
    material: '100% cotton or poly-cotton',
    threadCount: '200–500 TC',
    weave: 'Plain white',
    sizes: ['230×225 cm', '230×270 cm'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: 'Cotton 300–500 TC: $29.00–$52.00 / cover · Poly-cotton 200–300 TC: $26.90–$37.04 / cover',
    applications: 'Paired with duvet inserts from our bedding range — available in matching thread counts.',
  },
]

export default function BedLinenPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-bark">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Bed Linen</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Bed Linen</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Premium Bed Linen</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Egyptian cotton and poly-cotton bed linen in thread counts from 200 to 500 TC. Designed to withstand
            commercial laundry at 60–80°C while maintaining softness across hundreds of wash cycles. Available with
            logo imposition for brand consistency across every guest room.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, i) => (
              <SectionReveal key={product.name} delay={i * 0.05}>
                <article className="bg-linen-light border border-cloud p-6 md:p-8">
                  <h2 className="text-2xl font-heading font-medium text-onyx mb-4">{product.name}</h2>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-cloud text-left">
                      <tbody>
                        {[
                          ['Material', product.material],
                          ['Thread Count', product.threadCount],
                          ['Weave', product.weave],
                          ['Sizes', product.sizes.join(', ')],
                          ['Colors', product.colors],
                          ['Customization', product.customization],
                        ].map(([label, value]) => (
                          <tr key={label}>
                            <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 w-1/3 border-r border-cloud border-t border-cloud">
                              {label}
                            </th>
                            <td className="text-sm text-bark px-4 py-3 border-t border-cloud">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm font-body font-medium text-terracotta mb-1">{product.priceRange}</p>
                  <p className="text-xs font-body text-bark mb-4">
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
        </div>
      </section>
    </>
  )
}
