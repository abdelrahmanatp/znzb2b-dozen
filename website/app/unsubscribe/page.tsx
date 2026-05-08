'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleConfirm = async () => {
    setStatus('loading')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-narrow mx-auto text-center">
        <div className="bg-success-light border border-success/20 p-10">
          <h1 className="text-3xl font-heading font-medium text-onyx mb-4">Unsubscribed</h1>
          <p className="text-base font-body text-bark mb-3">
            You have been unsubscribed from Dozen Hotel Supplies marketing emails.
          </p>
          <p className="text-base font-body text-bark">
            We will not contact you again. If this was a mistake, email{' '}
            <a
              href="mailto:privacy@dozensupplies.com"
              className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              privacy@dozensupplies.com
            </a>
            .
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-narrow mx-auto text-center">
        <div className="bg-error-light border border-error/20 p-10">
          <h1 className="text-3xl font-heading font-medium text-onyx mb-4">Something went wrong</h1>
          <p className="text-base font-body text-bark">
            We could not process your unsubscribe request. Please email{' '}
            <a
              href="mailto:privacy@dozensupplies.com"
              className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              privacy@dozensupplies.com
            </a>{' '}
            directly and we will remove you within 48 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-narrow mx-auto text-center">
      <div className="bg-linen-light border border-cloud p-10">
        <h1 className="text-3xl md:text-4xl font-heading font-medium text-onyx mb-4">
          Unsubscribe
        </h1>

        {email ? (
          <p className="text-base font-body text-bark mb-8">
            You are unsubscribing{' '}
            <strong className="font-semibold text-onyx">{email}</strong> from Dozen Hotel Supplies
            marketing emails.
          </p>
        ) : (
          <p className="text-base font-body text-bark mb-8">
            Confirm that you wish to unsubscribe from Dozen Hotel Supplies marketing emails.
          </p>
        )}

        <button
          onClick={handleConfirm}
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center bg-terracotta text-white px-8 py-4 text-sm tracking-widest uppercase font-semibold font-body min-w-[200px] hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none disabled:bg-mist disabled:text-driftwood disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Processing…' : 'Confirm Unsubscribe'}
        </button>

        <p className="text-xs font-body text-driftwood mt-6">
          This will permanently stop all marketing communications. Transactional emails related to
          existing orders will not be affected.
        </p>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <>
      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx sr-only">
            Unsubscribe
          </h1>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <Suspense
            fallback={
              <div className="max-w-narrow mx-auto text-center">
                <p className="text-base font-body text-bark">Loading…</p>
              </div>
            }
          >
            <UnsubscribeContent />
          </Suspense>
        </div>
      </section>
    </>
  )
}
