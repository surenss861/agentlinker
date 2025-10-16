# 🏠 BioPage - Smart Growth Hub for Real Estate Agents

**Turn every click into a client.**

BioPage is an all-in-one mini-site for real estate agents — showcase listings, book showings, capture leads, and build your brand — all from one link you can drop anywhere.

Think of it as **Linktree meets Zillow**, built specifically for real estate pros who want more deals and less busywork.

---

## 🚀 Features

### MVP Features
- ✅ **Agent Profile** - Photo, bio, brokerage, social links
- ✅ **Featured Listings** - Manual upload with photos and details
- ✅ **Booking Scheduler** - Integrated call/showing booking
- ✅ **Lead Capture Form** - Direct email + CRM sync ready
- ✅ **Real-time Analytics** - Track visits, clicks, and leads
- ✅ **Design Templates** - Luxury, Modern, and Minimalist themes
- ✅ **Custom Slug** - Personal URLs (biopage.com/your-name)
- ✅ **Tier-based Plans** - Free, Pro ($9/mo), Business ($29/mo)

### Pricing Tiers

**Free Plan**
- 1 mini-site
- Up to 5 listings
- Basic templates
- Lead capture form
- BioPage watermark

**Pro Plan - $9/mo**
- Unlimited listings
- All premium templates
- Booking scheduler
- Analytics dashboard
- No watermark

**Business Plan - $29/mo**
- Everything in Pro
- Advanced analytics
- Lead SMS notifications
- Custom domain support
- Priority support

**Add-ons**
- Custom domain: $7/mo
- Verified Agent badge: $25 one-time

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe
- **Analytics**: Custom event tracking
- **Hosting**: Vercel (recommended)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd biosite
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in the Supabase SQL editor
   - Enable authentication (Email/Password)
   - Get your project URL and anon key

4. **Configure environment variables**
   
Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Pricing IDs (create these in Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_BUSINESS_PRICE_ID=price_xxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (optional - for lead notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@biopage.com
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📊 Database Schema

The application uses the following main tables:

- **agents** - Real estate agent profiles
- **listings** - Property listings
- **leads** - Captured leads from contact forms
- **analytics** - Event tracking (page views, clicks, etc.)
- **bookings** - Scheduled showings and calls

See `supabase-schema.sql` for the complete schema with Row Level Security policies.

---

## 🎨 Templates

BioPage includes three professionally designed templates:

1. **Modern** - Clean, contemporary design with blue/purple gradients
2. **Luxury** - Elegant dark theme with gold accents
3. **Minimalist** - Simple, focused design with maximum readability

Agents can switch templates instantly from their settings page.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up custom domains
- Enable serverless functions
- Configure edge caching

### Other Platforms

BioPage can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## 📈 Growth Strategy

### Go-to-Market
1. **Start Local** - Launch in GTA → onboard 100 agents quickly
2. **Brokerage Deals** - Offer free Pro accounts to entire offices
3. **SEO** - Rank for "link in bio for realtors" and "real estate bio link"
4. **Content Funnel** - YouTube/TikTok tutorials - "Make your realtor page in 60 seconds"

### Viral Growth Loop
Each agent posts their BioPage on:
- Instagram & TikTok bios
- MLS listings and Realtor.ca profiles
- QR codes on "For Sale" signs
- Email signatures and newsletters

This creates organic backlinks and brand exposure with zero ad spend.

---

## 🔮 Future Features (V2)

- [ ] Video-first property pages (YouTube/Instagram embeds)
- [ ] Smart lead scoring + instant SMS alerts
- [ ] AI-powered listing descriptions
- [ ] Agency dashboards with team performance insights
- [ ] MLS auto-import integration
- [ ] Multi-language support
- [ ] Allergen/dietary icons for open houses
- [ ] Property comparison tools
- [ ] Virtual tour integration
- [ ] External calendar integration (optional)

---

## 🤝 Contributing

This is a commercial project. If you're interested in contributing or partnering, please reach out.

---

## 📄 License

All rights reserved. This is proprietary software.

---

## 💡 Support

For issues or questions:
- Email: support@biopage.com
- Documentation: [Coming Soon]

---

## 🎯 Why BioPage Wins

It's not "just another tool" — it's a **revenue engine** for agents. 

You're solving a real conversion problem, charging monthly, and letting them grow their business without more apps or complexity.

**Built for real estate agents. By developers who care.**

---

Made with ❤️ for the real estate community
# agentlinker
# agentlinker
