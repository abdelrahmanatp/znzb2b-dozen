import type { Metadata } from 'next'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Slippers — Dozen Hotel Supplies',
  description:
    'Hotel guest slippers for Zanzibar properties: terry, waffle, and velour. One-size-fits-all design. Custom embroidery available. From $1.10 per pair.',
}

const products = [
  {
    name: 'Slipper — Terry Cotton (OSFA)',
    material: '100% cotton terry cloth',
    feel: 'Soft, cushioned — plush backing with slip-resistant sole',
    colors: 'White ($1.10 / pair) · Colored options, e.g. blue, pink, grey ($1.50 / pair)',
    customization: 'Embroidery with hotel name or logo available',
    priceRange: '$1.10–$1.50 per pair',
    applications: 'All property grades. Standard guest room amenity. High-volume operations requiring cost efficiency.',
  },
  {
    name: 'Slipper — Waffle Weave (OSFA)',
    material: '100% cotton waffle weave',
    feel: 'Lightweight, breathable, quick-drying — ideal for warm climates',
    colors: 'White',
    customization: 'Embroidery with hotel branding available',
    priceRange: '$1.25 per pair',
    applications: 'Luxury resorts and boutique hotels. Spa facilities. Properties in warm, humid climates like Zanzibar.',
  },
  {
    name: 'Slipper — Velour (OSFA)',
    material: '100% cotton velour',
    feel: 'Plush, luxurious — premium guest perception',
    colors: 'White · Multiple colors available',
    customization: 'Full embroidery and logo imposition available',
    priceRange: '$1.25 per pair',
    applications: 'High-end luxury resorts. Spa and wellness suites. Premium guest room amenities. Gift-quality presentation.',
  },
]

const comparisonData = [
  { feature: 'Absorbency', terry: 'Excellent', waffle: 'Good', velour: 'Moderate' },
  { feature: 'Drying Speed', terry: 'Moderate', waffle: 'Fast', velour: 'Moderate' },
  { feature: 'Texture', terry: 'Soft, cushioned', waffle: 'Crisp, textured', velour: 'Plush, luxurious' },
  { feature: 'Weight', terry: 'Medium', waffle: 'Light', velour: 'Medium' },
  { feature: 'Best Climate', terry: 'All', waffle: 'Warm', velour: 'All' },
  { feature: 'Luxury Perception', terry: 'Standard', waffle: 'Modern', velour: 'Premium' },
  { feature: 'Indicative Price', terry: '$1.10–$1.50', waffle: '$1.25', velour: '$1.25' },
]

export default function SlippersPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-linen border-b border-cloud py-3 px-5 md:px-8">
        <ol className="max-w-site mx-auto flex items-center gap-2 text-xs font-body text-bark">
          <li><Link href="/" className="hover:text-onyx transition-colors duration-150">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-onyx transition-colors duration-150">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-bark font-medium">Slippers</li>
        </ol>
      </nav>

      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">Slippers</p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Guest Slippers</h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Premium one-size-fits-all guest slippers in terry, waffle, and velour. OSFA design simplifies
            inventory while ensuring comfort for all guests. All styles feature slip-resistant soles, durable
            cotton construction, and custom embroidery capability for brand-consistent presentation.
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
                          ['Size', 'One size fits all (sizes 5–11)'],
                          ['Colors', product.colors],
                          ['Customization', product.customization],
                        ].map(([label, value]) => (
                          <tr key={label}>
                            <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 w-2/5 border-r border-cloud border-t border-cloud">
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
              <h2 className="text-2xl font-heading font-medium text-onyx mb-6">Material Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-cloud text-left">
                  <thead>
                    <tr>
                      <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Feature</th>
                      <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Terry</th>
                      <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Waffle</th>
                      <th className="text-xs uppercase tracking-wider text-bark font-semibold bg-sand px-4 py-2 border-b border-cloud">Velour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map(({ feature, terry, waffle, velour }) => (
                      <tr key={feature}>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud font-medium">{feature}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{terry}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{waffle}</td>
                        <td className="text-sm text-bark px-4 py-3 border-t border-cloud">{velour}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs font-body text-bark mt-4">
                All prices are indicative and exclude VAT. Bulk discounts for 100+ pairs. Lead times for custom embroidery: 2–4 weeks from order confirmation.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
