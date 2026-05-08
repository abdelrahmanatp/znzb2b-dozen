import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dozen Hotel Supplies — Premium Linen for Zanzibar Hotels',
  description:
    'Supplying luxury resorts, boutique hotels and guesthouses across Zanzibar with premium Egyptian cotton towels, bed linen, bathrobes and more.',
  keywords:
    'hotel linen Zanzibar, Egyptian cotton towels, hotel supplies Tanzania, bath towels, bed linen, bathrobes',
  openGraph: {
    title: 'Dozen Hotel Supplies — Premium Linen for Zanzibar Hotels',
    description:
      'Premium Egyptian-origin hotel linen and supplies delivered to Zanzibar. Trusted by 30+ properties including LUX*, Baraza and TUI Blue.',
    url: 'https://dozensupplies.com',
    siteName: 'Dozen Hotel Supplies',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://dozensupplies.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-linen text-onyx font-body min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
