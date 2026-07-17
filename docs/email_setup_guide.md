# SaaS Email Deliverability Guide: SPF, DKIM, & DMARC

To send transactional emails (login OTPs, registration greetings, and payment alerts) under your custom domain (e.g. `notifications@yourgym.com`) with high inbox placement and zero spam flagging, you must verify your sending domain inside **Resend** and publish the corresponding DNS records in your domain registrar (e.g. Cloudflare, Route 53, GoDaddy).

---

## Step 1: Add Domain to Resend

1. Go to the [Resend Domains Dashboard](https://resend.com/domains).
2. Click **Add Domain**.
3. Input your domain name (e.g., `yourgym.com`) and choose your region (e.g., `us-east-1`).
4. Resend will generate **3 CNAME records** for domain verification and DKIM alignment.

---

## Step 2: Configure DNS Records

Login to your DNS manager (e.g. Cloudflare, AWS Route 53, GoDaddy) and add the following records:

### 1. DKIM (DomainKeys Identified Mail)
DKIM signs outgoing emails with a cryptographic signature, proving that the email was actually sent by your domain and wasn't tampered with in transit.
* Add the **3 CNAME records** generated in the Resend dashboard.
* Example:
  * **Type**: `CNAME`
  * **Name**: `resend._domainkey`
  * **Target**: `dkim.resend.com`

### 2. SPF (Sender Policy Framework)
SPF defines which mail servers are authorized to send email on behalf of your domain.
* Resend configures SPF automatically through the CNAME records added in Step 1 (which set up a verified return path subdomain e.g. `bounces.yourgym.com` pointing to Resend).
* However, if you are also sending emails using other services (like Google Workspace), ensure your root domain's TXT record includes Resend if needed, or rely on the aligned bounces subdomain (default and recommended by Resend).
* Root SPF Record example (if you have multiple senders):
  * **Type**: `TXT`
  * **Name**: `@`
  * **Value**: `v=spf1 include:_spf.google.com include:feedback-smtp.us-east-1.amazonses.com ~all`

### 3. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
DMARC tells receiving mail servers (like Gmail or Yahoo) what to do with messages that fail SPF or DKIM checks. It is now a **strict requirement** by Google and Yahoo for all domain senders.

* Add a new TXT record:
  * **Type**: `TXT`
  * **Name**: `_dmarc` (resolves to `_dmarc.yourgym.com`)
  * **Value**: `v=DMARC1; p=none; pct=100; rua=mailto:dmarc-reports@yourgym.com`

> [!TIP]
> **DMARC Policy Phases (`p` tag)**:
> 1. **Phase 1 (Monitoring)**: Use `p=none` initially. This gathers reports of who is sending mail on your domain without blocking or quarantining any emails.
> 2. **Phase 2 (Quarantine)**: After 2-4 weeks of reports showing no legitimate mail is failing, change to `p=quarantine;` (sends failing emails to the spam folder).
> 3. **Phase 3 (Reject)**: Finally, move to `p=reject;` (completely blocks any emails that fail SPF/DKIM).

---

## Step 3: Verify Domain in Resend

1. Go back to the Resend dashboard.
2. Click **Verify** on your domain.
3. Once DNS propagation is complete (usually takes 5-15 minutes, up to 24 hours for GoDaddy/Namecheap), your domain status will change to **Verified** (labeled in green).
4. Update your `.env` or deployment variables to point to your new sender email:
   ```bash
   RESEND_FROM_EMAIL="notifications@yourgym.com"
   ```
