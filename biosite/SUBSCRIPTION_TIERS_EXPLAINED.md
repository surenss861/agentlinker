# AgentLinker Subscription Tiers Explained

## 🎯 Three Distinct Subscription Tiers

AgentLinker now properly distinguishes between three different subscription tiers, each with unique features and purposes:

---

## 📊 **FREE TIER** - `tier: 'free'`
**Price:** $0/month  
**Purpose:** Basic platform access with limitations

### Features:
- ❌ Limited listings (3 max)
- ❌ No analytics
- ❌ No booking scheduler
- ❌ No custom domain
- ❌ No priority support
- ❌ No verified badge
- ❌ No advanced templates
- ❌ No email notifications
- ❌ No Google Calendar sync
- ❌ No personal assistance

### Limits:
- **Max Listings:** 3
- **Max Bookings:** 5/month
- **Max Leads:** 10/month

---

## 🚀 **PRO TIER** - `tier: 'pro'`
**Price:** $20/month  
**Purpose:** Full platform features for growing agents

### Features:
- ✅ Unlimited listings
- ✅ Analytics dashboard
- ✅ Booking scheduler
- ✅ Custom domain
- ✅ Priority support
- ❌ No verified badge
- ✅ Advanced templates
- ✅ Email notifications
- ✅ Google Calendar sync
- ❌ No personal assistance

### Limits:
- **Max Listings:** Unlimited
- **Max Bookings:** Unlimited
- **Max Leads:** Unlimited

---

## 🏆 **BUSINESS TIER** - `tier: 'business'`
**Price:** $25 one-time  
**Purpose:** Pro features + Verified Badge for credibility

### Features:
- ✅ Unlimited listings
- ✅ Analytics dashboard
- ✅ Booking scheduler
- ✅ Custom domain
- ✅ Priority support
- ✅ **Verified Badge** ← Unique to Business
- ✅ Advanced templates
- ✅ Email notifications
- ✅ Google Calendar sync
- ❌ No personal assistance

### Limits:
- **Max Listings:** Unlimited
- **Max Bookings:** Unlimited
- **Max Leads:** Unlimited

---

## 👨‍💼 **PERSONAL HELP PACK** - `tier: 'help'`
**Price:** $50/month  
**Purpose:** Pro features + Personal assistance for busy agents

### Features:
- ✅ Unlimited listings
- ✅ Analytics dashboard
- ✅ Booking scheduler
- ✅ Custom domain
- ✅ Priority support
- ❌ No verified badge
- ✅ Advanced templates
- ✅ Email notifications
- ✅ Google Calendar sync
- ✅ **Personal Assistance** ← Unique to Help Pack

### Limits:
- **Max Listings:** Unlimited
- **Max Bookings:** Unlimited
- **Max Leads:** Unlimited

---

## 🔧 **Backend Implementation**

### Database Schema:
```sql
-- Users table
subscription_tier: 'free' | 'pro' | 'business' | 'help'
```

### Subscription Service:
```typescript
// Each tier has distinct features
case 'pro': // All platform features
case 'business': // Pro + Verified Badge
case 'help': // Pro + Personal Assistance
```

### Feature Gating:
```typescript
// Check specific features
subscription.features.verifiedBadge // Only Business tier
subscription.features.personalAssistance // Only Help Pack tier
```

---

## 🎯 **Key Differences**

| Feature | Free | Pro | Business | Help Pack |
|---------|------|-----|----------|-----------|
| **Price** | $0 | $20/mo | $25 one-time | $50/mo |
| **Platform Features** | Limited | ✅ All | ✅ All | ✅ All |
| **Verified Badge** | ❌ | ❌ | ✅ | ❌ |
| **Personal Assistance** | ❌ | ❌ | ❌ | ✅ |
| **Billing** | - | Monthly | One-time | Monthly |

---

## 🚀 **Upgrade Paths**

1. **Free → Pro:** Unlock all platform features
2. **Pro → Business:** Add verified badge (one-time)
3. **Pro → Help Pack:** Add personal assistance (monthly)
4. **Business → Help Pack:** Add personal assistance (monthly)

---

## 📋 **Testing**

Use the test page to verify tier-specific features:
```
http://localhost:3000/test-subscription
```

This will show:
- Current tier
- All available features
- Tier-specific limits
- Personal assistance status
