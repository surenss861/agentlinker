# 🔔 Complete Stripe Webhook Setup Guide

## The Problem
Your "walls" don't lift because the backend never receives the payment confirmation event from Stripe. The checkout succeeds, but your database never gets updated.

## The Solution
Set up Stripe webhooks to send `checkout.session.completed` events to your backend, which then updates the user's subscription status in Supabase.

---

## 🚀 Production Setup (Vercel/Netlify/etc.)

### Step 1: Deploy Your Backend
Make sure your app is deployed and accessible at your production URL (e.g., `https://www.agentlinker.ca`)

### Step 2: Configure Stripe Webhook (Production)

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://www.agentlinker.ca/api/stripe/webhook
   ```
4. Select these events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `payment_intent.payment_failed`
   - ✅ `invoice.payment_succeeded`

5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add it to your production environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_production_secret_here
   ```

### Step 3: Test Production Webhook

1. In Stripe Dashboard → Webhooks, find your endpoint
2. Click **"Send test event"**
3. Choose `checkout.session.completed`
4. Click **"Send test webhook"**
5. Check the response - should see `200 OK`

---

## 🧪 Local Development Setup (localhost)

For local testing, you need to expose your `localhost:3000` to Stripe. Two options:

### Option A: Stripe CLI (Recommended)

1. **Install Stripe CLI:**
   ```bash
   # Windows (using Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   
   # macOS (using Homebrew)
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook signing secret** shown (starts with `whsec_...`)

5. **Add to `.env.local`:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_local_secret_here
   ```

6. **Restart your Next.js dev server**

7. **Test by making a purchase** - you'll see webhook events in your terminal!

### Option B: ngrok (Alternative)

1. **Install ngrok:**
   ```bash
   # Download from: https://ngrok.com/download
   # Or use npm:
   npm install -g ngrok
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Add webhook endpoint in Stripe:**
   - Go to Stripe Dashboard → Webhooks
   - Click "Add endpoint"
   - Enter: `https://abc123.ngrok.io/api/stripe/webhook`
   - Select the same events as production
   - Save and copy the signing secret

5. **Add to `.env.local`:**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_ngrok_secret_here
   ```

6. **Restart your Next.js dev server**

---

## 🔍 Verify Webhook is Working

### 1. Check Webhook Health
Visit: `http://localhost:3000/api/stripe/webhook/health`

You should see:
```json
{
  "message": "Webhook endpoint is reachable",
  "hasStripeSecret": true,
  "hasWebhookSecret": true,
  "status": "ok"
}
```

### 2. Check Server Logs
When webhook receives an event, you'll see:
```
🔔 Webhook received
✅ Signature verified, event type: checkout.session.completed
✅ Checkout session completed
📋 Session metadata: { agent_id: 'xxx', tier: 'pro' }
💰 Payment status: paid
✅ User subscription tier updated to pro for user xxx
🎉 PAYMENT SUCCESS: { userId: 'xxx', tier: 'pro', amount: 20 }
```

### 3. Check Database
After a successful payment, verify in Supabase:
```sql
SELECT id, email, subscription_tier, stripe_customer_id, updated_at 
FROM users 
WHERE email = 'your-test-email@example.com';
```

The `subscription_tier` should be updated to `pro`, `business`, or `help`.

---

## 🎯 How It Works

```
┌─────────────┐
│   User      │
│ Clicks Buy  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│  Stripe Checkout Session Created   │
│  with metadata: { agent_id, tier }  │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────┐
│  User Pays with     │
│  Credit Card        │
└──────┬──────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  Stripe sends webhook event:       │
│  checkout.session.completed        │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  Your Backend receives webhook     │
│  /api/stripe/webhook               │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  Backend verifies signature        │
│  Extracts agent_id and tier        │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  Backend updates Supabase:         │
│  UPDATE users                      │
│  SET subscription_tier = 'pro'     │
│  WHERE id = agent_id               │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  Frontend (useSimpleSubscription)  │
│  detects change via real-time      │
│  listener or 5s polling            │
└──────┬─────────────────────────────┘
       │
       ↓
┌────────────────────────────────────┐
│  🎉 WALLS LIFT! User sees Pro UI   │
└────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Webhook Not Receiving Events

**Check 1: Webhook URL is correct**
```
Production: https://www.agentlinker.ca/api/stripe/webhook
Local (Stripe CLI): localhost:3000/api/stripe/webhook
Local (ngrok): https://abc123.ngrok.io/api/stripe/webhook
```

**Check 2: Webhook secret is set**
```bash
# Check .env.local
cat .env.local | grep STRIPE_WEBHOOK_SECRET
```

**Check 3: Stripe CLI is running**
```bash
# Should see: Ready! Your webhook signing secret is whsec_...
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Check 4: Events are selected**
In Stripe Dashboard, ensure `checkout.session.completed` is checked.

### Webhook Signature Verification Fails

**Error:** `Invalid signature`

**Fix:**
1. Make sure you're using the correct webhook secret
2. For local development, use the secret from `stripe listen` output
3. For production, use the secret from Stripe Dashboard webhook settings
4. Restart your server after updating `.env.local`

### Database Not Updating

**Error:** User subscription tier doesn't change

**Fix:**
1. Check server logs for errors
2. Verify `agent_id` in metadata matches user ID in database
3. Check Supabase RLS policies allow service role to update users table
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in environment variables

### Frontend Not Refreshing

**Error:** UI still shows upgrade prompts

**Fix:**
1. Clear browser cache and reload
2. Check `useSimpleSubscription` hook is imported and used
3. Verify real-time subscription is working (check console logs)
4. Check that `isPro` boolean is used in conditional rendering

---

## 📋 Environment Variables Checklist

Make sure you have these in `.env.local`:

```env
# Stripe (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...                    # Test key for development
STRIPE_WEBHOOK_SECRET=whsec_...                  # From Stripe CLI or webhook settings

# Supabase (from https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...             # NEVER expose this publicly!

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000        # For local dev
# NEXT_PUBLIC_APP_URL=https://www.agentlinker.ca # For production
NODE_ENV=development                              # or 'production'
```

---

## ✅ Success Checklist

- [ ] Stripe webhook endpoint added in dashboard
- [ ] Webhook secret added to environment variables
- [ ] Events selected: `checkout.session.completed`, etc.
- [ ] For local dev: Stripe CLI running OR ngrok tunnel active
- [ ] Webhook health check returns `200 OK`
- [ ] Test purchase updates database
- [ ] Frontend refreshes and lifts walls
- [ ] Server logs show successful webhook processing

---

## 🎉 Once Working

When everything is set up correctly:

1. **User makes a purchase** → Stripe processes payment
2. **Stripe sends webhook** → Your backend receives `checkout.session.completed`
3. **Backend updates database** → `subscription_tier` changes to `pro`
4. **Frontend detects change** → `useSimpleSubscription` hook re-fetches
5. **Walls lift!** → UI removes upgrade prompts and shows premium features

**The entire flow takes 2-5 seconds!** 🚀

---

## 📞 Need Help?

If you're still having issues:

1. Check Stripe Dashboard → Webhooks → Your endpoint → Recent deliveries
2. Look for failed webhook attempts and error messages
3. Check your server logs for detailed error information
4. Verify all environment variables are set correctly
5. Test with Stripe test cards: `4242 4242 4242 4242` (success)

