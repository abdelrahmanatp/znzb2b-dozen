// website/app/quote/view/[token]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubmissionByToken } from '@/lib/quote/sheets'

export const metadata: Metadata = {
  title: 'Your Quote — Dozen Hotel Supplies',
}

// Revalidate every 60s so status updates from team are reflected
export const revalidate = 60

export default async function QuoteViewPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Validate token shape before hitting the database
  const { isValidSession } = await import('@/lib/quote/session')
  if (!isValidSession(token)) notFound()

  const submission = await getSubmissionByToken(token).catch(() => null)

  if (!submission) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dozensupplies.com'
  const viewUrl = `${appUrl}/quote/view/${token}`

  return (
    <div className="bg-linen min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        {/* Confirmation banner */}
        <div className="bg-terracotta-deep text-white p-8 mb-8">
          <div className="w-6 h-[2px] bg-gold mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-heading font-bold mb-2">Quote Submitted</h1>
          <p className="text-base font-body text-white/75">
            We&apos;ll respond within 2 business days with indicative pricing.
          </p>
        </div>

        {/* Permanent URL callout */}
        <div className="bg-white border border-cloud p-6 mb-6" style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}>
          <p className="text-xs font-body font-bold uppercase tracking-[0.1em] text-gold mb-2">
            Bookmark this page
          </p>
          <p className="text-sm font-body text-bark mb-3">
            This link is permanent. Return any time to view your submitted quote.
          </p>
          <code className="block text-xs font-mono bg-linen px-3 py-2 text-onyx break-all select-all">
            {viewUrl}
          </code>
        </div>

        {/* Submission details */}
        <div className="bg-white border border-cloud p-6 mb-6">
          <h2 className="text-lg font-heading font-semibold text-onyx mb-4">Submission Details</h2>
          <dl className="space-y-2 text-sm font-body">
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Property</dt>
              <dd className="text-onyx font-semibold">{submission.propertyName}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Contact</dt>
              <dd className="text-onyx">{submission.customerName} — {submission.customerEmail}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Submitted</dt>
              <dd className="text-onyx">{new Date(submission.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-bark w-32 shrink-0">Type</dt>
              <dd className="text-onyx capitalize">{submission.submissionType === 'both' ? 'Catalog items + Room configuration' : submission.submissionType === 'catalog' ? 'Catalog items' : 'Room configuration'}</dd>
            </div>
          </dl>
        </div>

        {/* Cart items */}
        {submission.cartItems.length > 0 && (
          <div className="bg-white border border-cloud p-6 mb-6">
            <h2 className="text-lg font-heading font-semibold text-onyx mb-4">
              Catalog Items ({submission.cartItems.length})
            </h2>
            <ul className="space-y-3">
              {submission.cartItems.map(item => (
                <li key={item.id} className="text-sm font-body border-b border-cloud pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between gap-4">
                    <span className="text-onyx font-semibold">{item.productName}</span>
                    <span className="text-bark shrink-0">×{item.quantity}</span>
                  </div>
                  <span className="text-bark text-xs">{item.category}</span>
                  {item.notes && <p className="text-bark mt-1">Note: {item.notes}</p>}
                  {item.customSizeRequest && (
                    <p className="text-bark mt-1 italic">Custom size: {item.customSizeRequest}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Room config */}
        {submission.roomConfig && (
          <div className="bg-white border border-cloud p-6 mb-6">
            <h2 className="text-lg font-heading font-semibold text-onyx mb-4">Room Configuration</h2>
            <dl className="space-y-2 text-sm font-body">
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Rooms</dt>
                <dd className="text-onyx font-semibold">{submission.roomConfig.roomCount}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Categories</dt>
                <dd className="text-onyx">{submission.roomConfig.categoriesPerRoom.join(', ')}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="text-bark w-40 shrink-0">Laundry frequency</dt>
                <dd className="text-onyx capitalize">{submission.roomConfig.laundryFrequency.replace(/-/g, ' ')}</dd>
              </div>
              {submission.roomConfig.notes && (
                <div className="flex gap-4">
                  <dt className="text-bark w-40 shrink-0">Notes</dt>
                  <dd className="text-onyx">{submission.roomConfig.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/quote/builder"
            className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            Submit a new quote
          </Link>
          <a
            href="mailto:info@dozensupplies.com"
            className="inline-flex items-center justify-center text-terracotta px-6 py-3 text-xs tracking-[0.12em] uppercase font-bold font-body hover:underline hover:underline-offset-4 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
          >
            Contact us directly
          </a>
        </div>
      </div>
    </div>
  )
}
