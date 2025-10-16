'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface SubscriptionStatus {
  plan: 'free' | 'pro' | 'trial'
  status: 'active' | 'cancelled' | 'expired'
  trialEnds?: string
  renewsAt?: string
  loading: boolean
}

export const useSubscriptionStatus = (userId: string): SubscriptionStatus => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    plan: 'trial',
    status: 'active',
    loading: true
  })

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const fetchSubscription = async () => {
      try {
        setSubscription(prev => ({ ...prev, loading: true }))
        
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan, status, trial_ends_at, renews_at')
          .eq('user_id', userId)
          .maybeSingle()

        // If no subscription found or error, default to trial
        if (error || !data) {
          setSubscription({
            plan: 'trial',
            status: 'active',
            loading: false
          })
          return
        }

        setSubscription({
          plan: data.plan || 'trial',
          status: data.status || 'active',
          trialEnds: data.trial_ends_at,
          renewsAt: data.renews_at,
          loading: false
        })
      } catch (error) {
        // On any error, default to trial
        setSubscription({
          plan: 'trial',
          status: 'active',
          loading: false
        })
      }
    }

    fetchSubscription()

    // Set up real-time subscription for subscription changes
    const channel = supabase
      .channel('realtime:subscription')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'subscriptions' }, 
        (payload) => {
          console.log('Subscription change received:', payload)
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return subscription
}
