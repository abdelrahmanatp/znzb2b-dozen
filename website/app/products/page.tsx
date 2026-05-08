import type { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import SectionReveal from '@/components/SectionReveal'

export const metadata: Metadata = {
  title: 'Our Product Range — Dozen Hotel Supplies',
  description:
    'Browse our full range of hospitality-grade linen and supplies for Zanzibar hotels: towels, bed linen, bedding, F&B linen, bathrobes, slippers, and kitchen textiles.',
}

const productCategories = [
  {
    title: 'Bath Towels',
    description:
      'Premium 100% Egyptian cotton towels in 6 styles and 9 sizes. From face towels to oversized pool sheets, in weights from 450–900 GSM. Custom embroidery available.',
    href: '/products/towels',
    productCount: 6,
    priceFrom: 'From USD $0.95 / unit',
    category: 'Bath Towels',
  },
  {
    title: 'Bed Linen',
    description:
      'Egyptian cotton and poly-cotton bed sheets, pillowcases, and duvet covers. Thread counts from 200–500 TC. Soft, durable, and available with logo imposition.',
    href: '/products/bed-linen',
    productCount: 5,
    priceFrom: 'From USD $13.04 / sheet',
    category: 'Bed Linen',
  },
  {
    title: 'Bedding',
    description:
      'Pillows, duvet inserts, mattress toppers, protective covers, and decorative cushions. Hypoallergenic microfiber filling options tailored for Zanzibar\'s warm climate.',
    href: '/products/bedding',
    productCount: 8,
    priceFrom: 'From USD $2.00 / protector',
    category: 'Bedding',
  },
  {
    title: 'F&B Linen',
    description:
      'Tablecloths, napkins, and chair covers for fine dining, banquets, and events. 100% cotton and poly-cotton options. Full customization with logo imposition.',
    href: '/products/fb-linen',
    productCount: 7,
    priceFrom: 'From USD $1.50 / napkin',
    category: 'F&B Linen',
  },
  {
    title: 'Bathrobes',
    description:
      'Terry, waffle weave, and velour bathrobes in sizes M–XXL. Lightweight waffle ideal for Zanzibar\'s warm climate. Logo embroidery on pocket or front.',
    href: '/products/bathrobes',
    productCount: 3,
    priceFrom: 'From USD $21.00 / robe',
    category: 'Bathrobes',
  },
  {
    title: 'Slippers',
    description:
      'One-size-fits-all guest slippers in terry, waffle, and velour. Simplifies inventory. Slip-resistant sole. Custom embroidery with hotel branding available.',
    href: '/products/slippers',
    productCount: 3,
    priceFrom: 'From USD $1.10 / pair',
    category: 'Slippers',
  },
  {
    title: 'Kitchen & Sanitation',
    description:
      'Kitchen towels, chef towels, glass cloths, and microfiber dusters for professional food service. Sold per dozen for efficient bulk ordering.',
    href: '/products/kitchen-sanitation',
    productCount: 4,
    priceFrom: 'From USD $6.00 / dozen',
    category: 'Kitchen & Sanitation',
  },
]

export default function ProductsPage() {
  return (
    <>
      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold mb-4">
            Product Catalog
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">
            Our Product Range
          </h1>
          <p className="text-lg font-body text-bark mt-4 max-w-prose-lg">
            Hospitality-grade linen and supplies, sourced to spec for Zanzibar properties.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {productCategories.map((cat, i) => (
              <SectionReveal key={cat.title} delay={i * 0.06}>
                <ProductCard {...cat} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
