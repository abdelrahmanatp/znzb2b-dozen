import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dozen Hotel Supplies',
  description:
    'Privacy Policy for Dozen Hotel Supplies. How we collect, use, and protect personal data under the Tanzania Personal Data Protection Act 2022.',
}

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-sand py-16 md:py-20 border-b border-cloud">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-medium text-onyx">Privacy Policy</h1>
          <p className="text-sm font-body text-driftwood mt-3">Last updated: 2026-05-08</p>
        </div>
      </div>

      <section className="bg-linen py-16 md:py-24">
        <div className="max-w-site mx-auto px-5 md:px-8">
          <div className="max-w-prose-lg space-y-10 text-base font-body text-bark leading-relaxed">

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">1. Data Controller</h2>
              <p>
                The data controller responsible for your personal data is:
              </p>
              <address className="not-italic mt-4 bg-sand border border-cloud p-4 text-sm">
                <strong className="font-semibold text-onyx">Dozen Hotel Supplies</strong><br />
                303 Silversand, Kibweni<br />
                P.O. Box 4212<br />
                Zanzibar, Tanzania<br /><br />
                Data Protection Contact: <a href="mailto:privacy@dozensupplies.com" className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">privacy@dozensupplies.com</a>
              </address>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">2. Personal Data We Collect</h2>
              <p>We collect the following categories of personal data in connection with our B2B sales activities:</p>
              <ul className="mt-4 space-y-2 list-none">
                {[
                  'Full name and job title',
                  'Business email address',
                  'Business name and property type',
                  'Phone and WhatsApp number (where provided)',
                  'Business address',
                  'Communication preferences',
                  'Purchase history and enquiry records',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-1" aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                We do not collect or process sensitive personal data (special categories under Tanzania PDPA 2022, Section 32).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">3. Purpose of Processing</h2>
              <p>We process your personal data for the following purposes:</p>
              <ul className="mt-4 space-y-2 list-none">
                {[
                  'B2B sales outreach to hospitality businesses in Zanzibar regarding hotel linen and supplies',
                  'Responding to product enquiries and providing indicative pricing',
                  'Managing ongoing supply relationships and order fulfilment',
                  'Maintaining records of quotations, orders, and delivery communications',
                  'Compliance with our legal obligations under Tanzanian law',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-1" aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">4. Lawful Basis for Processing</h2>
              <p>
                We process your personal data on the basis of <strong className="text-onyx font-semibold">legitimate interests</strong> under
                Section 25 of the Tanzania Personal Data Protection Act No. 11 of 2022. Our legitimate interest is the promotion and sale
                of hotel linen and supplies to hospitality businesses operating in Zanzibar — businesses for whom our products are directly
                relevant and operationally necessary.
              </p>
              <p className="mt-4">
                We have conducted a Legitimate Interests Assessment (LIA) confirming that our processing does not override the rights and
                interests of the data subjects. As a B2B operation targeting procurement professionals at hospitality businesses, our
                outreach is relevant, non-intrusive, and proportionate.
              </p>
              <p className="mt-4">
                For existing clients, we process data under the <strong className="text-onyx font-semibold">performance of a contract</strong>{' '}
                (Section 24, Tanzania PDPA 2022) to fulfil orders, manage accounts, and provide after-sales support.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">5. How We Obtained Your Data</h2>
              <p>
                For prospective clients, we may have sourced your contact information from:
              </p>
              <ul className="mt-4 space-y-2 list-none">
                {[
                  'Google Maps and publicly listed business directories',
                  'Industry databases and hospitality associations',
                  'Public hotel websites and booking platforms',
                  'Professional networking and trade events',
                  'Referrals from existing clients or industry contacts',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-1" aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                All data sourced from third-party directories was publicly available at the time of collection and relates to your professional
                role at a hospitality business.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">6. Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-cloud text-left text-sm">
                  <thead>
                    <tr>
                      <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud">Data Category</th>
                      <th className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-b border-cloud">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Active prospects (never responded or purchased)', '12–24 months from initial contact'],
                      ['Qualified leads (responded, under consideration)', '24 months from last contact'],
                      ['Active clients', 'Duration of relationship + 5 years'],
                      ['Former clients', '5 years after last transaction'],
                      ['Unsubscribed contacts', 'Indefinitely — suppression list only (to prevent re-contact)'],
                      ['Financial records', '7 years (Tanzanian tax law requirement)'],
                    ].map(([cat, period]) => (
                      <tr key={cat}>
                        <td className="text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{cat}</td>
                        <td className="text-bark px-4 py-3 border-t border-cloud">{period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">7. Your Rights</h2>
              <p>Under the Tanzania Personal Data Protection Act 2022, you have the following rights:</p>
              <ul className="mt-4 space-y-3 list-none">
                {[
                  ['Right of access', 'Request a copy of the personal data we hold about you'],
                  ['Right to rectification', 'Request correction of inaccurate or incomplete data'],
                  ['Right to erasure', 'Request deletion of your personal data (subject to legal retention requirements)'],
                  ['Right to object', 'Object to our processing of your data based on legitimate interests at any time'],
                  ['Right to restrict processing', 'Request that we limit how we use your data while a dispute is resolved'],
                  ['Right to data portability', 'Request your data in a structured, machine-readable format'],
                ].map(([right, desc]) => (
                  <li key={right} className="flex items-start gap-3">
                    <span className="text-gold mt-1 flex-shrink-0" aria-hidden="true">—</span>
                    <span><strong className="text-onyx font-semibold">{right}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                To exercise any of these rights, email{' '}
                <a href="mailto:privacy@dozensupplies.com" className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">
                  privacy@dozensupplies.com
                </a>. We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">8. Unsubscribing from Marketing</h2>
              <p>
                You may opt out of marketing communications at any time by:
              </p>
              <ul className="mt-4 space-y-2 list-none">
                {[
                  'Clicking the unsubscribe link in any email we send you',
                  'Visiting our unsubscribe page at dozensupplies.com/unsubscribe',
                  'Emailing privacy@dozensupplies.com with your request',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-1" aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Unsubscribe requests are processed within 48 hours. Your email address is added to a permanent suppression list to prevent
                future contact. This does not affect communications required for the performance of an existing contract.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">9. Data Processors and Third-Party Transfers</h2>
              <p>
                We use the following third-party processors who may process your personal data on our behalf. Each operates under a
                Data Processing Agreement (DPA) and provides adequate data protection safeguards:
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse border border-cloud text-left text-sm">
                  <thead>
                    <tr>
                      {['Processor', 'Purpose', 'Location'].map((h) => (
                        <th key={h} className="text-xs uppercase tracking-wider text-driftwood font-semibold bg-sand px-4 py-2 border-r border-cloud border-b border-cloud last:border-r-0">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Google (Workspace & Maps)', 'Email, calendar, prospect research', 'USA'],
                      ['SendGrid / SMTP provider', 'Email delivery for outreach and transactional mail', 'USA'],
                      ['Anthropic Claude API', 'AI-assisted communication handling', 'USA'],
                    ].map(([processor, purpose, location]) => (
                      <tr key={processor}>
                        <td className="text-bark px-4 py-3 border-t border-cloud border-r border-cloud font-medium">{processor}</td>
                        <td className="text-bark px-4 py-3 border-t border-cloud border-r border-cloud">{purpose}</td>
                        <td className="text-bark px-4 py-3 border-t border-cloud">{location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                These transfers are made under standard contractual clauses or equivalent transfer mechanisms recognized by the Tanzania
                Personal Data Protection Commission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-medium text-onyx mb-4">10. Contact and Complaints</h2>
              <p>
                For any privacy-related queries or to exercise your rights, contact our data protection point of contact:
              </p>
              <p className="mt-3">
                <a href="mailto:privacy@dozensupplies.com" className="text-terracotta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">
                  privacy@dozensupplies.com
                </a>
              </p>
              <p className="mt-4">
                You also have the right to lodge a complaint with the Tanzania Personal Data Protection Commission (PDPC)
                if you believe we have not handled your data in accordance with the law.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
