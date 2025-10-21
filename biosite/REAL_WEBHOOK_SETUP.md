# Complete Stripe Webhook Setup for Local Development

## 🚨 The Real Problem
The checkout flow isn't working because the Stripe webhook isn't properly configured to process `checkout.session.completed` events.

## 🔧 Step-by-Step Fix

### Step 1: Configure Stripe Webhook for Local Development

**In Stripe Dashboard:**

1. **Go to:** Webhooks → Add endpoint
2. **Endpoint URL:** `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
   - **OR** use Stripe CLI for local testing (recommended)
3. **Events to send:**
   - `checkout.session.completed` ← **CRITICAL!**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `payment_intent.payment_failed`

### Step 2: Use Stripe CLI for Local Testing (RECOMMENDED)

```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will give you a webhook signing secret like:
# whsec_1234567890abcdef...
```

### Step 3: Set Environment Variables

Create `.env.local` file:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe CLI

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Test the Complete Flow

1. **Start Stripe CLI:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **Start your app:**
   ```bash
   npm run dev
   ```

3. **Make a test purchase:**
   - Go to `/dashboard/billing`
   - Click "Upgrade to Pro"
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout

4. **Check webhook logs:**
   - Stripe CLI will show webhook events
   - Check your server logs for processing

### Step 5: Verify Database Updates

After a successful purchase, check:
```sql
-- Check users table
SELECT id, email, subscription_tier, stripe_customer_id FROM users;

-- Check subscriptions table  
SELECT * FROM subscriptions ORDER BY created_at DESC;
```

## 🛠 Alternative: Use ngrok for Webhook Testing

If you prefer not to use Stripe CLI:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Expose localhost:**
   ```bash
   ngrok http 3000
   ```

3. **Use ngrok URL in Stripe webhook:**
   - URL: `https://abc123.ngrok.io/api/stripe/webhook`

## 🔍 Debugging Steps

### Check Webhook Events in Stripe Dashboard:
1. Go to Webhooks → View logs
2. Look for `checkout.session.completed` events
3. Check if they're successful (200) or failing (500)

### Check Server Logs:
```bash
# Look for webhook processing logs
tail -f logs/server.log | grep "checkout.session.completed"
```

### Test Webhook Manually:
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type": "checkout.session.completed", "data": {"object": {"id": "test"}}}'
```

## ✅ Expected Flow After Fix

1. **User purchases** → Stripe processes payment
2. **Stripe sends webhook** → `checkout.session.completed`
3. **Webhook processes** → Updates `users.subscription_tier`
4. **User redirected** → `/thank-you?tier=pro`
5. **User clicks dashboard** → Pro features unlocked

## 🚨 Common Issues

### Issue 1: Webhook Not Receiving Events
**Fix:** Use Stripe CLI or ngrok to expose localhost

### Issue 2: Webhook Receiving Events But Failing
**Fix:** Check webhook secret and database permissions

### Issue 3: Database Not Updating
**Fix:** Ensure service role key is set and RLS policies allow updates

## 🎯 Success Indicators

- ✅ Stripe CLI shows webhook events
- ✅ Server logs show successful processing
- ✅ Database shows updated subscription_tier
- ✅ Dashboard shows Pro features unlocked
- ✅ No manual intervention needed

The key is getting the webhook to actually receive and process the `checkout.session.completed` event from Stripe!
