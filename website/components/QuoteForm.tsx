'use client'

import { useState } from 'react'

const PRODUCT_CATEGORIES = [
  'Bath Towels',
  'Bed Linen',
  'Bedding',
  'F&B Linen',
  'Bathrobes',
  'Slippers',
  'Kitchen & Sanitation',
]

const PROPERTY_TYPES = [
  'Resort',
  'Boutique Hotel',
  'Lodge',
  'Villa',
  'Guesthouse',
  'Other',
]

const QUANTITY_OPTIONS = [
  '10–50 units',
  '50–200 units',
  '200–500 units',
  '500+ units',
]

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const validate = (form: HTMLFormElement): Record<string, string> => {
    const data = new FormData(form)
    const errs: Record<string, string> = {}
    if (!data.get('propertyName')) errs.propertyName = 'Property name is required'
    if (!data.get('propertyType')) errs.propertyType = 'Property type is required'
    if (!data.get('contactName')) errs.contactName = 'Contact name is required'
    const email = data.get('email') as string
    if (!email) errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email'
    if (selectedCategories.length === 0) errs.categories = 'Please select at least one product category'
    if (!data.get('message')) errs.message = 'Please include a message or special requirements'
    return errs
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(e.currentTarget)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const form = e.currentTarget
    const data = new FormData(form)

    const subject = encodeURIComponent(
      `Quote Request — ${data.get('propertyName')} (${data.get('propertyType')})`
    )
    const body = encodeURIComponent(
      `Property: ${data.get('propertyName')}\nProperty Type: ${data.get('propertyType')}\nContact: ${data.get('contactName')}\nEmail: ${data.get('email')}\nWhatsApp: ${data.get('whatsapp') || 'Not provided'}\n\nProducts of Interest:\n${selectedCategories.join(', ')}\n\nEstimated Quantity: ${data.get('quantity') || 'Not specified'}\n\nMessage:\n${data.get('message')}`
    )

    window.location.href = `mailto:info@dozensupplies.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-narrow mx-auto px-5 md:px-0 py-16 text-center">
        <div className="bg-success-light border border-success/20 p-8">
          <p className="text-2xl font-heading font-medium text-onyx mb-3">Thank you</p>
          <p className="text-base font-body text-bark">
            We&apos;ll be in touch within 2 business days with indicative pricing and availability.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Request a quote from Dozen Hotel Supplies"
      className="max-w-narrow mx-auto space-y-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="propertyName" className="text-sm font-body font-semibold text-espresso">
          Property Name <span aria-hidden="true" className="text-error">*</span>
        </label>
        <input
          id="propertyName"
          name="propertyName"
          type="text"
          required
          aria-required="true"
          aria-describedby={errors.propertyName ? 'propertyName-error' : undefined}
          aria-invalid={errors.propertyName ? 'true' : undefined}
          placeholder="e.g. Baraza Resort & Spa"
          className={`w-full bg-white border text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta ${
            errors.propertyName ? 'border-error ring-1 ring-error bg-error-light/20' : 'border-mist'
          }`}
        />
        {errors.propertyName && (
          <p id="propertyName-error" className="text-sm font-body text-error mt-1.5">
            {errors.propertyName}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="propertyType" className="text-sm font-body font-semibold text-espresso">
          Property Type <span aria-hidden="true" className="text-error">*</span>
        </label>
        <select
          id="propertyType"
          name="propertyType"
          required
          aria-required="true"
          aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
          aria-invalid={errors.propertyType ? 'true' : undefined}
          className={`w-full bg-white border text-onyx px-4 py-3 text-base font-body rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta appearance-none cursor-pointer ${
            errors.propertyType ? 'border-error ring-1 ring-error bg-error-light/20' : 'border-mist'
          }`}
        >
          <option value="">Select property type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.propertyType && (
          <p id="propertyType-error" className="text-sm font-body text-error mt-1.5">
            {errors.propertyType}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contactName" className="text-sm font-body font-semibold text-espresso">
          Contact Name <span aria-hidden="true" className="text-error">*</span>
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          required
          aria-required="true"
          aria-describedby={errors.contactName ? 'contactName-error' : undefined}
          aria-invalid={errors.contactName ? 'true' : undefined}
          placeholder="Your full name"
          className={`w-full bg-white border text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta ${
            errors.contactName ? 'border-error ring-1 ring-error bg-error-light/20' : 'border-mist'
          }`}
        />
        {errors.contactName && (
          <p id="contactName-error" className="text-sm font-body text-error mt-1.5">
            {errors.contactName}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-body font-semibold text-espresso">
          Email Address <span aria-hidden="true" className="text-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
          placeholder="procurement@yourproperty.com"
          className={`w-full bg-white border text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta ${
            errors.email ? 'border-error ring-1 ring-error bg-error-light/20' : 'border-mist'
          }`}
        />
        {errors.email && (
          <p id="email-error" className="text-sm font-body text-error mt-1.5">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-sm font-body font-semibold text-espresso">
          WhatsApp Number{' '}
          <span className="text-driftwood font-normal">(optional)</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="+255 7XX XXX XXX"
          className="w-full bg-white border border-mist text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-body font-semibold text-espresso mb-3">
          Products of Interest{' '}
          <span aria-hidden="true" className="text-error">*</span>
        </legend>
        {errors.categories && (
          <p id="categories-error" className="text-sm font-body text-error mb-2">
            {errors.categories}
          </p>
        )}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          aria-describedby={errors.categories ? 'categories-error' : undefined}
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                name="categories"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 border-mist text-terracotta focus:ring-terracotta focus:ring-offset-0 rounded-none"
              />
              <span className="text-sm font-body text-bark group-hover:text-onyx transition-colors duration-150">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quantity" className="text-sm font-body font-semibold text-espresso">
          Estimated Quantity{' '}
          <span className="text-driftwood font-normal">(optional)</span>
        </label>
        <select
          id="quantity"
          name="quantity"
          className="w-full bg-white border border-mist text-onyx px-4 py-3 text-base font-body rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta appearance-none cursor-pointer"
        >
          <option value="">Select estimated quantity</option>
          {QUANTITY_OPTIONS.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-body font-semibold text-espresso">
          Message / Special Requirements <span aria-hidden="true" className="text-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          aria-required="true"
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={errors.message ? 'true' : undefined}
          placeholder="Please describe your requirements, room count, preferred colors, or any customisation needs..."
          className={`w-full bg-white border text-onyx px-4 py-3 text-base font-body placeholder:text-driftwood rounded-none focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta resize-y min-h-[120px] max-h-[400px] ${
            errors.message ? 'border-error ring-1 ring-error bg-error-light/20' : 'border-mist'
          }`}
        />
        {errors.message && (
          <p id="message-error" className="text-sm font-body text-error mt-1.5">
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-terracotta text-white px-8 py-4 text-sm tracking-widest uppercase font-semibold font-body min-w-[200px] hover:bg-terracotta-deep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Send Enquiry
        </button>
        <p className="text-xs font-body text-driftwood mt-3">
          All pricing provided is indicative. Formal quotes require owner approval.
        </p>
      </div>
    </form>
  )
}
