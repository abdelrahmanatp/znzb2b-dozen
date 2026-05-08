'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileOpen])

  const isHome = pathname === '/'

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome || mobileOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-mist shadow-nav'
          : 'bg-terracotta-deep border-b border-white/10'
      }`}
    >
      <div className="max-w-site mx-auto px-5 md:px-16 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading font-bold text-xl tracking-[0.12em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{ color: scrolled || !isHome || mobileOpen ? '#021656' : '#ffffff' }}
        >
          DOZEN
        </Link>

        {/* Desktop links — Label-Caps per Stitch spec */}
        <ul role="list" className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-xs font-body font-bold uppercase tracking-[0.12em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none ${
                  scrolled || !isHome || mobileOpen
                    ? pathname.startsWith(href)
                      ? 'text-terracotta border-b-2 border-terracotta pb-[2px]'
                      : 'text-bark hover:text-onyx'
                    : pathname.startsWith(href)
                      ? 'text-white border-b-2 border-white pb-[2px]'
                      : 'text-white/75 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA — teal, visually distinct */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-body font-bold uppercase tracking-[0.12em] text-gold-warm animate-pulse">
            ●
          </span>
          <Link
            href="/quote/builder"
            className="inline-flex items-center justify-center gap-2 bg-gold text-white px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body transition-colors duration-200 hover:bg-gold-warm focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none min-w-[160px]"
          >
            Build Your Quote
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className={`md:hidden p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none ${
            scrolled || !isHome || mobileOpen ? 'text-onyx' : 'text-white'
          }`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            ref={drawerRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden bg-white border-b border-mist w-full overflow-hidden"
          >
            <ul role="list" className="flex flex-col">
              {navLinks.map(({ href, label }) => (
                <li key={href} className="border-b border-cloud last:border-0">
                  <Link
                    href={href}
                    className={`block py-4 px-5 text-lg font-heading font-medium focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none ${
                      pathname.startsWith(href) ? 'text-terracotta' : 'text-onyx'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-5 my-4 flex flex-col gap-2">
              <Link
                href="/quote/builder"
                className="block w-full text-center bg-gold text-white px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-gold-warm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Build Your Quote →
              </Link>
              <Link
                href="/quote"
                className="block w-full text-center border border-mist text-bark px-6 py-2.5 text-xs tracking-[0.12em] uppercase font-bold font-body hover:border-onyx hover:text-onyx transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Quick Quote Form
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
