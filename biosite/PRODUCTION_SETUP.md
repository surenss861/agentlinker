# Production Setup Guide for AgentLinker

## 🌐 Production URL
**Live Site:** https://www.agentlinker.ca

## 📋 Vercel Environment Variables Setup

Go to your Vercel project settings:
https://vercel.com/surenss861s-projects/agentlinker/settings/environment-variables

### Required Environment Variables:

#### App Configuration
```
NEXT_PUBLIC_APP_URL=https://www.agentlinker.ca
```

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://kjmnomtndntstbhpdklv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Your Service Role Key]
```

#### Stripe Configuration (Live Keys)
```
STRIPE_SECRET_KEY=[Your Live Secret Key - starts with sk_live_]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Your Live Publishable Key - starts with pk_live_]
STRIPE_WEBHOOK_SECRET=[Your Webhook Secret - starts with whsec_]
```

#### SendGrid Configuration
```
SENDGRID_API_KEY=[Your SendGrid API Key]
SENDGRID_FROM_EMAIL=contact@agentlinker.ca
```

#### EmailJS Configuration (Optional)
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=[Your Service ID]
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=[Your Public Key]
```

## 🚀 Deployment Checklist

### 1. Update Environment Variables in Vercel
- [ ] Set all environment variables in Vercel dashboard
- [ ] Use PRODUCTION scope for all variables
- [ ] Redeploy after updating variables

### 2. Database Setup
- [ ] Run the country support migration: `supabase-add-country-support.sql`
- [ ] Verify RLS policies are enabled
- [ ] Test authentication flow

### 3. Stripe Configuration
- [ ] Update Stripe webhook URL to: `https://www.agentlinker.ca/api/stripe/webhook`
- [ ] Verify webhook signing secret matches environment variable
- [ ] Test checkout flow with live keys
- [ ] Verify subscription updates work correctly

### 4. Domain Configuration
- [ ] Verify DNS points to Vercel
- [ ] Ensure www.agentlinker.ca is configured
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Test both www and non-www redirects

### 5. Email Configuration
- [ ] Verify SendGrid domain authentication
- [ ] Test booking confirmation emails
- [ ] Verify sender email: noreply@agentlinker.ca

### 6. Testing
- [ ] Test user registration flow
- [ ] Test listing creation (US & Canada)
- [ ] Test lead submission from public pages
- [ ] Test booking creation from public pages
- [ ] Test Stripe checkout for Pro plan ($20/month)
- [ ] Test Stripe checkout for Business plan ($25 one-time)
- [ ] Verify subscription unlocks features
- [ ] Test analytics tracking

## 🔒 Security Notes

1. **Never commit `.env.local` to Git**
2. **Use different Stripe keys for development and production**
3. **Rotate webhook secrets if exposed**
4. **Keep Supabase service role key secure**
5. **Use environment-specific SendGrid API keys**

## 📊 Monitoring

Monitor your production deployment:
- Vercel Dashboard: https://vercel.com/surenss861s-projects/agentlinker
- Supabase Dashboard: https://supabase.com/dashboard/project/kjmnomtndntstbhpdklv
- Stripe Dashboard: https://dashboard.stripe.com

## 🆘 Troubleshooting

### Environment Variables Not Working
1. Redeploy after changing environment variables
2. Clear Vercel build cache
3. Verify variable names match exactly (case-sensitive)

### Stripe Checkout Issues
1. Verify you're using live keys (pk_live_ and sk_live_)
2. Check webhook endpoint is configured correctly
3. Verify webhook secret matches

### Email Not Sending
1. Verify SendGrid API key is valid
2. Check domain authentication in SendGrid
3. Verify sender email matches authenticated domain

## 📝 Post-Deployment

After successful deployment:
1. Monitor error logs in Vercel
2. Check Supabase logs for any issues
3. Test critical user flows
4. Monitor Stripe dashboard for transactions
5. Update any marketing materials with new URL

