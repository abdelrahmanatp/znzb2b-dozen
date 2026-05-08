'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

function makeVariants(delay: number, prefersReduced: boolean | null): Variants {
  if (prefersReduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3, delay } },
    }
  }
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const, delay },
    },
  }
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative w-full min-h-[88vh] flex items-end overflow-hidden"
      aria-label="Hero — Premium hotel linen for Zanzibar"
    >
      {/* Background — luxury hotel linen photography */}
      <Image
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1440&q=70&auto=format&fit=crop&fm=webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* Navy gradient overlay — bottom-heavy per Stitch editorial spec */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(2,22,86,0.95) 0%, rgba(2,22,86,0.70) 45%, rgba(2,22,86,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Editorial content — sits above overlay */}
      <div className="relative z-10 max-w-site mx-auto px-5 md:px-16 py-20 md:py-28 w-full">
        <div className="max-w-[700px]">
          <motion.p
            variants={makeVariants(0, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="text-xs font-body font-bold uppercase tracking-[0.15em] mb-5"
            style={{ color: '#74F6F6' }}
            aria-hidden="true"
          >
            Egyptian Heritage · Zanzibar Presence
          </motion.p>

          <motion.h1
            variants={makeVariants(0.1, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="font-heading font-bold text-white leading-[1.08] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
          >
            Elevating Hospitality to an Art Form.
          </motion.h1>

          <motion.p
            variants={makeVariants(0.22, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="text-lg font-body leading-relaxed mt-6 max-w-lg"
            style={{ color: 'rgba(255,255,255,0.80)' }}
          >
            Premium Egyptian-origin linen and supplies — towels, bed linen, bathrobes and more —
            delivered from local Zanzibar stock to luxury resorts, boutique hotels and guesthouses.
          </motion.p>

          <motion.div
            variants={makeVariants(0.34, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mt-10"
            role="group"
            aria-label="Primary actions"
          >
            {/* Primary — solid navy */}
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-body font-bold uppercase tracking-[0.12em] min-w-[200px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ backgroundColor: '#1D2D6B', color: '#ffffff' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#021656' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1D2D6B' }}
            >
              Request a Quote
            </Link>

            {/* Secondary — teal outline */}
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-body font-bold uppercase tracking-[0.12em] min-w-[200px] transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ borderColor: '#2BBDBD', color: '#74F6F6', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(43,189,189,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Browse Products
            </Link>
          </motion.div>

          <motion.div
            variants={makeVariants(0.48, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="mt-14 pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-md"
          >
            {[
              { value: '30+', label: 'Properties Supplied' },
              { value: '300+', label: 'Product SKUs' },
              { value: '15+', label: 'Years Experience' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-heading font-bold text-white">{value}</p>
                <p className="text-xs font-body uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
