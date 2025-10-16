# 🚀 BioPage Setup Guide

Complete setup instructions for getting BioPage up and running.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is fine)
- A Stripe account (for payment processing)
- Git

---

## Step 1: Clone and Install

```bash
# Navigate to your project directory
cd biosite

# Install dependencies
npm install
```

---

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose an organization
4. Enter project details:
   - Name: `biopage` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project" and wait for provisioning

### 2.2 Run Database Schema

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" to execute
6. Verify tables were created in the "Table Editor" section

### 2.3 Enable Authentication

1. Go to "Authentication" → "Providers"
2. Ensure "Email" is enabled (it should be by default)
3. Configure email templates if desired (optional)

### 2.4 Get API Keys

1. Go to "Project Settings" → "API"
2. Copy these values (you'll need them for .env.local):
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

---

## Step 3: Stripe Setup

### 3.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (you can use test mode initially)

### 3.2 Create Products and Prices

In Stripe Dashboard:

1. Go to "Products" → "Add Product"
2. Create two products:

**Pro Plan:**
- Name: BioPage Pro
- Description: Professional features for active agents
- Price: $9.00 USD/month (recurring)
- Copy the Price ID (starts with `price_...`)

**Business Plan:**
- Name: BioPage Business
- Description: Advanced features for top producers
- Price: $29.00 USD/month (recurring)
- Copy the Price ID (starts with `price_...`)

### 3.3 Get API Keys

1. Go to "Developers" → "API keys"
2. Copy:
   - Publishable key (starts with `pk_test_...` or `pk_live_...`)
   - Secret key (starts with `sk_test_...` or `sk_live_...`)

### 3.4 Setup Webhook (for production)

1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret

---

## Step 4: Environment Variables

Create a file named `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs (from step 3.2)
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_BUSINESS_PRICE_ID=price_xxxxxxxxxxxxx

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (Optional - for lead notifications)
# You can use Gmail, SendGrid, or any SMTP service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@biopage.com
```

**Important Security Notes:**
- Never commit `.env.local` to git
- Never share your service role key or secret key
- Use test mode keys during development

---

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the BioPage landing page!

---

## Step 6: Test the Application

### 6.1 Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in your details:
   - Full Name
   - Email
   - Password (min 6 characters)
3. Click "Create Account"

### 6.2 Complete Onboarding

1. Fill in your agent profile:
   - Full Name
   - Your BioPage URL (slug)
   - Phone, Brokerage, Bio (optional)
   - Choose a template
2. Click "Complete Setup"

### 6.3 Explore the Dashboard

You should now be in your dashboard where you can:
- View stats (initially all zeros)
- Add listings
- View leads (empty initially)
- Check analytics
- Customize settings
- Manage billing

### 6.4 View Your Public Page

1. In the dashboard, click on your public URL
2. Or navigate to `http://localhost:3000/your-slug`
3. This is what potential clients will see!

---

## Step 7: Add Your First Listing

1. Go to "Listings" in the dashboard
2. Click "Add Listing"
3. Fill in property details:
   - Title, Description
   - Location (Address, City, State, ZIP)
   - Price, Bedrooms, Bathrooms
   - Property Type
4. Add photos (currently using placeholders)
5. Check "Feature this listing" to show it on your BioPage
6. Click "Create Listing"

---

## Step 8: Test Lead Capture

1. Visit your public BioPage
2. Scroll to the "Get in Touch" form
3. Fill out the form and submit
4. Go back to your dashboard → "Leads"
5. You should see your test lead!

---

## Deployment (Production)

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add all environment variables from `.env.local`
6. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up serverless functions
- Enable edge caching
- Provide a `.vercel.app` domain

### Option 2: Other Platforms

BioPage can also be deployed to:
- **Netlify**: Similar process to Vercel
- **Railway**: Great for full-stack apps
- **DigitalOcean App Platform**: More control over infrastructure
- **AWS Amplify**: If you're in the AWS ecosystem

### Post-Deployment Steps

1. Update `NEXT_PUBLIC_APP_URL` in environment variables to your production domain
2. Set up Stripe webhook endpoint with your production URL
3. Switch from Stripe test keys to live keys
4. Configure custom domain (if applicable)
5. Set up monitoring and error tracking (e.g., Sentry)

---

## Troubleshooting

### Common Issues

**"Invalid API key" error:**
- Double-check your Supabase keys in `.env.local`
- Make sure there are no extra spaces
- Restart the dev server after changing env variables

**Database connection errors:**
- Verify the SQL schema was executed correctly
- Check Row Level Security policies are enabled
- Ensure your Supabase project is active

**Stripe checkout not working:**
- Verify Stripe keys are correct
- Check price IDs match your Stripe products
- Look at browser console for errors
- Check Stripe dashboard logs

**Pages not loading:**
- Clear browser cache
- Check console for JavaScript errors
- Verify all dependencies are installed
- Try `rm -rf .next && npm run dev`

---

## Next Steps

### Immediate Enhancements

1. **Email Notifications**: Integrate SendGrid or Resend for lead notifications
2. **Image Upload**: Implement Supabase Storage for real image uploads
3. **Calendar Integration**: Connect Google Calendar or Calendly
4. **SEO Optimization**: Add metadata and structured data
5. **Analytics**: Integrate Google Analytics or Plausible

### Future Features (V2)

- MLS auto-import
- Video property tours
- AI-powered listing descriptions
- Multi-language support
- Mobile app (React Native)
- Team/Agency accounts
- Advanced CRM integration

---

## Support

If you run into issues:

1. Check the troubleshooting section above
2. Review Supabase logs in your dashboard
3. Check Stripe dashboard for payment issues
4. Look at browser console for frontend errors
5. Check server logs with `npm run dev`

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## Security Checklist

Before going to production:

- [ ] Environment variables are set correctly
- [ ] Row Level Security is enabled on all tables
- [ ] API keys are not exposed in client-side code
- [ ] Stripe webhook secret is configured
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)
- [ ] Input validation is in place
- [ ] SQL injection protection (Supabase handles this)
- [ ] XSS protection (React handles most of this)

---

**You're all set! Welcome to BioPage 🎉**

Start building your real estate empire, one click at a time.

