import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Bathrobes — Dozen Hotel Supplies',
  description:
    'Premium hotel bathrobes for Zanzibar: terry, waffle weave, and velour in sizes M–XXL. Custom embroidery and logo imposition. Lightweight waffle ideal for warm climates.',
}

const products = [
  {
    name: 'Bathrobe — Terry Cotton',
    material: '100% cotton terry cloth',
    feel: 'Soft, absorbent — traditional bathrobe experience',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: 'White, beige',
    customization: 'Full embroidery and logo imposition available',
    priceRange: 'White: $21.00 / robe · Beige: $21.50 / robe',
    applications: 'All hotel grades — standard guest amenity; spa and wellness facilities.',
  },
  {
    name: 'Bathrobe — Waffle Weave',
    material: '100% cotton waffle weave',
    feel: 'Lightweight, crisp texture — faster drying than terry; ideal for warm climates',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: '$22.00 / robe',
    applications: 'Luxury resorts, spa facilities, boutique properties — especially well-suited to Zanzibar\'s warm environment.',
  },
  {
    name: 'Bathrobe — Velour',
    material: '100% cotton velour',
    feel: 'Soft, plush velour texture — premium guest experience',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: 'White',
    customization: 'Full embroidery and logo imposition available',
    priceRange: '$22.00 / robe',
    applications: 'High-end luxury resorts, spa suites, upscale villas — elevates the in-room experience.',
  },
]

const sizeGuide = [
  ['M', 'Sizes 8–10', 'XS–S'],
  ['L', 'Sizes 12–14', 'S–M'],
  ['XL', 'Sizes 16–18', 'L–XL'],
  ['XXL', 'Sizes 20+', 'XL–XXL'],
]

export default function BathrobesPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-driftwood">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Bathrobes</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Bathrobes</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Hotel Bathrobes</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Luxurious bathrobes in terry, waffle weave, and velour — designed for the complete spectrum of
            Zanzibar hospitality properties. Our waffle weave option is particularly well-suited to the island&apos;s
            warm climate: lightweight, quick-drying, and effortlessly elegant. All styles available with
            custom embroidery on the pocket or front panel.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product, i) => (
              <SectionReveal key={product.name} delay={i * 0.08}>
                <article className="bg-linen-light border border-cloud p-6 md:p-8 h-full flex flex-col">
                  <h2 className="text-2xl font-heading font-medium text-onyx mb-4">{product.name}</h2>

                  <div className="overflow-x-auto mb-4 flex-1">
                    <table className="w-full border-collapse border border-cloud text-left">
                      <tbody>
                        {[
                          ['Material', product.material],
                          ['Feel', product.feel],
                          ['Sizes', product.sizes.join(' · ')],
                          ['Colors', product.colors],
                          ['Customization', product.customization],
                        ].map(([label, value]) => (
                          <tr key={label}>
                            <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 w-2/5 border-r border-cloud border-t border-cloud">
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
                    className="mt-auto inline-flex items-center justify-center bg-terracotta text-white px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Request a Quote
                  </Link>
                </article>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal>
            <div className="bg-sand border border-cloud p-8">
              <h2 className="text-2xl font-heading font-medium text-onyx mb-6">Size Guide</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-cloud text-left max-w-lg">
                  <thead>
                    <tr>
                      <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Size</th>
                      <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Dress Size</th>
                      <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-b border-cloud">International</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.map(([size, dress, intl]) => (
                      <tr key={size}>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud font-medium">{size}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{dress}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud">{intl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs font-body text-driftwood mt-4">
                Bulk discounts available for orders of 50+ units. Lead times for custom embroidery typically 2–4 weeks.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
