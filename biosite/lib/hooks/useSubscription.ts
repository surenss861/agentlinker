// Hook for subscription management and feature access
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { getSubscriptionFeatures, getSubscriptionLimits, checkFeatureAccess, checkLimitExceeded, getUpgradeMessage, type SubscriptionStatus } from '@/lib/services/subscriptionService'

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchSubscription = async () => {
    try {
      console.log('🔄 useSubscription - fetchSubscription called')
      const { data: { user } } = await supabase.auth.getUser()
      console.log('🔍 useSubscription - current user:', user?.id)

      if (!user) {
        console.log('❌ useSubscription - no user found')
        setLoading(false)
        return
      }

      console.log('🔍 useSubscription - fetching user profile for:', user.id)
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('❌ useSubscription - profile fetch error:', profileError)
      }

      if (userProfile) {
        const tier = userProfile.subscription_tier || 'free'
        const features = getSubscriptionFeatures(tier)
        const limits = getSubscriptionLimits(tier)

        console.log('🔍 useSubscription - fetched tier:', tier)
        console.log('🔍 useSubscription - userProfile:', userProfile)
        console.log('🔍 useSubscription - features:', features)

        setSubscription({
          tier: tier as 'free' | 'pro' | 'business' | 'help',
          status: 'active', // You can add actual status checking here
          features,
          limits
        })
      } else {
        console.log('❌ useSubscription - no userProfile found')
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()

    // Refresh subscription data every 10 seconds to catch updates
    const interval = setInterval(fetchSubscription, 10000)

    return () => clearInterval(interval)
  }, [supabase])

  // Add manual refresh function
  const refreshSubscription = () => {
    fetchSubscription()
  }

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
    refreshSubscription: fetchSubscription,
    hasFeature,
    isLimitExceeded,
    getUpgradeText,
    canCreateListing,
    canCreateBooking,
    canCreateLead,
  }
}
