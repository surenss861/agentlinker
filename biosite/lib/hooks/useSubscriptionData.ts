import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Subscription {
    id: string
    user_id: string
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
    stripe_payment_intent_id: string | null
    stripe_checkout_session_id: string | null
    tier: 'free' | 'pro' | 'business'
    status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing'
    amount_paid: number
    currency: string
    billing_cycle: 'monthly' | 'yearly' | 'one_time' | null
    current_period_start: string | null
    current_period_end: string | null
    trial_start: string | null
    trial_end: string | null
    canceled_at: string | null
    cancel_at_period_end: boolean
    metadata: any
    created_at: string
    updated_at: string
}

export function useSubscriptionData(userId: string) {
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchSubscription = async () => {
            try {
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                    throw error
                }

                setSubscription(data)
                setError(null)
            } catch (err: any) {
                console.error('Error fetching subscription:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscription()
    }, [userId, supabase])

    const refreshSubscription = async () => {
        if (!userId) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            setSubscription(data)
            setError(null)
        } catch (err: any) {
            console.error('Error refreshing subscription:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        subscription,
        loading,
        error,
        refreshSubscription
    }
}
