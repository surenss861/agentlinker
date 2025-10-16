# 📊 AgentLinker Analytics System - Complete Guide

## ✅ What's Been Built

You now have a **comprehensive analytics and conversion tracking system** that tracks the entire customer journey from page view to booking.

---

## 🎯 The Conversion Funnel

```
Page View → Listing View → Lead Form → Booking → Conversion!
```

Every step is tracked automatically and displayed in beautiful dashboards.

---

## 📊 What Gets Tracked

| Event Type | When It Fires | Example |
|------------|---------------|---------|
| `page_view` | Someone visits agent's public page | Visitor opens `/john-doe` |
| `link_click` | Visitor clicks external/social link | Click Instagram profile |
| `listing_view` | Visitor opens a property listing | View "123 Main St" |
| `lead_form` | Visitor submits showing request | **Auto-logged from leads table** |
| `booking_click` | Visitor books an appointment | **Auto-logged from bookings table** |

---

## 🏗️ Database Schema

### **analytics_events Table**

Stores every tracked interaction:

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),  -- The agent
  event_type TEXT,  -- page_view, link_click, etc.
  listing_id UUID,  -- Optional reference to listing
  lead_id UUID,     -- Optional reference to lead
  booking_id UUID,  -- Optional reference to booking
  metadata JSONB,   -- UTM params, referrer info, etc.
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ
);
```

### **analytics_summary Materialized View**

Pre-aggregated daily stats for fast queries:

```sql
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT
  user_id,
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'link_click') as link_clicks,
  ...
FROM analytics_events
GROUP BY user_id, day;
```

---

## 🚀 Setup Instructions

### Step 1: Run SQL Schema

```sql
-- In Supabase SQL Editor, run:
supabase-analytics-schema.sql
```

This creates:
- ✅ `analytics_events` table
- ✅ `analytics_summary` materialized view
- ✅ Helper functions (`get_conversion_rate`, `get_top_listings`)
- ✅ Auto-logging triggers (leads & bookings)
- ✅ RLS policies

### Step 2: Test Analytics API

```bash
# Fetch analytics for authenticated user
curl http://localhost:3002/api/analytics?days=30 \
  -H "Cookie: [your-auth-cookie]"
```

### Step 3: View Dashboard

Navigate to: **http://localhost:3002/dashboard/analytics**

You should see:
- 📈 Conversion funnel bar
- 📊 Daily trends chart
- 🥧 Traffic sources pie chart
- 📋 Recent activity feed

---

## 📈 Dashboard Features

### **1. Conversion Funnel**

Big visual bar showing:
```
Page Views → Lead Requests → Bookings → Conversion Rate
  1,000    →      42        →    12     →      4.2%
```

### **2. Key Metrics Cards**

- 👁 Page Views
- 🖱 Link Clicks
- 🏠 Listing Views
- 💬 Lead Forms
- 📅 Bookings

### **3. Daily Trends Chart**

Area chart showing views vs. leads vs. bookings over time.

### **4. Traffic Sources**

Pie chart breaking down where visitors come from:
- Instagram
- Facebook
- Google
- Direct
- Referrals

### **5. Recent Activity**

Live feed of all events as they happen.

---

## 🔄 Automatic Logging

### **Leads Auto-Log**

When a lead is created, it's automatically tracked:

```typescript
// Trigger fires on INSERT to leads table
INSERT INTO analytics_events (user_id, event_type, lead_id, listing_id)
VALUES (agent_id, 'lead_form', lead_id, listing_id);
```

### **Bookings Auto-Log**

When a booking is created, it's automatically tracked:

```typescript
// Trigger fires on INSERT to bookings table
INSERT INTO analytics_events (user_id, event_type, booking_id, listing_id)
VALUES (agent_id, 'booking_click', booking_id, listing_id);
```

---

## 📊 API Endpoints

### **GET `/api/analytics`**

Fetch comprehensive analytics for authenticated user.

**Query Params:**
- `days` (optional, default: 30) - Number of days to analyze

**Response:**
```json
{
  "metrics": {
    "pageViews": 1000,
    "linkClicks": 50,
    "listingViews": 300,
    "bookingClicks": 15,
    "leadForms": 42,
    "totalLeads": 42,
    "totalBookings": 12,
    "conversionRate": 4.2,
    "bookingConversionRate": 28.6
  },
  "trafficSources": {
    "direct": 500,
    "instagram": 300,
    "facebook": 200
  },
  "dailyTrends": [
    { "date": "2025-10-01", "views": 50, "leads": 2, "bookings": 1 },
    ...
  ],
  "topListings": [
    { "listing_id": "uuid", "views": 100, "leads": 5, "bookings": 2 }
  ],
  "recentEvents": [ ... ]
}
```

### **POST `/api/analytics`**

Track custom events (for public pages).

**Body:**
```json
{
  "user_id": "agent-uuid",
  "event_type": "page_view",
  "listing_id": "optional-listing-uuid",
  "metadata": {
    "utm_source": "instagram",
    "utm_campaign": "fall2025"
  },
  "referrer": "https://instagram.com",
  "user_agent": "Mozilla/5.0..."
}
```

---

## 🧩 Integration Example

### Track Page View on Public Profile

```typescript
// In your public agent page: app/[slug]/page.tsx
useEffect(() => {
  // Track page view
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: agent.id,
      event_type: 'page_view',
      metadata: {
        utm_source: searchParams.get('utm_source'),
        utm_campaign: searchParams.get('utm_campaign')
      },
      referrer: document.referrer,
      user_agent: navigator.userAgent
    })
  })
}, [])
```

### Track Listing View

```typescript
// When user clicks on a listing
const handleListingClick = (listingId: string) => {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: agent.id,
      event_type: 'listing_view',
      listing_id: listingId,
      metadata: { from: 'listing_grid' }
    })
  })
}
```

---

## 💡 Helper Functions

### **get_conversion_rate()**

Get conversion metrics for an agent:

```sql
SELECT * FROM get_conversion_rate('user-uuid', 30);

