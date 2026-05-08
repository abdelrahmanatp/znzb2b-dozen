'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

interface ProductCardProps {
  title: string
  description: string
  href: string
  productCount?: number
  priceFrom?: string
  category?: string
}

export default function ProductCard({
  title,
  description,
  href,
  productCount,
  priceFrom,
  category,
}: ProductCardProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.article
      whileHover={prefersReduced ? {} : { y: -2, boxShadow: '0 8px 24px rgba(26,23,20,0.08)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-linen-light border border-cloud overflow-hidden flex flex-col shadow-card"
      aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="aspect-[4/3] w-full bg-sand flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-sand flex items-end p-6">
          {category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-body font-semibold uppercase tracking-wider bg-cloud text-bark rounded-full">
              {category}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {productCount !== undefined && (
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-driftwood mb-2">
            {productCount} products
          </p>
        )}

        <h3
          id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-xl font-heading font-medium text-onyx leading-snug mb-3"
        >
          {title}
        </h3>

        <p className="text-sm font-body text-bark leading-relaxed line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {priceFrom && (
          <p className="text-sm font-body font-medium text-terracotta mb-4">
            {priceFrom} — indicative pricing
          </p>
        )}

        <Link
          href={href}
          className="text-terracotta bg-transparent hover:underline hover:underline-offset-4 text-sm font-body font-medium focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none self-start"
        >
          View Range &rarr;
        </Link>
      </div>
    </motion.article>
  )
}
