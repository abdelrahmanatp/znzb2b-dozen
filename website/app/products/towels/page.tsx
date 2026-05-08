import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Bath Towels — Dozen Hotel Supplies',
  description:
    'Premium 100% Egyptian cotton bath towels for Zanzibar hotels. Face towels, hand towels, bath sheets, bath mats, and pool towels — 450–900 GSM with custom embroidery.',
}

const products = [
  {
    name: 'Face Towel',
    material: '100% Egyptian cotton',
    sizes: ['30×30 cm (50g)', '33×33 cm'],
    gsm: '600–650 GSM',
    colors: 'White, cream, beige, navy blue, grey',
    customization: 'Embroidery and logo imposition available',
    priceRange: '$0.95–$1.15 per unit',
    applications: 'All property grades — standard guest amenity for bathrooms and spa facilities.',
  },
  {
    name: 'Hand Towel',
    material: '100% Egyptian cotton',
    sizes: ['50×70 cm', '50×100 cm'],
    gsm: '550–650 GSM',
    colors: 'White, beige, grey',
    customization: 'Embroidery and logo imposition available',
    priceRange: '$3.00–$4.25 per unit',
    applications: 'Hotel bathrooms, gym facilities, spa areas.',
  },
  {
    name: 'Bath Towel & Bath Sheet',
    material: '100% Egyptian cotton',
    sizes: ['70×140 cm', '75×150 cm', '90×180 cm (bath sheet)'],
    gsm: '500–650 GSM',
    colors: 'White, beige, grey, navy blue',
    customization: 'Embroidery and logo imposition available',
    priceRange: '$8.00–$13.50 per unit',
    applications: 'Luxury resort bath sheets (90×180 cm, 550+ GSM) with embroidered logos; standard bath towels for boutique hotels.',
  },
  {
    name: 'Bath Mat',
    material: '100% Egyptian cotton',
    sizes: ['50×70 cm'],
    gsm: '900 GSM (heavyweight, extra absorbent)',
    colors: 'White, beige, grey',
    customization: 'Embroidery and logo imposition available',
    priceRange: '$4.50 per unit',
    applications: 'Spa & wellness facilities for slip resistance and comfort; all hotel bathrooms.',
  },
  {
    name: 'Pool Towel / Beach Towel',
    material: '100% Egyptian cotton',
    sizes: ['75×150 cm', '90×180 cm', '100×200 cm (large format)'],
    gsm: '450–550 GSM',
    colors: 'Solid: Beige, navy blue, grey, turquoise, royal blue, brown. Striped: White/blue, white/orange, white/stone, sailor grey, sailor sand.',
    customization: 'Embroidery and logo imposition available',
    priceRange: '$9.00–$13.50 per unit',
    applications: 'Pool clubs, beach resorts, spa facilities — striped options for resort branding.',
  },
  {
    name: 'Full Set — Bianca Collection',
    material: '100% Egyptian cotton',
    sizes: ['Face towel 33×33 cm, Hand towel 50×100 cm, Bath towel 70×140 cm, Bath mat 50×70 cm'],
    gsm: 'Mixed GSM across set',
    colors: 'White',
    customization: 'Embroidery and logo imposition available on individual pieces',
    priceRange: '$16.50 per set',
    applications: 'Standard hotel rooms — complete bathroom setup in a single order.',
  },
  {
    name: 'Full Set — Seville Collection',
    material: '100% Egyptian cotton',
    sizes: ['Face towel 30×30 cm, Hand towel 50×100 cm, Bath sheet 90×180 cm, Bath mat 50×70 cm'],
    gsm: 'Mixed GSM across set — premium grades throughout',
    colors: 'White',
    customization: 'Embroidery and logo imposition available on individual pieces',
    priceRange: '$21.00 per set',
    applications: 'Luxury suites and premium rooms — oversized bath sheet format for a five-star presentation.',
  },
]

export default function TowelsPage() {
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="bg-linen border-b border-cloud py-3 px-5 md:px-8"
      >
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-bark">
          <li>
            <Link href="/" className="hover:text-onyx transition-colors duration-150">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-onyx transition-colors duration-150">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Bath Towels</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">
            Bath Towels
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">
            Egyptian Cotton Towels
          </h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Premium 100% Egyptian cotton towels in multiple styles, weights, and sizes. Designed for high-volume
            hospitality use — absorbent, durable, and available with custom embroidery and logo imposition. Trusted by
            luxury resorts and boutique hotels across Zanzibar.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, i) => (
              <SectionReveal key={product.name} delay={i * 0.05}>
                <article className="bg-linen-light border border-cloud p-6 md:p-8">
                  <h2 className="text-2xl font-heading font-medium text-onyx mb-4">
                    {product.name}
                  </h2>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-cloud text-left">
                      <tbody>
                        <tr>
                          <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 w-1/3 border-r border-cloud">
                            Material
                          </th>
                          <td className="text-sm text-bark px-4 py-3 border-t border-cloud">
                            {product.material}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-t border-cloud">
                            Sizes
                          </th>
                          <td className="text-sm text-bark px-4 py-3 border-t border-cloud">
                            {product.sizes.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-body text-bark border border-cloud bg-white mr-1 mb-1"
                              >
                                {s}
                              </span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-t border-cloud">
                            GSM
                          </th>
                          <td className="text-sm text-bark px-4 py-3 border-t border-cloud">
                            {product.gsm}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-t border-cloud">
                            Colors
                          </th>
                          <td className="text-sm text-bark px-4 py-3 border-t border-cloud">
                            {product.colors}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-t border-cloud">
                            Customization
                          </th>
                          <td className="text-sm text-bark px-4 py-3 border-t border-cloud">
                            {product.customization}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm font-body font-medium text-terracotta mb-1">
                    {product.priceRange}
                  </p>
                  <p className="text-xs font-body text-bark mb-4">
                    Indicative pricing — VAT not included. Contact us for a formal quote.
                  </p>

                  <p className="text-sm font-body text-bark italic border-l-2 border-gold pl-3">
                    {product.applications}
                  </p>

                  <Link
                    href="/quote"
                    className="mt-4 inline-flex items-center justify-center bg-terracotta text-white px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Request a Quote
                  </Link>
                </article>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-16 bg-sand border border-cloud p-8">
            <h2 className="text-2xl font-heading font-medium text-onyx mb-3">
              Pricing Disclaimer
            </h2>
            <p className="text-base font-body text-bark">
              All pricing displayed is indicative and excludes VAT. Formal quotes require owner approval and are issued
              after confirming specifications, quantities, and customization requirements. Contact{' '}
              <a
                href="mailto:info@dozensupplies.com"
                className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                info@dozensupplies.com
              </a>{' '}
              or use the quote form for bulk pricing.
            </p>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
