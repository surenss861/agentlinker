# Stripe Webhook Configuration Fix

## 🚨 Problem
Users purchase subscriptions but are redirected to thank-you page without subscription activation because webhook isn't processing `checkout.session.completed` events.

## 🔧 Solution

### Step 1: Configure Stripe Webhook Events

**In Stripe Dashboard:**

1. **Go to:** Webhooks → Edit destination
2. **Add these events:**
   - `checkout.session.completed` ← **CRITICAL!**
   - `checkout.session.expired`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `payment_intent.payment_failed`

3. **Save** the webhook

### Step 2: Test Webhook Configuration

```bash
# Test webhook endpoint
curl -X GET http://localhost:3000/api/stripe/webhook/test
```

### Step 3: Manual Fix for Current Users

For users who already purchased but didn't get activated:

```bash
# Check current subscription status
curl -X GET http://localhost:3000/api/debug/subscription-status

# Manually activate user (replace USER_ID)
curl -X POST http://localhost:3000/api/debug/subscription-status \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "tier": "pro"}'
```

## 🔍 Debugging Steps

### 1. Check Webhook Logs
- Go to Stripe Dashboard → Webhooks → View logs
- Look for failed `checkout.session.completed` events
- Check for 500 errors

### 2. Check Server Logs
```bash
# Look for webhook processing logs
tail -f logs/server.log | grep "checkout.session.completed"
```

### 3. Verify Environment Variables
```bash
# Check if webhook secret is set
echo $STRIPE_WEBHOOK_SECRET
```

## 🚀 Expected Flow

1. **User purchases** → Stripe processes payment
2. **Stripe sends webhook** → `checkout.session.completed`
3. **Webhook processes** → Updates `users.subscription_tier`
4. **User redirected** → Thank-you page
5. **User returns** → Dashboard shows active subscription

## ⚠️ Common Issues

### Issue 1: Webhook Not Listening
**Symptoms:** Payment succeeds but no webhook received
**Fix:** Add `checkout.session.completed` to webhook events

### Issue 2: Webhook Fails
**Symptoms:** 500 error in webhook logs
**Fix:** Check database connection and user ID format

### Issue 3: Wrong User ID
**Symptoms:** Webhook succeeds but wrong user updated
**Fix:** Verify metadata in checkout session

## 🛠 Quick Fix Commands

```bash
# 1. Test webhook
curl -X GET http://localhost:3000/api/stripe/webhook/test

# 2. Check users
curl -X GET http://localhost:3000/api/debug/subscription-status

# 3. Fix specific user
curl -X POST http://localhost:3000/api/debug/subscription-status \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "tier": "TIER"}'
```

## 📋 Verification Checklist

- [ ] Webhook listens for `checkout.session.completed`
- [ ] Webhook endpoint returns 200 OK
- [ ] User subscription_tier updated in database
- [ ] Dashboard shows active subscription
- [ ] No upgrade prompts appear
