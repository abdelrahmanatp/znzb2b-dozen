import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-onyx text-white">
      <div className="h-1 bg-terracotta" />
      <div className="max-w-site mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="font-heading font-medium text-xl tracking-[0.15em] uppercase text-white mb-4">
              DOZEN
            </p>
            <p className="text-sm font-body text-white/70 leading-relaxed">
              Premium Egyptian-origin hotel linen and supplies, delivered to Zanzibar.
            </p>
            <address className="not-italic text-sm font-body text-white/60 leading-relaxed mt-4">
              303 Silversand, Kibweni<br />
              P.O. Box 4212<br />
              Zanzibar, Tanzania
            </address>
          </div>

          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-white/50 mb-4">
              Navigation
            </p>
            <ul role="list" className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/about', label: 'About' },
                { href: '/quote', label: 'Request a Quote' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-body text-white/70 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-white/50 mb-4">
              Contact
            </p>
            <ul role="list" className="space-y-3">
              <li>
                <a
                  href="mailto:info@dozensupplies.com"
                  className="text-sm font-body text-white/70 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                >
                  info@dozensupplies.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@dozensupplies.com"
                  className="text-sm font-body text-white/70 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                >
                  privacy@dozensupplies.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-white/40">
            &copy; 2024 Dozen Hotel Supplies
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-body text-white/50 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/unsubscribe"
              className="text-xs font-body text-white/50 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
            >
              Unsubscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
