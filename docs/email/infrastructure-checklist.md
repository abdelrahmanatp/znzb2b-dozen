# Email Infrastructure Setup Checklist — Dozen Hotel Supplies

**Status:** APPROVED  
**Created:** 2026-05-08  
**Sending domain:** outreach.dozensupplies.com (new subdomain for cold outreach)  
**Email provider:** SendGrid (recommended) or equivalent ESP  
**Timeline:** Complete steps 1–6 before warmup begins (Week 1)  

---

## Overview

This checklist guides the setup of a dedicated email sending infrastructure for cold outreach to the 522 hotel prospects. A new subdomain (not the main info@dozensupplies.com) is required for deliverability, compliance, and reputation isolation.

**Key principle:** Cold outreach domain must be separate from company domain to prevent reputational damage to info@dozensupplies.com if any deliverability issues occur.

---

## Phase 1: Domain Setup (Abbie + Developer)

### 1.1 Create Subdomain in DNS

**Owner:** Developer (with Abbie approval)

- [ ] Log into Dozen's domain registrar (e.g., GoDaddy, Namecheap, CloudFlare — confirm which one)
- [ ] Create new subdomain: `outreach.dozensupplies.com`
- [ ] Set subdomain to point to SendGrid (or your ESP) — SendGrid will provide the CNAME target in step 2.1
- [ ] Allow 24–48 hours for DNS propagation before testing
- [ ] Verify propagation: `nslookup outreach.dozensupplies.com` should resolve

**Questions for developer:**
- Which registrar hosts dozensupplies.com DNS currently?
- Is DNS managed by registrar or separate service (CloudFlare)?
- Can you add CNAME records in the control panel?

**Expected outcome:** Subdomain registered and resolving. SendGrid will verify ownership in step 2.1.

---

## Phase 2: SendGrid Account & Domain Authentication (Developer)

### 2.1 SendGrid Account & Domain Verification

**Owner:** Developer

**Steps:**
1. [ ] **Create/access SendGrid account:** Go to sendgrid.com → Sign up or log in
   - Use company email (info@dozensupplies.com) as primary contact
   - Ensure billing contact is authorized (Abbie or designated finance contact)

2. [ ] **Navigate to Sender Verification:** Settings → Sender Authentication
   - Option: Authenticate single sender (info@dozensupplies.com only) OR authenticate full domain (outreach.dozensupplies.com for all senders)
   - **Recommendation:** Authenticate full domain (outreach.dozensupplies.com) — allows flexible sender addresses (e.g., hello@outreach.dozensupplies.com, noreply@outreach.dozensupplies.com) without re-verifying

3. [ ] **Follow SendGrid domain verification workflow:**
   - Select "Authenticate your domain"
   - Enter domain: `outreach.dozensupplies.com`
   - SendGrid provides 3 DNS records (CNAME, SPF, DKIM) — copy these exactly

4. [ ] **Add DNS records to registrar (see Phase 3)**

5. [ ] **Return to SendGrid to verify:** Click "Verify" button in SendGrid dashboard
   - May take 24–48 hours for DNS to propagate before clicking Verify
   - If verification fails: check DNS propagation with MXToolbox.com (free)

**Expected outcome:** SendGrid confirms domain authenticated. Green checkmark in Sender Authentication dashboard.

### 2.2 (Optional) Request Dedicated IP

**Owner:** Developer + Abbie decision

**Context:** SendGrid offers shared IPs (free, slower warm-up) or dedicated IPs (paid, faster warm-up, better reputation isolation).

**Decision tree:**
- **Volume >100K emails/month?** → Recommend dedicated IP (e.g., 2–3 IPs for redundancy)
- **Volume <100K/month?** → Shared IP acceptable
- **This project:** ~1,500 sends over 6 weeks = ~400/week = ~1,700/month at peak → **Borderline.** Shared IP is acceptable; dedicated IP preferred if budget allows.

**If requesting dedicated IP:**
- [ ] Contact SendGrid sales or upgrade account: Settings → IP Addresses → Request Dedicated IP
- [ ] SelectIP warmup plan (SendGrid auto-warms based on historical sending patterns)
- [ ] Cost: ~$30–60/month per IP
- [ ] Timeline: 1–2 business days to provision

**Expected outcome:** Dedicated IP assigned (if requested). SendGrid provides IP address.

