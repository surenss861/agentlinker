# 🚀 Automatic Stripe Webhook Setup (5 Minutes)

## **Why You Need This**
Without the webhook, payments succeed but don't activate Pro automatically. This setup makes ALL future payments work instantly.

---

## **Step 1: Configure Stripe Webhook (2 minutes)**

### 1.1 Go to Stripe Dashboard
- **Open:** https://dashboard.stripe.com/webhooks
- **Click:** "Add endpoint"

### 1.2 Set Up Endpoint
- **Endpoint URL:** `https://www.agentlinker.ca/api/stripe/webhook`
- **Description:** "AgentLinker Subscription Webhook"

### 1.3 Select Events
**Check these events (CRITICAL):**
- ✅ `checkout.session.completed` - When payment succeeds
- ✅ `customer.subscription.updated` - When subscription changes  
- ✅ `customer.subscription.deleted` - When subscription cancels
- ✅ `payment_intent.payment_failed` - When payment fails

### 1.4 Get Webhook Secret
- **After creating:** Click on your webhook endpoint
- **Click:** "Reveal" next to "Signing secret"
- **Copy:** The secret (starts with `whsec_`)

---

## **Step 2: Add to Vercel Environment (1 minute)**

### 2.1 Go to Vercel Dashboard
- **Open:** https://vercel.com/dashboard
- **Select:** Your AgentLinker project

### 2.2 Add Environment Variable
- **Go to:** Settings → Environment Variables
- **Add:**
  - **Name:** `STRIPE_WEBHOOK_SECRET`
  - **Value:** `whsec_xxxxxxxxxxxxx` (paste the secret from Step 1.4)
  - **Environment:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Save"

---

## **Step 3: Redeploy (1 minute)**

### 3.1 Force Redeploy
- **Go to:** Deployments tab
- **Click:** "Redeploy" on latest deployment
- **Check:** "Clear Build Cache"
- **Click:** "Redeploy"

---

## **Step 4: Test It Works (1 minute)**

### 4.1 Test Payment
- **Go to:** `/dashboard/billing`
- **Click:** "Upgrade to Pro"
- **Use test card:** `4242 4242 4242 4242`
  - Exp: `12/34`
  - CVC: `123`
- **Complete checkout**

### 4.2 Verify Automatic Activation
- **Wait 2-3 seconds** (webhook fires)
- **Refresh** `/dashboard/billing`
- **Should see:** "✓ Pro Plan Active" ✅

---

## **✅ Success Signs**

When webhook is working:
1. **Instant activation** after payment (no manual steps)
2. **Green checkmarks** in Stripe webhook logs
3. **Pro features** unlock immediately
4. **Subscription record** appears in Supabase

---

## **🔍 Troubleshooting**

### If Payment Succeeds But No Activation:
1. **Check Stripe webhook logs:** https://dashboard.stripe.com/webhooks → Your endpoint → Logs
2. **Look for:** Red X marks = failed webhooks
3. **Common errors:**
   - `Invalid signature` = Wrong webhook secret
   - `404 Not Found` = Wrong webhook URL
   - `Timeout` = Vercel deployment issue

### If Webhook Secret Wrong:
1. **Double-check:** Secret starts with `whsec_`
2. **Verify:** Added to Vercel environment variables
3. **Redeploy:** After adding environment variable

### If Still Not Working:
1. **Check Vercel logs:** https://vercel.com/dashboard → Your Project → Logs
2. **Verify:** `STRIPE_WEBHOOK_SECRET` is in Production environment
3. **Test:** Use Stripe test mode first

---

## **🎯 After Setup**

**All future payments will automatically activate Pro!** 

No more manual steps needed. Every payment will:
1. ✅ Process through Stripe
2. ✅ Fire webhook to your app
3. ✅ Update database automatically
4. ✅ Activate Pro features instantly

**This is a one-time setup that works forever!** 🚀

