import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'F&B Linen — Dozen Hotel Supplies',
  description:
    'Food & beverage linen for Zanzibar hotels: tablecloths, napkins, and chair covers for fine dining, banquets, and events. Custom logo imposition available.',
}

const products = [
  {
    name: 'Tablecloth — Square',
    specs: [
      ['Material', '100% cotton'],
      ['Size', '190×190 cm — covers standard 6–8 person table'],
      ['Colors', 'White (custom colors on request)'],
      ['Customization', 'Full embroidery and logo imposition available'],
    ],
    priceRange: '$18.00 per tablecloth',
    applications: 'Fine dining, formal banquets, wedding events.',
  },
  {
    name: 'Tablecloth — Round (230 cm)',
    specs: [
      ['Material', '100% cotton'],
      ['Size', '230 cm diameter — covers standard round tables'],
      ['Colors', 'White (custom colors on request)'],
      ['Customization', 'Full embroidery and logo imposition available'],
    ],
    priceRange: '$21.75 per tablecloth',
    applications: 'Round-table dining, formal events, wedding receptions.',
  },
  {
    name: 'Tablecloth — Round (320 cm)',
    specs: [
      ['Material', '100% cotton'],
      ['Size', '320 cm diameter — covers large banquet round tables'],
      ['Colors', 'White (custom colors on request)'],
      ['Customization', 'Full embroidery and logo imposition available'],
    ],
    priceRange: '$31.00 per tablecloth',
    applications: 'Large banquet tables, formal gala dinners, high-capacity event spaces.',
  },
  {
    name: 'Chair Cover',
    specs: [
      ['Material', '100% cotton'],
      ['Fit', 'Standard — fits most hotel banquet chairs'],
      ['Colors', 'White / black (custom colors available)'],
      ['Customization', 'Available upon request'],
    ],
    priceRange: '$7.00 per cover',
    applications: 'Formal events, wedding ceremonies, gala dinners — adds elegance to banquet setup.',
  },
  {
    name: 'Napkin — Plain (100% Cotton)',
    specs: [
      ['Material', '100% cotton'],
      ['Size', '55×55 cm — standard dinner napkin'],
      ['Colors', 'White or colored options'],
      ['Customization', 'Full embroidery and logo imposition available'],
    ],
    priceRange: 'White: $1.75 / napkin · Colored: $2.50 / napkin',
    applications: 'Fine dining, formal meals, upscale events.',
  },
  {
    name: 'Napkin — Plain (Poly-Cotton)',
    specs: [
      ['Material', 'Poly-cotton blend — easier care, faster drying'],
      ['Size', '55×55 cm'],
      ['Colors', 'White or colored options'],
      ['Customization', 'Available upon request'],
    ],
    priceRange: 'White: $1.50 / napkin · Colored: $2.00 / napkin',
    applications: 'Daily dining, casual service, high-volume operations requiring fast laundry turnaround.',
  },
  {
    name: 'Napkin — Satin Band',
    specs: [
      ['Material', '100% cotton with decorative satin band edge'],
      ['Size', '55×55 cm'],
      ['Colors', 'Multiple colors available'],
      ['Customization', 'Decorative edge — logo imposition also available'],
    ],
    priceRange: '$1.75 per napkin',
    applications: 'Upscale casual dining, boutique hotel restaurants seeking decorative presentation.',
  },
  {
    name: 'Napkin — Imposed IVY Design',
    specs: [
      ['Material', '100% cotton with IVY pattern imposition'],
      ['Size', '55×55 cm'],
      ['Colors', 'Multiple color combinations'],
      ['Customization', 'Custom hotel logo imposition available instead of IVY design'],
    ],
    priceRange: '$2.00 per napkin',
    applications: 'Branded restaurants, upscale dining, property signature service.',
  },
]

export default function FBLinenPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-driftwood">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">F&B Linen</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Food & Beverage</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">F&B Linen</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Premium tablecloths, napkins, and chair covers for fine dining, banquet facilities, and events.
            Available in 100% cotton for luxury presentation and poly-cotton blends for operational efficiency.
            Full customization with logo imposition and embroidery for brand-consistent dining experiences.
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
        </div>
      </section>
    </>
  )
}