-- Returns:
-- page_views | lead_forms | bookings | conversion_rate
--    1000    |     42     |    12    |      4.2
```

### **get_top_listings()**

Get best-performing listings:

```sql
SELECT * FROM get_top_listings('user-uuid', 5);

-- Returns:
-- listing_id | views | leads | bookings | conversion_rate
```

### **refresh_analytics_summary()**

Refresh materialized view (run daily via cron):

```sql
SELECT refresh_analytics_summary();
```

---

## 🚀 Advanced Features

### **UTM Tracking**

Track campaign performance:

```
Share link: agentlinker.com/john-doe?utm_source=instagram&utm_campaign=fall2025
```

Analytics will automatically capture UTM parameters in `metadata` field.

### **Traffic Source Attribution**

Automatically detects source from:
1. UTM parameters (`utm_source`)
2. Referrer domain (`document.referrer`)
3. Falls back to "direct"

### **Unique Visitors**

Count distinct IP addresses per day:

```sql
SELECT
  COUNT(DISTINCT ip_address) as unique_visitors
FROM analytics_events
WHERE user_id = 'agent-uuid'
  AND created_at >= NOW() - INTERVAL '30 days';
```

---

## 💰 Monetization Strategy

### **Free Tier:**
- See basic stats (page views, leads, bookings)
- Last 7 days only
- No traffic sources breakdown

### **Pro Tier ($50/mo):**
- ✅ Full funnel analytics
- ✅ 90-day history
- ✅ Traffic source breakdown
- ✅ Daily trends chart
- ✅ Top listings report
- ✅ UTM tracking
- ✅ CSV export

---

## 📊 Dashboard Customization

### **Time Range Selector**

Users can toggle between:
- Last 7 days
- Last 30 days
- Last 90 days

### **Export Data**

```typescript
const exportToCSV = async () => {
  const response = await fetch(`/api/analytics?days=30&format=csv`)
  const blob = await response.blob()
  // Download CSV file
}
```

---

## 🔒 Security & Privacy

### **RLS Policies**

- ✅ Users can only view their own analytics
- ✅ Public can insert events (for tracking)
- ✅ No cross-user data leakage

### **IP Address Hashing** (Optional)

For GDPR compliance, hash IP addresses:

```sql
UPDATE analytics_events
SET ip_address = MD5(ip_address);
```

### **Data Retention**

Auto-delete old events (run monthly):

```sql
DELETE FROM analytics_events
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 📈 Performance Optimization

### **1. Use Materialized View**

For frequently accessed data:

```sql
SELECT * FROM analytics_summary
WHERE user_id = 'agent-uuid'
ORDER BY day DESC
LIMIT 30;
```

### **2. Index Everything**

Already created:
- `user_id`
- `created_at`
- `event_type`
- `(user_id, created_at)` composite

### **3. Query Pagination**

For large datasets:

```typescript
const { data } = await supabase
  .from('analytics_events')
  .select('*')
  .range(0, 99)  // First 100 rows
```

---

## 🎯 Success Metrics

Track these KPIs:

| Metric | Good | Great | Exceptional |
|--------|------|-------|-------------|
| Conversion Rate | >2% | >5% | >10% |
| Booking Rate | >20% | >30% | >40% |
| Avg Views/Day | >20 | >50 | >100 |

---

## 🚀 Next Steps

1. ✅ **Run `supabase-analytics-schema.sql`** in Supabase
2. ✅ **Test API** at `/api/analytics`
3. ✅ **View dashboard** at `/dashboard/analytics`
4. ✅ **Add tracking** to public pages
5. ✅ **Set up daily refresh** of materialized view
6. ✅ **Configure UTM campaigns** for social media

---

## 🏆 You're Done!

Your analytics system is **production-ready**! You can now:
- Track every visitor interaction
- Measure ROI on marketing campaigns
- Optimize listing performance
- Prove value to paying users

**This is enterprise-level analytics at $20/month.** 🚀

