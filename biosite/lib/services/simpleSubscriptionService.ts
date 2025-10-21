// Simple subscription service - reads directly from users table
// No complex subscription table needed!

export interface SimpleSubscriptionStatus {
    tier: 'free' | 'pro' | 'business' | 'help'
    isActive: boolean
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
        personalAssistance: boolean
    }
    limits: {
        maxListings: number
        maxBookingsPerMonth: number
        maxLeadsPerMonth: number
    }
}

// Simple feature mapping
export function getSubscriptionFeatures(tier: string): SimpleSubscriptionStatus['features'] {
    const isPro = tier === 'pro' || tier === 'business' || tier === 'help'
    const isBusiness = tier === 'business' || tier === 'help'
    const isHelp = tier === 'help'

    return {
        unlimitedListings: isPro,
        analytics: isPro,
        bookingScheduler: isPro,
        customDomain: isBusiness,
        prioritySupport: isPro,
        verifiedBadge: isBusiness,
        advancedTemplates: isBusiness,
        emailNotifications: isBusiness,
        googleCalendarSync: isBusiness,
        personalAssistance: isHelp,
    }
}

// Simple limits mapping
export function getSubscriptionLimits(tier: string): SimpleSubscriptionStatus['limits'] {
    const isPro = tier === 'pro' || tier === 'business' || tier === 'help'

    return {
        maxListings: isPro ? 999 : 3,
        maxBookingsPerMonth: isPro ? 999 : 5,
        maxLeadsPerMonth: isPro ? 999 : 10,
    }
}

// Simple access control
export function checkFeatureAccess(tier: string, feature: keyof SimpleSubscriptionStatus['features']): boolean {
    const features = getSubscriptionFeatures(tier)
    return features[feature]
}

export function checkLimitExceeded(tier: string, limitType: keyof SimpleSubscriptionStatus['limits'], currentCount: number): boolean {
    const limits = getSubscriptionLimits(tier)
    return currentCount >= limits[limitType]
}

// Simple upgrade messages
export function getUpgradeMessage(tier: string, feature: string): string {
    if (tier === 'free') {
        return `Upgrade to Pro to unlock ${feature}`
    }
    if (tier === 'pro') {
        return `Upgrade to Business to unlock ${feature}`
    }
    return `You have access to ${feature}`
}

// Simple subscription status creator
export function createSubscriptionStatus(tier: string): SimpleSubscriptionStatus {
    return {
        tier: tier as SimpleSubscriptionStatus['tier'],
        isActive: tier !== 'free',
        features: getSubscriptionFeatures(tier),
        limits: getSubscriptionLimits(tier),
    }
}
