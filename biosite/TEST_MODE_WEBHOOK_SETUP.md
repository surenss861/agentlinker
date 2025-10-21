# 🧪 Test Mode Webhook Setup Guide

## **Current Setup**
- ✅ **Stripe:** Test mode enabled
- ✅ **Pro Product ID:** `prod_THFS9HsX5axqua`
- ✅ **Verification Product ID:** `prod_THFSS3LO5nuhwX`
- ✅ **Environment:** Updated `.env.local` and Supabase edge functions

---

## **🔍 Step 1: Test Webhook Endpoint**

### Test the webhook is accessible:
1. **Go to:** `https://agentlinker.ca/api/test-webhook`
2. **Should see:** JSON response with environment status
3. **Look for:** `hasWebhookSecret: true` and `databaseTest: "passed"`

### If test fails:
- Check Vercel logs for specific error
- Verify environment variables are set
- Check database connection

---

## **🔍 Step 2: Configure Stripe Test Webhook**

### In Stripe Dashboard (Test Mode):
1. **Go to:** https://dashboard.stripe.com/test/webhooks
2. **Click:** "Add endpoint"
3. **Endpoint URL:** `https://agentlinker.ca/api/stripe/webhook`
4. **Description:** "AgentLinker Test Webhook"

### Select Events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `payment_intent.payment_failed`

### Get Test Webhook Secret:
1. **After creating:** Click on your webhook endpoint
2. **Click:** "Reveal" next to "Signing secret"
3. **Copy:** The secret (starts with `whsec_test_`)

---

## **🔍 Step 3: Update Environment Variables**

### In Vercel Dashboard:
1. **Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. **Update:**
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_test_xxxxxxxxxxxxx` (test webhook secret)
   - **Environment:** ✅ Production ✅ Preview ✅ Development
3. **Click:** "Save"

### In Local Development (.env.local):
```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx
```

---

## **🔍 Step 4: Test Payment Flow**

### Test Pro Subscription:
1. **Go to:** `/dashboard/billing`
2. **Click:** "Upgrade to Pro"
3. **Use test card:** `4242 4242 4242 4242`
   - Exp: `12/34`
   - CVC: `123`
4. **Complete checkout**

### Expected Flow:
1. ✅ **Stripe processes payment**
2. ✅ **Webhook fires** (`checkout.session.completed`)
3. ✅ **Database updates** (`users.subscription_tier = 'pro'`)
4. ✅ **Pro features unlock** automatically

---

## **🔍 Step 5: Verify Webhook Success**

### Check Stripe Webhook Logs:
1. **Go to:** https://dashboard.stripe.com/test/webhooks
2. **Click:** Your webhook endpoint
3. **Click:** "Logs" tab
4. **Look for:** Green checkmarks ✅

### Check Vercel Logs:
1. **Go to:** https://vercel.com/dashboard → Your Project → Logs
2. **Look for:** Webhook success messages
3. **Should see:** `✅ User subscription tier updated to pro`

### Check Database:
1. **Go to:** Supabase Dashboard → Table Editor → `users`
2. **Find your user:** Check `subscription_tier` column
3. **Should show:** `pro`

---

## **🔧 Troubleshooting Test Mode**

### If Webhook Still Gets 500 Error:
1. **Check:** `https://agentlinker.ca/api/test-webhook`
2. **Verify:** `hasWebhookSecret: true`
3. **Check:** Database connection works
4. **Redeploy:** After adding environment variables

### If Payment Succeeds But No Activation:
1. **Check Stripe webhook logs** for red X marks
2. **Check Vercel logs** for specific error messages
3. **Verify:** Webhook secret matches exactly
4. **Test:** Use Stripe CLI to forward webhooks locally

### If Database Update Fails:
1. **Check:** `users` table has `subscription_tier` column
2. **Check:** `subscriptions` table exists
3. **Check:** RLS policies allow webhook access
4. **Run:** SQL setup scripts if tables missing

---

## **🎯 Success Indicators**

### Webhook Working:
- ✅ Green checkmarks in Stripe webhook logs
- ✅ `200 OK` responses instead of `500 ERR`
- ✅ Automatic Pro activation after payment
- ✅ Database records created in `subscriptions` table

### Test Mode Benefits:
- ✅ No real money charged
- ✅ Easy to test multiple scenarios
- ✅ Can use test cards repeatedly
- ✅ Safe to debug without affecting live customers

---

## **🚀 After Test Mode Works**

Once webhook works in test mode:
1. **Switch Stripe to live mode**
2. **Update webhook endpoint** to use live webhook secret
3. **Update environment variables** with live keys
4. **Test with real payment** (small amount)
5. **Go live!** 🎉

---

## **📋 Quick Checklist**

- [ ] Test webhook endpoint accessible (`/api/test-webhook`)
- [ ] Stripe test webhook configured with correct URL
- [ ] Test webhook secret added to Vercel environment variables
- [ ] Redeployed after adding environment variables
- [ ] Test payment with `4242 4242 4242 4242`
- [ ] Check Stripe webhook logs for green checkmarks
- [ ] Verify Pro activation happens automatically
- [ ] Check database shows `subscription_tier: 'pro'`

**All checkboxes = Webhook working perfectly!** ✅
