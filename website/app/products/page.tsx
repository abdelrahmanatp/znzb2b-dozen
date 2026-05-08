import type { Metadata } from 'next'
import Image from 'next/image'
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
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Bed Linen',
    description:
      'Egyptian cotton and poly-cotton bed sheets, pillowcases, and duvet covers. Thread counts from 200–500 TC. Soft, durable, and available with logo imposition.',
    href: '/products/bed-linen',
    productCount: 5,
    priceFrom: 'From USD $13.04 / sheet',
    category: 'Bed Linen',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Bedding',
    description:
      'Pillows, duvet inserts, mattress toppers, protective covers, and decorative cushions. Hypoallergenic microfiber filling options tailored for Zanzibar\'s warm climate.',
    href: '/products/bedding',
    productCount: 8,
    priceFrom: 'From USD $2.00 / protector',
    category: 'Bedding',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'F&B Linen',
    description:
      'Tablecloths, napkins, and chair covers for fine dining, banquets, and events. 100% cotton and poly-cotton options. Full customization with logo imposition.',
    href: '/products/fb-linen',
    productCount: 7,
    priceFrom: 'From USD $1.50 / napkin',
    category: 'F&B Linen',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Bathrobes',
    description:
      'Terry, waffle weave, and velour bathrobes in sizes M–XXL. Lightweight waffle ideal for Zanzibar\'s warm climate. Logo embroidery on pocket or front.',
    href: '/products/bathrobes',
    productCount: 3,
    priceFrom: 'From USD $21.00 / robe',
    category: 'Bathrobes',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Slippers',
    description:
      'One-size-fits-all guest slippers in terry, waffle, and velour. Simplifies inventory. Slip-resistant sole. Custom embroidery with hotel branding available.',
    href: '/products/slippers',
    productCount: 3,
    priceFrom: 'From USD $1.10 / pair',
    category: 'Slippers',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Kitchen & Sanitation',
    description:
      'Kitchen towels, chef towels, glass cloths, and microfiber dusters for professional food service. Sold per dozen for efficient bulk ordering.',
    href: '/products/kitchen-sanitation',
    productCount: 4,
    priceFrom: 'From USD $6.00 / dozen',
    category: 'Kitchen & Sanitation',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  },
]

export default function ProductsPage() {
  return (
    <>
      {/* Editorial page header — dark navy with image */}
      <div className="relative bg-terracotta-deep overflow-hidden py-20 md:py-28 min-h-[320px] flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=60&auto=format&fit=crop&fm=webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-site mx-auto px-5 md:px-16 w-full">
          <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-gold mb-4">
            Curated Supplies
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
            Our Product Range
          </h1>
          <p className="text-lg font-body text-white/70 mt-4 max-w-prose-lg">
            Hospitality-grade linen and supplies, sourced to specification for Zanzibar properties.
          </p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-16">
          <h2 className="sr-only">Product Categories</h2>
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