---

## Phase 3: DNS Records (Developer, Guided by SendGrid)

### 3.1 Add SPF Record

**Owner:** Developer  
**What it is:** SPF (Sender Policy Framework) tells mail servers: "Only SendGrid (and these other servers) can send email on behalf of outreach.dozensupplies.com"

**Steps:**

1. [ ] **From SendGrid domain verification screen, copy the SPF record** (looks like):
   ```
   TXT record name: outreach.dozensupplies.com
   TXT record value: v=spf1 sendgrid.net ~all
   ```

2. [ ] **Add to DNS registrar:**
   - Log into domain registrar (GoDaddy, Namecheap, CloudFlare, etc.)
   - DNS → TXT Records (or Records)
   - Create new TXT record:
     - **Name:** outreach.dozensupplies.com (or @ if root; depends on registrar)
     - **Value:** v=spf1 sendgrid.net ~all
   - Save

3. [ ] **Verify in 24–48 hours:**
   ```bash
   dig outreach.dozensupplies.com TXT
   # Should return SPF record above
   ```

**Common gotcha:** If dozensupplies.com already has an SPF record, do NOT replace it. Instead, add SendGrid to the existing record:
- Old: `v=spf1 include:mailprovider.com ~all`
- New: `v=spf1 include:mailprovider.com sendgrid.net ~all`

**Expected outcome:** SPF record published and verifiable via DNS lookup.

### 3.2 Add DKIM Record(s)

**Owner:** Developer  
**What it is:** DKIM (DomainKeys Identified Mail) cryptographically signs outgoing emails so recipients know they're legitimate.

**Steps:**

1. [ ] **From SendGrid domain verification screen, copy DKIM records** (SendGrid typically provides 3 CNAME records, one per DKIM selector):
   ```
   CNAME record name: s1._domainkey.outreach.dozensupplies.com
   CNAME value: s1.domainkey.sendgrid.net
   
   CNAME record name: s2._domainkey.outreach.dozensupplies.com
   CNAME value: s2.domainkey.sendgrid.net
   
   CNAME record name: s3._domainkey.outreach.dozensupplies.com
   CNAME value: s3.domainkey.sendgrid.net
   ```

2. [ ] **Add all 3 CNAME records to DNS:**
   - Log into registrar → DNS → CNAME Records
   - Create 3 new records (one for each selector s1, s2, s3)
   - Copy exact names and values from SendGrid
   - Save

3. [ ] **Verify in 24–48 hours:**
   ```bash
   dig s1._domainkey.outreach.dozensupplies.com CNAME
   # Should return SendGrid CNAME
   ```

**Expected outcome:** All 3 DKIM records live in DNS.

### 3.3 Add DMARC Record

**Owner:** Developer  
**What it is:** DMARC (Domain-based Message Authentication, Reporting, and Conformance) tells mail servers what to do if SPF/DKIM fails. Sets reporting destination for delivery insights.

**Steps:**

1. [ ] **Choose DMARC policy for new domain:**
   - **p=none** (monitor mode): No enforcement. Mail servers report failures but don't reject emails. **Recommended for Week 1–2 warmup** — lets you see what's breaking before enforcing.
   - **p=quarantine:** Mail servers may move failures to spam.
   - **p=reject:** Mail servers reject failures outright.
   - **Recommendation progression:** Week 1–2: `p=none`, Week 3+: `p=quarantine`, Week 5+: `p=reject` (if all metrics green)

2. [ ] **Create DMARC TXT record:**
   ```
   TXT record name: _dmarc.outreach.dozensupplies.com
   TXT record value: v=DMARC1; p=none; rua=mailto:dmarc-report@outreach.dozensupplies.com; ruf=mailto:dmarc-forensics@outreach.dozensupplies.com; fo=1
   ```
   - **p=none:** Policy (none = monitoring only)
   - **rua=:** Aggregate reports sent here (weekly summary of SPF/DKIM results)
   - **ruf=:** Forensic reports (detailed failures) — optional, verbose
   - **fo=1:** Report on failures only (not successes)

3. [ ] **Add to registrar:**
   - DNS → TXT Records
   - Name: `_dmarc.outreach.dozensupplies.com`
   - Value: (paste from above)
   - Save

4. [ ] **Verify in 24 hours:**
   ```bash
   dig _dmarc.outreach.dozensupplies.com TXT
   ```

