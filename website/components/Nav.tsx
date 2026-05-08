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
    const handleScroll = () => setScrolled(window.scrollY > 80)
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

  return (
    <nav
      aria-label="Main navigation"
      className={`bg-linen/95 backdrop-blur-sm sticky top-0 z-50 border-b border-cloud transition-shadow duration-200 ${
        scrolled ? 'shadow-nav' : ''
      }`}
    >
      <div className="max-w-site mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-medium text-onyx text-xl tracking-[0.15em] uppercase focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          DOZEN
        </Link>

        <ul role="list" className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-xs font-body font-semibold uppercase tracking-widest transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none ${
                  pathname.startsWith(href)
                    ? 'text-terracotta border-b border-terracotta pb-[2px]'
                    : 'text-bark hover:text-onyx'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block ml-8">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 bg-terracotta text-white px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body transition-colors duration-200 hover:bg-terracotta-deep focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none min-w-[160px]"
          >
            Request a Quote
          </Link>
        </div>

        <button
          ref={hamburgerRef}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-onyx focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            ref={drawerRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden bg-linen border-b border-cloud w-full overflow-hidden"
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
            <div className="mx-5 my-4">
              <Link
                href="/quote"
                className="block w-full text-center bg-terracotta text-white px-6 py-3 text-sm tracking-wider uppercase font-semibold font-body hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
