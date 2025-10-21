// Hook for subscription management and feature access
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { getSubscriptionFeatures, getSubscriptionLimits, checkFeatureAccess, checkLimitExceeded, getUpgradeMessage, type SubscriptionStatus } from '@/lib/services/subscriptionService'

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: userProfile } = await supabase
          .from('users')
          .select('subscription_tier')
          .eq('id', user.id)
          .single()

        if (userProfile) {
          const tier = userProfile.subscription_tier || 'free'
          const features = getSubscriptionFeatures(tier)
          const limits = getSubscriptionLimits(tier)

          console.log('🔍 useSubscription - fetched tier:', tier)

          setSubscription({
            tier: tier as 'free' | 'pro' | 'business',
            status: 'active', // You can add actual status checking here
            features,
            limits
          })
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()

    // Refresh subscription data every 30 seconds to catch updates
    const interval = setInterval(fetchSubscription, 30000)

    return () => clearInterval(interval)
  }, [supabase])

  const hasFeature = (feature: keyof SubscriptionStatus['features']): boolean => {
    if (!subscription) return false
    return checkFeatureAccess(subscription.tier, feature)
  }

  const isLimitExceeded = (limitType: keyof SubscriptionStatus['limits'], currentCount: number): boolean => {
    if (!subscription) return true
    return checkLimitExceeded(subscription.tier, limitType, currentCount)
  }

  const getUpgradeText = (feature: string): string => {
    if (!subscription) return `Upgrade to unlock ${feature}`
    return getUpgradeMessage(subscription.tier, feature)
  }

  const canCreateListing = (currentListingsCount: number): boolean => {
    return !isLimitExceeded('maxListings', currentListingsCount)
  }

  const canCreateBooking = (currentBookingsCount: number): boolean => {
    return !isLimitExceeded('maxBookingsPerMonth', currentBookingsCount)
  }

  const canCreateLead = (currentLeadsCount: number): boolean => {
    return !isLimitExceeded('maxLeadsPerMonth', currentLeadsCount)
  }

  return {
    subscription,
    loading,
    hasFeature,
    isLimitExceeded,
    getUpgradeText,
    canCreateListing,
    canCreateBooking,
    canCreateLead,
  }
}
