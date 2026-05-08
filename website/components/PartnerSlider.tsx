'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Partner {
  name: string
  url: string
  domain: string
}

const partners: Partner[] = [
  { name: 'TUI Blue',              url: 'https://www.tuiblue.com',                domain: 'tuiblue.com' },
  { name: 'LUX* Resorts',          url: 'https://www.luxresorts.com',             domain: 'luxresorts.com' },
  { name: 'Neptune Hotels',        url: 'https://www.neptunehotels.com',          domain: 'neptunehotels.com' },
  { name: 'Baraza Resort & Spa',   url: 'https://www.baraza-resort.com',          domain: 'baraza-resort.com' },
  { name: 'Fundu Lagoon',          url: 'https://www.fundulagoon.com',            domain: 'fundulagoon.com' },
  { name: 'The Manta Resort',      url: 'https://www.themantaresort.com',         domain: 'themantaresort.com' },
  { name: 'Zawadi Hotel',          url: 'https://www.zawadi.com',                 domain: 'zawadi.com' },
  { name: 'Chumbe Island',         url: 'https://www.chumbeisland.com',           domain: 'chumbeisland.com' },
  { name: 'Matemwe Lodge',         url: 'https://www.matemwe.com',                domain: 'matemwe.com' },
  { name: 'Zanzibar Collection',   url: 'https://www.zanzibarcollection.com',     domain: 'zanzibarcollection.com' },
]

function PartnerCard({ partner }: { partner: Partner }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${partner.name}`}
      className="group flex flex-col items-center justify-center gap-2 bg-white border border-cloud px-6 py-5 w-[180px] h-[100px] flex-shrink-0 hover:border-gold hover:shadow-card-hover transition-all duration-200"
    >
      {!imgFailed ? (
        <>
          <Image
            src={`https://logo.clearbit.com/${partner.domain}?size=80`}
            alt={`${partner.name} logo`}
            width={48}
            height={32}
            className="object-contain max-h-8 opacity-60 group-hover:opacity-90 transition-opacity duration-200"
            onError={() => setImgFailed(true)}
            unoptimized
          />
          <span className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-driftwood group-hover:text-bark transition-colors duration-200 text-center leading-tight">
            {partner.name}
          </span>
        </>
      ) : (
        <span className="text-xs font-heading font-semibold text-bark group-hover:text-onyx transition-colors duration-200 text-center leading-snug px-1">
          {partner.name}
        </span>
      )}
    </a>
  )
}

export default function PartnerSlider() {
  const prefersReduced = useReducedMotion()
  const doubled = [...partners, ...partners]

  if (prefersReduced) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {partners.map((p) => (
          <PartnerCard key={p.domain} partner={p} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Edge fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }}
        aria-hidden="true"
      />

      {/* Marquee track */}
      <div
        className="flex gap-4 w-max animate-[marquee-x_45s_linear_infinite] hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {doubled.map((p, i) => (
          <PartnerCard key={`${p.domain}-${i}`} partner={p} />
        ))}
      </div>

      {/* Accessible list hidden from view but available to screen readers */}
      <ul className="sr-only">
        {partners.map((p) => (
          <li key={p.domain}>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
