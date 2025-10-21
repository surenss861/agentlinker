import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase-service'

export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceSupabaseClient()

        // Get the current user from the request
        const authHeader = request.headers.get('authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
        }

        // Extract user ID from the auth token (this is a simplified approach)
        // In production, you'd want to verify the JWT token properly
        const token = authHeader.replace('Bearer ', '')

        // For now, let's get the user ID from the query params
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
        }

        // Get user subscription status
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, subscription_tier, stripe_customer_id')
            .eq('id', userId)
            .single()

        if (userError) {
            console.error('❌ Error fetching user:', userError)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get subscription details if they exist
        const { data: subscription, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                subscription_tier: user.subscription_tier,
                stripe_customer_id: user.stripe_customer_id
            },
            subscription: subscription,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('❌ Subscription status API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
