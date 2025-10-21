# Stripe Webhook Setup Guide

## 🚨 IMMEDIATE FIX (Manual Activation)

If you just paid for Pro but it didn't activate:

1. **Go to:** `/dashboard/billing`
2. **Look for yellow box:** "Already paid but still on Free plan?"
3. **Click:** "🔧 Activate Pro Now"
4. **Refresh the page** - you should now see "✓ Pro Plan Active"

---

## 🔧 Why Subscriptions Don't Activate Automatically

The Stripe webhook isn't configured yet, so when you pay:
- ✅ **Stripe receives payment**
- ❌ **Webhook doesn't fire**
- ❌ **Database doesn't update**
- ❌ **You stay on Free plan**

---

## ✅ Permanent Fix: Configure Stripe Webhook

### Step 1: Get Your Webhook Endpoint URL

Your webhook endpoint is:
```
https://www.agentlinker.ca/api/stripe/webhook
```

### Step 2: Configure in Stripe Dashboard

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** "Add endpoint"
3. **Endpoint URL:** `https://www.agentlinker.ca/api/stripe/webhook`
4. **Description:** "AgentLinker Subscription Webhook"

### Step 3: Select Events to Listen For

Check these events (CRITICAL):
- ✅ `checkout.session.completed` - When payment succeeds
- ✅ `customer.subscription.updated` - When subscription changes
- ✅ `customer.subscription.deleted` - When subscription cancels
- ✅ `payment_intent.payment_failed` - When payment fails

### Step 4: Get Webhook Signing Secret

1. After creating the endpoint, click on it
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 5: Add to Vercel Environment Variables

1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your AgentLinker project
3. **Go to:** Settings → Environment Variables
4. **Add:**
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_xxxxxxxxxxxxx` (the secret from Step 4)
   - **Environment:** Production, Preview, Development
5. **Click:** "Save"

### Step 6: Redeploy

1. **Go to:** Deployments tab
2. **Click:** "Redeploy" on the latest deployment
3. **Check:** "Clear Build Cache"

---

## 🧪 Testing the Webhook

### Test Payment

1. **Go to:** `/dashboard/billing`
2. **Click:** "Upgrade to Pro"
3. **Use test card:** `4242 4242 4242 4242`
   - Exp: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
4. **Complete checkout**
5. **Wait 2-3 seconds** - webhook should fire
6. **Refresh `/dashboard/billing`** - should show "✓ Pro Plan Active"

### Check Webhook Logs

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** Your webhook endpoint
3. **Click:** "Logs" tab
4. **Look for:**
   - ✅ Green checkmarks = successful
   - ❌ Red X = failed (check error message)

### Common Webhook Errors

| Error | Solution |
|-------|----------|
| `Invalid signature` | Wrong webhook secret in Vercel env vars |
| `404 Not Found` | Wrong webhook URL (must be exact) |
| `Timeout` | Vercel deployment issue - redeploy |
| `500 Internal` | Check application logs in Vercel |

---

## 📊 What Happens When Webhook Works

```
1. User completes Stripe checkout
   ↓
2. Stripe fires webhook to /api/stripe/webhook
   ↓
3. Webhook verifies signature
   ↓
4. Updates users.subscription_tier = 'pro'
   ↓
5. Creates record in subscriptions table
   ↓
6. User refreshes → sees Pro features ✅
```

---

## 🔍 Debugging Checklist

### In Stripe Dashboard
- [ ] Webhook endpoint exists
- [ ] URL is exactly `https://www.agentlinker.ca/api/stripe/webhook`
- [ ] Events are selected (`checkout.session.completed`, etc.)
- [ ] Webhook status is "Enabled"

### In Vercel Dashboard
- [ ] `STRIPE_SECRET_KEY` is set
- [ ] `STRIPE_WEBHOOK_SECRET` is set
- [ ] Both are in Production environment
- [ ] Latest deployment has these env vars

### In Supabase
- [ ] `users` table has `subscription_tier` column
- [ ] `users` table has `stripe_customer_id` column
- [ ] `subscriptions` table exists
- [ ] RLS policies allow webhook to insert/update

---

## 🆘 If Webhook Still Doesn't Work

### Option 1: Manual Activation (Temporary)
Use the manual activation button on `/dashboard/billing`

### Option 2: SQL Manual Update
Run this in Supabase SQL Editor:
```sql
-- Replace YOUR_USER_ID with your actual user ID
UPDATE users 
SET subscription_tier = 'pro' 
WHERE id = 'YOUR_USER_ID';
```

### Option 3: Contact Support
If webhook continues to fail:
- Check Vercel logs: https://vercel.com/dashboard → Your Project → Logs
- Check Stripe webhook logs
- Verify webhook secret matches exactly

---

## ✅ Webhook Working Signs

When the webhook is working correctly:
1. **Immediate activation** after payment (no manual click needed)
2. **Subscription record** appears in Supabase `subscriptions` table
3. **User tier** updates to `'pro'` in `users` table
4. **Green checkmarks** in Stripe webhook logs

---

## 🎯 Current Status

**Temporary Solution:** ✅ Manual activation button available
**Permanent Solution:** ⏳ Configure webhook in Stripe dashboard

**After you configure the webhook, new payments will automatically activate!**

