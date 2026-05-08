import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Bedding — Dozen Hotel Supplies',
  description:
    'Hotel bedding for Zanzibar: pillows, duvet inserts, mattress protectors, and decorative cushions. Hypoallergenic microfiber, water-resistant options.',
}

const products = [
  {
    name: 'Pillows — Virgin Microfiber Filling',
    specs: [
      ['Material', '150 TC poly-cotton cover with virgin microfiber filling'],
      ['Sizes', '50×70 cm · 50×90 cm · 70×90 cm (king beds)'],
      ['Fill Weights', '800g (warm climates) · 1000g (standard) · 1200g (medium-heavy) · 1400g (premium support)'],
      ['Hypoallergenic', 'Yes — suitable for all guest types'],
    ],
    priceRange: '$7.00–$11.75 per pillow',
    applications: 'Luxury resorts use 1200–1400g; boutique hotels 1000g; villas and guesthouses 800g for cost efficiency.',
  },
  {
    name: 'Duvet Inserts',
    specs: [
      ['Material', '200 TC poly-cotton cover'],
      ['Sizes', '220×215 cm · 220×260 cm'],
      ['Fill Weights', '150 GSM (tropical/light) · 200 GSM (standard hotel) · 250 GSM (cool season)'],
    ],
    priceRange: '$22.00–$28.00 per duvet',
    applications: '150 GSM is ideal for Zanzibar\'s warm climate. 200 GSM for air-conditioned rooms. Pairs with duvet covers from our bed linen range.',
  },
  {
    name: 'Mattress Topper',
    specs: [
      ['Material', 'Virgin microfiber or quilted construction'],
      ['Sizing', 'Custom specifications on request'],
      ['Purpose', 'Adds comfort layer to firm mattresses; extends mattress lifespan'],
    ],
    priceRange: 'Contact for quote',
    applications: 'Ideal for luxury resorts enhancing guest sleep comfort, or older mattresses needing rejuvenation.',
  },
  {
    name: 'Pillow Protector — Standard (Poly-Cotton)',
    specs: [
      ['Material', '150 TC poly-cotton with inner zipper'],
      ['Sizes', '50×70 cm · 50×90 cm · 70×90 cm'],
      ['Protection', 'Prevents staining from body oils, spills, and cosmetics'],
    ],
    priceRange: '$2.00–$3.00 per protector',
    applications: 'Cost-effective protection for standard guest pillows. High-volume properties benefit most.',
  },
  {
    name: 'Pillow Protector — Premium (Terry Microfiber)',
    specs: [
      ['Material', 'Terry microfiber with inner zipper and water-resistant treatment'],
      ['Sizes', '50×70 cm · 50×90 cm · 70×90 cm'],
      ['Protection', 'Complete water-resistant barrier — prevents liquid damage'],
    ],
    priceRange: '$4.00–$5.50 per protector',
    applications: 'Ideal for high-traffic properties or resorts near water amenities — spas, pools, beach.',
  },
  {
    name: 'Mattress Protector — Quilted Pad (4-Corner Band)',
    specs: [
      ['Material', 'Quilted poly-cotton with water-resistant treatment'],
      ['Closure', '4-corner band (optional elastic corners)'],
      ['Features', 'Water-resistant · Machine washable · Dryer-friendly'],
    ],
    priceRange: 'Contact for quote',
    applications: 'Simple, effective barrier protecting the mattress top surface from spills and staining.',
  },
  {
    name: 'Mattress Protector — Quilted Pad (Skirted & Fitted)',
    specs: [
      ['Material', 'Quilted poly-cotton with water-resistant treatment'],
      ['Closure', 'Fully skirted fitted design — covers sides and bottom'],
      ['Features', 'Water-resistant · Complete coverage · Dryer-friendly'],
    ],
    priceRange: 'Contact for quote',
    applications: 'Premium option providing full mattress protection; hides under bedding for a clean aesthetic.',
  },
  {
    name: 'Decorative Cushions',
    specs: [
      ['Material', 'Poly-cotton cover with microfiber fill'],
      ['Size', '45×45 cm'],
      ['Options', 'Case only (no fill) or case + pillow'],
      ['Customization', 'Custom patterns, logo imposition, decorative embroidery, color matching'],
    ],
    priceRange: 'Case only: $7.50 · Case + pillow: $10.50',
    applications: 'Aesthetic accent for luxury resort rooms; available with hotel branding.',
  },
]

export default function BeddingPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-bark">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Bedding</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Bedding</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Bedding & Comfort</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Pillows, duvet inserts, mattress protectors, and decorative cushions designed for hospitality use.
            Hypoallergenic microfiber filling, water-resistant protection options, and full customization for
            brand-consistent room presentation across every property grade.
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
