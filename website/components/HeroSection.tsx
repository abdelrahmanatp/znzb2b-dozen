'use client'

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

function makeVariants(delay: number, prefersReduced: boolean | null): Variants {
  if (prefersReduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3, delay } },
    }
  }
  return {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const, delay },
    },
  }
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative w-full min-h-[85vh] md:min-h-[90vh] flex items-center"
      style={{ backgroundColor: '#F5F0E8' }}
      aria-label="Hero — Premium hotel linen for Zanzibar"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 w-full">
        <div className="max-w-[720px]">
          <motion.p
            variants={makeVariants(0, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: '#B8860B', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            aria-hidden="true"
          >
            Egyptian Heritage · Zanzibar Presence
          </motion.p>

          <motion.h1
            variants={makeVariants(0.1, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="text-5xl leading-[1.05] tracking-[-0.03em]"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 300,
              color: '#1A1714',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            }}
          >
            Premium Hotel Linen, Sourced From Egypt. Delivered to Zanzibar.
          </motion.h1>

          <motion.p
            variants={makeVariants(0.2, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="text-lg leading-relaxed mt-6 max-w-lg"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              color: '#5C4A3A',
            }}
          >
            Supplying luxury resorts, boutique hotels and guesthouses across Zanzibar with towels,
            bed linen, bathrobes and more.
          </motion.p>

          <motion.div
            variants={makeVariants(0.3, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mt-10"
            role="group"
            aria-label="Primary actions"
          >
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-semibold min-w-[200px] transition-colors duration-200 focus-visible:outline-none"
              style={{
                backgroundColor: '#C4622D',
                color: '#ffffff',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#A34E22' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4622D' }}
            >
              Request a Quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-semibold min-w-[200px] transition-colors duration-200 border focus-visible:outline-none"
              style={{
                borderColor: '#C4622D',
                color: '#C4622D',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C4622D'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#C4622D'
              }}
            >
              Browse Products
            </Link>
          </motion.div>

          <motion.div
            variants={makeVariants(0.5, prefersReduced)}
            initial="hidden"
            animate="visible"
            className="mt-12 flex items-center gap-3"
          >
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                color: '#8C7B6B',
              }}
            >
              Trusted by 30+ properties across East Africa
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