5. [ ] **Set up email inboxes to receive DMARC reports:**
   - `dmarc-report@outreach.dozensupplies.com` (or `dmarc@...` — keep it simple)
   - This inbox will receive weekly summaries of email authentication performance
   - Abbie or alireza-cold-email should monitor this inbox during warmup (Week 1–6)

**Policy upgrade schedule:**
- [ ] **Weeks 1–2:** `p=none` (monitor only)
- [ ] **Week 3:** Change to `p=quarantine` (after Week 2 warmup succeeds)
- [ ] **Week 5:** Change to `p=reject` (after full warmup, right before campaign launch) — optional, more aggressive

**Expected outcome:** DMARC record published. Weekly reports begin arriving in configured inbox.

---

## Phase 4: SendGrid Configuration (Developer)

### 4.1 Create API Key for Outreach Pipeline

**Owner:** Developer

**Steps:**

1. [ ] **Log into SendGrid → Settings → API Keys**
2. [ ] **Create new API key:**
   - Name: "Dozen Outreach Pipeline" (or similar)
   - Permissions: Check "Mail Send" (minimum required), leave all others unchecked
   - Click "Create"
3. [ ] **Copy key to `.env` file:**
   ```
   SENDGRID_API_KEY=SG.your_api_key_here_very_long_string
   ```
   - Store in project `.env` file (never in code)
   - Add to `.gitignore` if not already there
4. [ ] **Test the key:**
   ```bash
   # Python test (in project)
   import os
   from sendgrid import SendGridAPIClient
   
   sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
   print("API key loaded successfully")
   ```

**Expected outcome:** API key created, stored securely, tested.

### 4.2 Create Email Template in SendGrid

**Owner:** Developer (template copy from alireza-cold-email or content-writer)

**Steps:**

