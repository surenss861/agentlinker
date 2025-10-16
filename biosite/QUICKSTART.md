# 🚀 BioPage Quick Start Guide

Get BioPage running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free)
- A Stripe account (test mode is fine)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env.local` file in the root:

```env
# Supabase (Get these from https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe (Get these from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (Create products in Stripe Dashboard first)
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_BUSINESS_PRICE_ID=price_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Set Up Supabase Database

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and run it

## 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 5. Create Your First Agent Profile

1. Click "Get Started" or "Sign Up"
2. Create an account with:
   - Full Name
   - Email
   - Password (min 6 characters)
3. Complete onboarding:
   - Choose your BioPage URL (slug)
   - Add your info (phone, brokerage, bio)
   - Select a template (Modern, Luxury, or Minimalist)
4. Click "Complete Setup"

## 6. Add a Listing

1. Go to Dashboard → Listings
2. Click "Add Listing"
3. Fill in property details
4. Check "Feature this listing"
5. Create listing

## 7. View Your Public Page

Visit: `http://localhost:3000/your-slug`

This is what your clients will see!

---

## What's Next?

### For Development
- See `SETUP.md` for detailed setup instructions
- See `README.md` for full feature list
- Customize templates in `app/[slug]/page.tsx`
- Add more features from the roadmap

### For Production
- Deploy to Vercel (recommended)
- Set up custom domain
- Switch to Stripe live keys
- Configure email service
- Set up monitoring

---

## Common Issues

**Build fails?**
```bash
rm -rf .next
npm run build
```

**Supabase connection error?**
- Check your environment variables
- Verify Supabase project is active
- Restart dev server after changing .env.local

**Pages not loading?**
- Clear browser cache
- Check console for errors
- Verify database schema was run

---

## File Structure

```
biosite/
├── app/                      # Next.js app directory
│   ├── [slug]/              # Public agent pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Agent dashboard
│   ├── login/               # Auth pages
│   └── ...
├── components/              # React components
├── lib/                     # Utilities (Supabase clients)
├── types/                   # TypeScript types
├── supabase-schema.sql      # Database schema
└── ...
```

---

## Key Features Implemented

✅ Landing page with pricing
✅ User authentication (Supabase)
✅ Agent onboarding flow
✅ Dashboard with stats
✅ Listings management
✅ Lead capture form
✅ Analytics tracking
✅ Three design templates
✅ Public agent pages
✅ Stripe billing integration
✅ Booking management

---

## Support

- **Detailed Setup**: See `SETUP.md`
- **Full Documentation**: See `README.md`
- **Database Schema**: See `supabase-schema.sql`

---

**Happy Building! 🎉**

Turn those clicks into clients!

