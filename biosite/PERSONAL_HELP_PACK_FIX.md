# Personal Help Pack Subscription Issue Fix

## 🚨 Problem
Users purchase Personal Help Pack but features don't apply after redirect to thank-you page.

## 🔍 Debugging Steps

### 1. Check Webhook Status
```bash
# Test webhook endpoint
curl -X GET http://localhost:3000/api/stripe/webhook/test
```

### 2. Check Subscription Status
```bash
# Debug subscription status
curl -X GET http://localhost:3000/api/debug/subscription-status
```

### 3. Manual Fix (if needed)
```bash
# Manually update user to help tier
curl -X POST http://localhost:3000/api/debug/subscription-status \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_HERE", "tier": "help"}'
```

## 🔧 Common Issues & Solutions

### Issue 1: Webhook Not Triggered
**Symptoms:** User pays but subscription_tier stays 'free'
**Solution:** 
1. Check Stripe webhook configuration
2. Verify webhook secret in environment variables
3. Check webhook logs in Stripe dashboard

### Issue 2: Webhook Fails
**Symptoms:** 500 error in webhook logs
**Solution:**
1. Check database connection
2. Verify users table has subscription_tier column
3. Check for foreign key constraints

### Issue 3: Features Not Applied
**Symptoms:** subscription_tier is 'help' but features still gated
**Solution:**
1. Check subscriptionService.ts has 'help' case
2. Verify feature gating logic
3. Clear browser cache

## 🛠 Manual Fix Process

### Step 1: Get User ID
1. Go to Supabase dashboard
2. Check `users` table
3. Find user by email
4. Copy user ID

### Step 2: Update Subscription
```sql
-- Update user subscription tier
UPDATE users 
SET subscription_tier = 'help' 
WHERE id = 'USER_ID_HERE';
```

### Step 3: Verify Features
1. Log out and log back in
2. Check dashboard features are unlocked
3. Verify billing page shows "Personal Help Pack" status

## 🔄 Automatic Fix

The webhook should automatically handle this, but if it fails:

1. **Check Stripe Dashboard:**
   - Go to Webhooks section
   - Check for failed webhook calls
   - Look for error messages

2. **Check Environment Variables:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Test Webhook Manually:**
   - Use Stripe CLI to send test webhook
   - Check server logs for errors

## 📋 Verification Checklist

- [ ] User subscription_tier = 'help' in database
- [ ] Features are unlocked in dashboard
- [ ] Billing page shows Personal Help Pack status
- [ ] No upgrade prompts appear
- [ ] All Pro features are accessible

## 🚀 Quick Fix Commands

```bash
# Check current user status
curl -X GET http://localhost:3000/api/debug/subscription-status

# Fix specific user
curl -X POST http://localhost:3000/api/debug/subscription-status \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "tier": "help"}'
```

## 📞 Support
If issues persist, check:
1. Stripe webhook logs
2. Server console logs
3. Database subscription records
4. User subscription_tier field