1. [ ] **SendGrid → Email API → Dynamic Templates**
2. [ ] **Create new template:**
   - Name: "Cold Outreach - Sequence 1" (or use alireza's final approved copy)
   - Designer: Use SendGrid's drag-and-drop or HTML editor
   - Required fields:
     - **Subject line:** `{{subject}}` (dynamic)
     - **From:** `noreply@outreach.dozensupplies.com` or `hello@outreach.dozensupplies.com` (decide on brand voice — who is sending?)
     - **From name:** "Dozen Supplies Team" or similar
     - **Body:** HTML version of email copy (approved by alireza)
     - **Unsubscribe link:** `{{unsubscribe_link}}` (SendGrid auto-fills; required by law)
     - **PDPA footer:** Include compliant legal notice (per compliance-auditor approval)
3. [ ] **Create 2nd template:** "Cold Outreach - Sequence 2"
4. [ ] **Create 3rd template:** "Cold Outreach - Sequence 3"
5. [ ] **Test each template:**
   - Send test email to internal team (alireza, Abbie)
   - Check rendering in Gmail, Outlook, Apple Mail
   - Verify unsubscribe link works
   - Verify all dynamic fields ({{subject}}, {{first_name}}, etc.) render correctly

**Expected outcome:** 3 email templates created, tested, approved.

### 4.3 Set Up Suppression Lists

**Owner:** Developer + alireza-cold-email (ongoing maintenance)

**Steps:**

1. [ ] **SendGrid → Suppressions → Bounces**
   - Hard bounces (invalid email address) are auto-added by SendGrid after send
   - Review weekly during warmup (Weeks 1–6)

2. [ ] **SendGrid → Suppressions → Unsubscribes**
   - Configure unsubscribe: When recipient clicks unsubscribe, SendGrid auto-suppresses
   - Check "Append unsubscribe footer to email" (required by CAN-SPAM, Tanzania email law)

3. [ ] **SendGrid → Suppressions → Spam Reports**
   - Auto-suppress emails marked as spam by recipient

4. [ ] **Google Sheets → Suppression sync (optional, Week 2+):**
   - Run script: `tools/sync_sendgrid_suppressions.py` weekly
   - Pulls bounced/unsubscribed addresses from SendGrid
   - Marks them as "invalid" or "unsubscribed" in Google Sheets (lead state database)
   - Prevents re-sending to suppressed addresses

**Expected outcome:** Suppression lists active; weekly sync planned.

---

## Phase 5: Monitoring & Verification Tools (Abbie + alireza-cold-email)

### 5.1 Google Postmaster Tools (Free)

**Owner:** Abbie (first-time setup) + alireza-cold-email (daily monitoring)

**Steps:**

1. [ ] **Go to Google Postmaster Tools:** postmaster.google.com
2. [ ] **Add domain:** outreach.dozensupplies.com
3. [ ] **Verify ownership:**
   - Google provides 3 verification methods: TXT record, CNAME, HTML file upload
   - **Recommend:** TXT record (same as DMARC setup)
   - Add TXT record to DNS registrar
   - Wait 24–48 hours for verification
4. [ ] **Authorize in Google Search Console (if not already done):**
   - This bridges GSC and Postmaster Tools
   - May require additional sign-up
5. [ ] **Monitor these dashboards during warmup (Weeks 1–6):**
   - **Authentication:** SPF, DKIM, DMARC pass % (target: 100%)
   - **Inbox Placement Rate:** % of emails landing in Gmail inbox vs. spam folder (target: >95% inbox)
   - **Spam Rate:** % marked as spam by Gmail users (target: <0.1%)
   - **IP Reputation:** Health of sending IP (should improve during warmup)

**Expected outcome:** Domain verified in Postmaster Tools. Daily monitoring begun.

### 5.2 Mail-Tester.com (Free, Ad-Hoc)

**Owner:** alireza-cold-email (use every 1–2 weeks during warmup)

**Steps:**

1. [ ] **Go to mail-tester.com**
2. [ ] **Get test email address** (e.g., abc12345xyz@mail-tester.com)
3. [ ] **Send test email from warmup domain** (outreach.dozensupplies.com) to that address
   - Use SendGrid template or send via API
4. [ ] **Wait 10 seconds, then check results:**
   - **Spam score:** <5 is good, <3 is excellent
   - **SPF:** ✓ PASS
   - **DKIM:** ✓ PASS
   - **DMARC:** ✓ PASS
   - **Rendering:** Check HTML appearance in Outlook, Gmail, Apple Mail, Yahoo
5. [ ] **Re-run:** Every 1–2 weeks to catch any DNS propagation issues

**Expected outcome:** Spam score <5, all authentications passing.

### 5.3 SendGrid Dashboard (Daily During Warmup)

**Owner:** alireza-cold-email

**Metrics to watch:**

- [ ] **Bounce rate:** Trending down (target: <1% by Week 3)
- [ ] **Open rate:** Trending stable or up by segment (target: Boutique >18%, Luxury >25%, Villas >15%)
- [ ] **Click rate:** Trending up (target: >1% by Week 2)
- [ ] **Spam complaint rate:** <0.1%
- [ ] **Delivery rate:** >98% delivered (not bounced/rejected)

**Action:** Log metrics daily to `docs/email/warmup-log.csv` (see Warmup Schedule appendix).

**Expected outcome:** Healthy delivery metrics trending in correct direction.

### 5.4 MXToolbox (Free, Ad-Hoc)

**Owner:** Developer (troubleshooting DNS issues)

**Use case:** If DNS records aren't propagating or Postmaster Tools shows failed authentication.

**Steps:**

1. [ ] Go to mxtoolbox.com
2. [ ] Enter domain: `outreach.dozensupplies.com`
3. [ ] Click "MX Lookup" — should show SendGrid MX records
4. [ ] Check SPF, DKIM, DMARC records:
   - **SPF:** Click "SPF Check" — should pass
   - **DKIM:** Click "DKIM Check" — may need to manually add selectors (s1, s2, s3) to check all three
   - **DMARC:** Click "DMARC Check" — should show DMARC policy

**Expected outcome:** All authentications verified in MXToolbox.

---

## Phase 6: Pre-Warmup Readiness Audit (Developer + Abbie)

### 6.1 Complete Checklist

**Before Warmup Week 1 begins (all checked = GO):**

#### DNS & Authentication
- [ ] Subdomain outreach.dozensupplies.com resolves
- [ ] SPF record added to DNS and verified (MXToolbox or `dig` command)
- [ ] DKIM records (all 3) added to DNS and verified
- [ ] DMARC record added to DNS (p=none for Week 1–2)
- [ ] SendGrid domain authentication complete (green checkmark in dashboard)

#### SendGrid Setup
- [ ] SendGrid account created and active
- [ ] Domain verified in SendGrid Sender Authentication
- [ ] Dedicated IP requested (optional, recommended if budget allows)
- [ ] API key created and stored in `.env`
- [ ] 3 email templates created and tested
- [ ] Unsubscribe footer configured
- [ ] Bounce/unsubscribe/spam suppression lists active

#### Monitoring Tools
- [ ] Google Postmaster Tools: domain added, verified, accessible
- [ ] SendGrid dashboard: metrics visible, login confirmed
- [ ] Mail-Tester: test email sent and verified (spam score <5, all auth passing)
- [ ] MXToolbox: SPF/DKIM/DMARC all passing
- [ ] DMARC report inbox created (dmarc-report@outreach.dozensupplies.com)

#### Legal & Compliance
- [ ] PDPA Lawful Basis Opinion signed by legal-advisor (if required per project rules)
- [ ] CAN-SPAM / Tanzania email law compliance checklist approved by compliance-auditor
- [ ] Unsubscribe legal notice added to email templates
- [ ] Privacy policy updated to include outreach@outreach.dozensupplies.com

#### AI Integration
- [ ] deduplicate_leads.py ready: removes duplicate prospects, enforces 1-email-per-week rule
- [ ] Inbound conversation handler ready: will receive and respond to replies
- [ ] Google Sheets lead state database: ready to track send status, bounces, opens, replies
- [ ] SendGrid suppression sync script ready (if using)

#### Team & Communication
- [ ] alireza-cold-email briefed on warmup schedule (owns daily monitoring)
- [ ] Abbie knows escalation triggers (bounce >3%, open <15%, etc.)
- [ ] Dozen owner/sales manager aware: outreach campaign begins, AI replies inbound
- [ ] Team has access to SendGrid dashboard, Postmaster Tools, warmup-log.csv

### 6.2 Final Go/No-Go Decision

**Owner:** Abbie

**Criteria for GO:**
- All checklist items above = checked
- SendGrid dashboard shows no setup errors
- Mail-Tester spam score <5, all auth passing
- Legal compliance approved
- AI inbound handler tested and working

**If any blocker remains:**
- [ ] Do NOT begin warmup
- [ ] Log blocker to `docs/3-decisions.md`
- [ ] Assign owner and deadline to fix
- [ ] Re-check before proceeding

**Decision:** 

[ ] **GO** — All systems ready. Start Warmup Week 1 on [DATE]

[ ] **GO WITH CONDITIONS** — [list conditions to resolve before Week 1]

[ ] **NO GO** — [list blockers; retry after fixes]

---

## Appendix: Troubleshooting

### "Mail-Tester shows DKIM failure"

**Diagnosis:** DKIM records not properly added or propagated.

**Fix:**
1. Verify all 3 CNAME records exist in DNS (s1, s2, s3 selectors)
2. Wait 48 hours for DNS propagation
3. Re-run MXToolbox DKIM check
4. If still failing, contact SendGrid support — may be domain verification issue

### "Google Postmaster Tools shows <80% inbox placement"

**Diagnosis:** Domain reputation issues, possible authentication failures.

**Fix:**
1. Check SPF/DKIM/DMARC pass % in Postmaster Tools (should be 100%)
2. If <100%, revisit DNS setup (Phase 3)
3. If 100% but inbox placement low: domain reputation may be poor due to historical issues — may need to use fresh IP or wait longer
4. Escalate to Abbie if issue persists beyond Week 2

### "SendGrid says 'Domain not authenticated'"

**Diagnosis:** DNS records not yet propagated or verification button not clicked at right time.

**Fix:**
1. Wait 48 hours after adding DNS records
2. Use MXToolbox to verify DNS records are live
3. In SendGrid, click "Verify" button again
4. If still fails, check domain registrar settings — ensure you're editing the right subdomain

### "Bounce rate >3% in Week 1"

**Diagnosis:** List quality issue, invalid email addresses, or typos in source data.

**Fix (see Warmup Schedule § Decision Points):**
1. Pull bounce report from SendGrid
2. Identify if bounces are hard (invalid) or soft (temp server issue)
3. If hard bounces: validate email column in Google Sheets (check for typos, domains like "gmail.co.tz" which may not exist)
4. Use email validation tool (Clearout, ZeroBounce) to filter list
5. Resume with cleaned list

---

**End of Infrastructure Checklist**
