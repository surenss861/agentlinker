# 🚨 Webhook 500 Error - Quick Fix Guide

## **The Problem**
Your Stripe webhook is getting `500 ERR` when trying to reach `https://agentlinker.ca/api/stripe/webhook`. This means the webhook code is crashing.

## **🔍 Step 1: Check Environment Variables**

### Test the webhook endpoint:
1. **Go to:** `https://agentlinker.ca/api/stripe/webhook/test`
2. **Should see:** JSON response with environment status
3. **Look for:** `hasWebhookSecret: true`

### If `hasWebhookSecret: false`:
1. **Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables
2. **Check:** `STRIPE_WEBHOOK_SECRET` exists
3. **Verify:** It's in Production environment
4. **Value should start with:** `whsec_`

---

## **🔍 Step 2: Check Vercel Logs**

1. **Go to:** https://vercel.com/dashboard → Your Project → Logs
2. **Look for:** Recent webhook attempts
3. **Check for errors like:**
   - `Stripe webhook not configured`
   - `Invalid signature`
   - `Missing metadata`
   - Database connection errors

---

## **🔍 Step 3: Test Webhook Manually**

### Option A: Use Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# Then run:
stripe listen --forward-to https://agentlinker.ca/api/stripe/webhook
```

### Option B: Use Stripe Dashboard
1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** Your webhook endpoint
3. **Click:** "Send test webhook"
4. **Select:** `checkout.session.completed`
5. **Check:** Response status

---

## **🔧 Common Fixes**

### Fix 1: Missing Webhook Secret
**Problem:** `hasWebhookSecret: false`
**Solution:**
1. Get webhook secret from Stripe dashboard
2. Add to Vercel environment variables
3. Redeploy

### Fix 2: Wrong Webhook URL
**Problem:** Webhook URL doesn't match exactly
**Solution:**
- **Correct:** `https://agentlinker.ca/api/stripe/webhook`
- **Wrong:** `https://www.agentlinker.ca/api/stripe/webhook` (extra www)
- **Wrong:** `https://agentlinker.ca/api/stripe/webhooks` (extra s)

### Fix 3: Database Connection Issues
**Problem:** Supabase connection failing
**Solution:**
1. Check Supabase project is active
2. Verify database tables exist
3. Check RLS policies allow webhook access

### Fix 4: Missing Database Tables
**Problem:** `subscriptions` table doesn't exist
**Solution:** Run the SQL setup scripts from `STRIPE_WEBHOOK_FIX.md`

---

## **🚀 Quick Test**

1. **Visit:** `https://agentlinker.ca/api/stripe/webhook/test`
2. **Should see:**
   ```json
   {
     "message": "Webhook endpoint is accessible",
     "environment": {
       "hasStripeSecret": true,
       "hasWebhookSecret": true,
       "nodeEnv": "production"
     }
   }
   ```

3. **If `hasWebhookSecret: false`:** Add the environment variable
4. **If `hasStripeSecret: false`:** Add the Stripe secret key
5. **Redeploy** after adding environment variables

---

## **🎯 After Fix**

Once the webhook returns `200 OK` instead of `500 ERR`:

1. **Test a payment** with test card `4242 4242 4242 4242`
2. **Check Stripe webhook logs** - should show green checkmarks
3. **Verify Pro activation** - should happen automatically

---

## **🆘 Still Not Working?**

**Check these in order:**
1. ✅ Environment variables set in Vercel
2. ✅ Webhook URL exactly matches: `https://agentlinker.ca/api/stripe/webhook`
3. ✅ Database tables exist (`users`, `subscriptions`)
4. ✅ Redeployed after adding environment variables
5. ✅ Test endpoint returns `hasWebhookSecret: true`

**If all above are correct, check Vercel logs for the specific error message.**

