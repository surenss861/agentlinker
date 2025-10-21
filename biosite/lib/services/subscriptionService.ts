// Subscription management service
// Handles subscription status, feature access, and softwalls

export interface SubscriptionStatus {
  tier: 'free' | 'pro' | 'business' | 'help'
  status: 'active' | 'inactive' | 'canceled' | 'past_due'
  features: {
    unlimitedListings: boolean
    analytics: boolean
    bookingScheduler: boolean
    customDomain: boolean
    prioritySupport: boolean
    verifiedBadge: boolean
    advancedTemplates: boolean
    emailNotifications: boolean
    googleCalendarSync: boolean
    personalAssistance: boolean // New feature for Personal Help Pack
  }
  limits: {
    maxListings: number
    maxBookingsPerMonth: number
    maxLeadsPerMonth: number
  }
}

export const getSubscriptionFeatures = (tier: string): SubscriptionStatus['features'] => {
  switch (tier) {
    case 'pro':
      return {
        unlimitedListings: true,
        analytics: true,
        bookingScheduler: true,
        customDomain: true,
        prioritySupport: true,
        verifiedBadge: false,
        advancedTemplates: true,
        emailNotifications: true,
        googleCalendarSync: true,
        personalAssistance: false,
      }
    case 'business':
      return {
        unlimitedListings: true,
        analytics: true,
        bookingScheduler: true,
        customDomain: true,
        prioritySupport: true,
        verifiedBadge: true, // Business gets verified badge
        advancedTemplates: true,
        emailNotifications: true,
        googleCalendarSync: true,
        personalAssistance: false,
      }
    case 'help':
      return {
        unlimitedListings: true,
        analytics: true,
        bookingScheduler: true,
        customDomain: true,
        prioritySupport: true,
        verifiedBadge: false,
        advancedTemplates: true,
        emailNotifications: true,
        googleCalendarSync: true,
        personalAssistance: true, // Personal Help Pack gets personal assistance
      }
    default: // free
      return {
        unlimitedListings: false,
        analytics: false,
        bookingScheduler: false,
        customDomain: false,
        prioritySupport: false,
        verifiedBadge: false,
        advancedTemplates: false,
        emailNotifications: false,
        googleCalendarSync: false,
        personalAssistance: false,
      }
  }
}

export const getSubscriptionLimits = (tier: string): SubscriptionStatus['limits'] => {
  switch (tier) {
    case 'pro':
    case 'business':
    case 'help':
      return {
        maxListings: -1, // unlimited
        maxBookingsPerMonth: -1, // unlimited
        maxLeadsPerMonth: -1, // unlimited
      }
    default: // free
      return {
        maxListings: 3,
        maxBookingsPerMonth: 5,
        maxLeadsPerMonth: 10,
      }
  }
}

export const checkFeatureAccess = (tier: string, feature: keyof SubscriptionStatus['features']): boolean => {
  const features = getSubscriptionFeatures(tier)
  return features[feature]
}

export const checkLimitExceeded = (tier: string, limitType: keyof SubscriptionStatus['limits'], currentCount: number): boolean => {
  const limits = getSubscriptionLimits(tier)
  const limit = limits[limitType]

  // -1 means unlimited
  if (limit === -1) return false

  return currentCount >= limit
}

export const getUpgradeMessage = (tier: string, feature: string): string => {
  const messages = {
    free: `Upgrade to Pro to unlock ${feature}`,
    pro: `Upgrade to Business to unlock ${feature}`,
    business: 'You have access to all features!',
    help: 'You have access to all features!'
  }

  return messages[tier as keyof typeof messages] || messages.free
}
