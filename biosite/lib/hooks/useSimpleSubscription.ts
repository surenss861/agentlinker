// Simple subscription hook - real-time updates from users table
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { createSubscriptionStatus, type SimpleSubscriptionStatus } from '@/lib/services/simpleSubscriptionService'

export function useSimpleSubscription() {
    const [subscription, setSubscription] = useState<SimpleSubscriptionStatus | null>(null)
    const [verifiedBadge, setVerifiedBadge] = useState(false)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchSubscription = async () => {
        try {
            console.log('🔄 Fetching subscription status...')
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                console.log('❌ No user found')
                setLoading(false)
                return
            }

            console.log('🔍 Fetching user profile for:', user.id)
            const { data: userProfile, error: profileError } = await supabase
                .from('users')
                .select('subscription_tier, verified_badge, updated_at')
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.error('❌ Profile fetch error:', profileError)
                setLoading(false)
                return
            }

            const tier = userProfile.subscription_tier || 'free'
            const subscriptionStatus = createSubscriptionStatus(tier)
            const hasVerifiedBadge = userProfile.verified_badge || false

            console.log('✅ Subscription status:', {
                tier: tier,
                isActive: subscriptionStatus.isActive,
                verifiedBadge: hasVerifiedBadge,
                features: Object.keys(subscriptionStatus.features).filter(key => subscriptionStatus.features[key as keyof typeof subscriptionStatus.features])
            })

            setSubscription(subscriptionStatus)
            setVerifiedBadge(hasVerifiedBadge)
        } catch (error) {
            console.error('❌ Subscription fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscription()

        // Set up real-time subscription to users table
        const channel = supabase
            .channel('realtime:subscription')
            .on('postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${supabase.auth.getUser().then(u => u.data.user?.id)}`
                },
                (payload) => {
                    console.log('🔔 Subscription status changed:', payload)
                    fetchSubscription() // Refresh subscription status
                }
            )
            .subscribe()

        // Also refresh every 5 seconds as backup
        const interval = setInterval(fetchSubscription, 5000)

        return () => {
            supabase.removeChannel(channel)
            clearInterval(interval)
        }
    }, [supabase])

    const hasFeature = (feature: keyof SimpleSubscriptionStatus['features']): boolean => {
        if (!subscription) return false
        return subscription.features[feature]
    }

    const isLimitExceeded = (limitType: keyof SimpleSubscriptionStatus['limits'], currentCount: number): boolean => {
        if (!subscription) return true
        return currentCount >= subscription.limits[limitType]
    }

    const getUpgradeMessage = (feature: string): string => {
        if (!subscription) return `Upgrade to unlock ${feature}`

        if (subscription.tier === 'free') {
            return `Upgrade to Pro to unlock ${feature}`
        }
        if (subscription.tier === 'pro') {
            return `Upgrade to Business to unlock ${feature}`
        }
        return `You have access to ${feature}`
    }

    const refreshSubscription = () => {
        fetchSubscription()
    }

    return {
        subscription,
        loading,
        hasFeature,
        isLimitExceeded,
        getUpgradeMessage,
        refreshSubscription,
        // Convenience methods
        isPro: subscription?.tier === 'pro' || subscription?.tier === 'business' || subscription?.tier === 'help',
        isBusiness: subscription?.tier === 'business' || subscription?.tier === 'help',
        isHelp: subscription?.tier === 'help',
        isActive: subscription?.isActive || false,
        // Verified badge status (separate from Pro)
        isVerified: verifiedBadge,
        verifiedBadge: verifiedBadge,
    }
}
