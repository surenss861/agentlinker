# 🚀 Quick Start: Test Stripe Webhooks Locally

## Option 1: Stripe CLI (Recommended - Easiest)

### 1. Install Stripe CLI
```bash
# Windows PowerShell (run as Administrator)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# OR download directly from:
# https://github.com/stripe/stripe-cli/releases/latest
```

### 2. Login to Stripe
```bash
stripe login
```
- Browser will open
- Click "Allow access"
- You're logged in!

### 3. Forward Webhooks to Local Dev Server
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdefghijklmnop
```

### 4. Copy the Webhook Secret
Copy the `whsec_...` value from the output above.

### 5. Update .env.local
Open `biosite/.env.local` and update:
```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnop
```
(Use the actual secret from step 3)

### 6. Restart Your Dev Server
```bash
# Press Ctrl+C to stop the current server
npm run dev
```

### 7. Make a Test Purchase!
1. Go to `http://localhost:3000/dashboard/billing`
2. Click "Upgrade to Pro"
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry date
5. Any CVC

### 8. Watch the Magic! ✨
- In the terminal running `stripe listen`, you'll see:
  ```
  2024-01-15 10:30:45  --> checkout.session.completed [evt_1234...]
  2024-01-15 10:30:45  <-- [200] POST http://localhost:3000/api/stripe/webhook [evt_1234...]
  ```

- In your Next.js server logs, you'll see:
  ```
  🔔 Webhook received
  ✅ Signature verified, event type: checkout.session.completed
  ✅ User subscription tier updated to pro
  🎉 PAYMENT SUCCESS: { tier: 'pro', amount: 20 }
  ```

- In your browser:
  - Walls lift automatically! 🎉
  - Upgrade prompts disappear
  - Pro features unlock

---

## Option 2: ngrok (If Stripe CLI doesn't work)

### 1. Install ngrok
Download from: https://ngrok.com/download

### 2. Start ngrok
```bash
ngrok http 3000
```

### 3. Copy the HTTPS URL
Look for the line:
```
Forwarding https://abc123.ngrok.io -> http://localhost:3000
```
Copy the `https://abc123.ngrok.io` URL

### 4. Add Webhook in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://abc123.ngrok.io/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_...`)

### 5. Update .env.local
```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_step_4
```

### 6. Restart Dev Server & Test
Same as Option 1, steps 6-8

---

## 🔍 Verify It's Working

### Check 1: Webhook Health
Visit: http://localhost:3000/api/stripe/webhook/health

Should return:
```json
{
  "message": "Webhook endpoint is reachable",
  "hasStripeSecret": true,
  "hasWebhookSecret": true,
  "status": "ok"
}
```

### Check 2: Make a Test Purchase
1. Use Stripe test card: `4242 4242 4242 4242`
2. Watch terminal logs
3. Refresh your dashboard - upgrade prompts should be gone!

### Check 3: Database
In Supabase SQL Editor:
```sql
SELECT id, email, subscription_tier, updated_at 
FROM users 
ORDER BY updated_at DESC 
LIMIT 5;
```

You should see your user with `subscription_tier = 'pro'`

---

## 🎯 What You Should See

### In Terminal (Stripe CLI):
```
Ready! Your webhook signing secret is whsec_...
  --> checkout.session.completed [evt_...]
  <-- [200] POST http://localhost:3000/api/stripe/webhook
```

### In Next.js Logs:
```
🔔 Webhook received
✅ Signature verified
✅ Checkout session completed
💰 Payment status: paid
✅ User subscription tier updated to pro
🎉 PAYMENT SUCCESS
```

### In Browser:
- Upgrade prompts disappear instantly
- Pro features unlock
- No page refresh needed!

---

## 🐛 Common Issues

### Issue: "Webhook signature verification failed"
**Fix:** 
- Make sure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the one from `stripe listen` output
- Restart your dev server after updating `.env.local`

### Issue: "Walls don't lift"
**Fix:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check console logs for errors

### Issue: "stripe: command not found"
**Fix:**
- Make sure Stripe CLI is installed
- Add to PATH if needed
- Or use ngrok instead (Option 2)

---

## ✅ Success!

Once you see:
- ✅ Webhook receives events
- ✅ Database updates
- ✅ Walls lift in real-time
- ✅ Pro features unlock

**You're ready for production!** 🚀

Just update the webhook URL to your production domain in Stripe Dashboard and you're done!

