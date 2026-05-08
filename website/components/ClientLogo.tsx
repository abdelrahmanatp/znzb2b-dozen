'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ClientLogoProps {
  name: string
}

export default function ClientLogo({ name }: ClientLogoProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      whileHover={prefersReduced ? {} : { scale: 1.04 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-cloud p-4 flex items-center justify-center h-[100px] md:h-[120px] hover:border-mist hover:shadow-sm transition-shadow duration-200 cursor-default"
      role="img"
      aria-label={`${name} — hotel client of Dozen`}
    >
      <span className="text-sm font-body font-medium text-bark text-center leading-tight">
        {name}
      </span>
    </motion.div>
  )
}
