# Stripe Setup for SpendSight

This guide explains how to set up Stripe for SpendSight, including required API keys, webhook configuration, and environment variables for Vercel deployment.

---

##  1. Create & Configure a Stripe Account

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com) and log in or create an account.
2. In **Developers > API keys**, copy your:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

---

##  2. Set Up Webhook Endpoint

1. Go to **Developers > Webhooks** in your Stripe dashboard.
2. Click **“+ Add endpoint”** and set:
 
  - https://your-production-domain.com/api/stripe-webhook

Replace `your-production-domain.com` with your actual domain (e.g. `spendsighttool.com`).

3. Under “Select events to send”, choose:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

4. After creating the webhook, copy the **signing secret** (starts with `whsec_...`).

---

##  3. Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and open your SpendSight project.
2. Click **Settings > Environment Variables**.
3. Add the following keys and their corresponding values:

| Key                     | Value from Stripe |
|------------------------|-------------------|
| `STRIPE_SECRET_KEY`     | Your secret key (`sk_live_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Your publishable key (`pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET`  | Your webhook signing secret (`whsec_...`) |

4. Set the environment to **Production** (or **All Environments**, if you prefer).

5. After adding all variables, trigger a redeploy for changes to take effect.

---

## ✅ Done

SpendSight is now connected to your live Stripe account for secure subscription management.
