import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#021656' }} className="text-white">
      {/* Teal accent bar per Stitch secondary color */}
      <div className="h-[3px] bg-gold" />
      <div className="max-w-site mx-auto px-5 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-heading font-bold text-2xl tracking-[0.12em] uppercase text-white mb-4">
              DOZEN
            </p>
            <p className="text-sm font-body text-white/70 leading-relaxed max-w-xs">
              Premium Egyptian-origin hotel linen and supplies, delivered from local Zanzibar stock.
              Trusted by 30+ properties across East Africa.
            </p>
            <address className="not-italic text-sm font-body text-white/50 leading-relaxed mt-5">
              303 Silversand, Kibweni<br />
              P.O. Box 4212<br />
              Zanzibar, Tanzania
            </address>
          </div>

          <div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-white/60 mb-5">
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
                    className="text-sm font-body text-white/65 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-white/60 mb-5">
              Contact
            </p>
            <ul role="list" className="space-y-3">
              <li>
                <a
                  href="mailto:info@dozensupplies.com"
                  className="text-sm font-body text-white/65 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  info@dozensupplies.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@dozensupplies.com"
                  className="text-sm font-body text-white/50 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  privacy@dozensupplies.com
                </a>
              </li>
            </ul>

            {/* Product categories quick list */}
            <p className="text-xs font-body font-bold uppercase tracking-[0.12em] text-white/60 mb-3 mt-8">
              Products
            </p>
            <ul role="list" className="space-y-2">
              {['Towels', 'Bed Linen', 'Bedding', 'Bathrobes', 'F&B Linen'].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/products"
                    className="text-xs font-body text-white/50 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-white/55">
            &copy; {new Date().getFullYear()} Dozen Hotel Supplies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-body text-white/60 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/unsubscribe"
              className="text-xs font-body text-white/60 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Unsubscribe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
