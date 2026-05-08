// website/components/quote/QuoteSubmitForm.tsx
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  property: string
}

export default function QuoteSubmitForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const session = searchParams.get('s')

  const [form, setForm] = useState<FormData>({ name: '', email: '', property: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.property.trim()) e.property = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (!session) {
      setError('No active quote session. Please go back and build your quote first.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Load current draft to get cart + room config
      const draftRes = await fetch(`/api/quote/draft/${session}`)
      const { draft } = await draftRes.json()

      if (!draft) {
        setError('Could not find your quote. Please go back and rebuild it.')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/quote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionUuid: session,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          propertyName: form.property.trim(),
          cartItems: draft.cartItems ?? [],
          roomConfig: draft.roomConfig ?? null,
        }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}))
        throw new Error(msg ?? 'Submission failed')
      }

      const data = await res.json()
      if (!data.submissionId || typeof data.submissionId !== 'string') {
        throw new Error('Invalid response from server')
      }
      router.push(`/quote/view/${data.submissionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const fields = [
    { key: 'name' as const, label: 'Your Name', type: 'text', placeholder: 'Jane Smith' },
    { key: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'jane@luxuryresort.com' },
    { key: 'property' as const, label: 'Property Name', type: 'text', placeholder: 'The Grand Zanzibar Resort' },
  ]

  return (
    <div className="bg-linen min-h-screen py-16">
      <div className="max-w-lg mx-auto px-5 md:px-8">
        <Link
          href={session ? `/quote/builder?s=${session}` : '/quote/builder'}
          className="text-xs font-body text-terracotta hover:underline hover:underline-offset-4 mb-8 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          ← Back to quote builder
        </Link>

        <div className="bg-white border border-cloud p-8" style={{ boxShadow: '0 2px 8px rgba(29,45,107,0.06)' }}>
          <div className="w-6 h-[2px] bg-gold mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-heading font-semibold text-onyx mb-2">Submit Your Quote</h1>
          <p className="text-sm font-body text-bark mb-8">
            We&apos;ll respond within 2 business days with indicative pricing. You&apos;ll receive a permanent link to view your submitted quote.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-xs font-body font-bold uppercase tracking-[0.1em] text-onyx mb-2">
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                  className={`w-full border px-4 py-3 text-base font-body text-onyx placeholder:text-bark/60 focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors ${
                    errors[key] ? 'border-error ring-1 ring-error' : 'border-mist focus:border-terracotta'
                  }`}
                />
                {errors[key] && (
                  <p id={`${key}-error`} className="text-xs font-body text-error mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-error-light border border-error/20 px-4 py-3">
                <p className="text-sm font-body text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-terracotta text-white px-8 py-4 text-xs tracking-[0.12em] uppercase font-bold font-body hover:bg-terracotta-deep transition-colors duration-200 disabled:bg-mist disabled:text-bark disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none"
            >
              {submitting ? 'Submitting…' : 'Submit Quote Request →'}
            </button>

            <p className="text-xs font-body text-bark text-center">
              All pricing provided is indicative. Formal quotes require owner approval.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
