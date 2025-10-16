import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }

        const supabase = createClient()

        // Get all user data
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (userError) {
            return NextResponse.json({
                error: 'User not found',
                details: userError
            }, { status: 404 })
        }

        // Get all subscriptions for this user
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)

        // Get all users to see if there are duplicates
        const { data: allUsers, error: allUsersError } = await supabase
            .from('users')
            .select('id, email, subscription_tier')
            .ilike('email', user.email)

        return NextResponse.json({
            success: true,
            debug: {
                user: {
                    id: user.id,
                    email: user.email,
                    subscription_tier: user.subscription_tier,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                subscriptions: subscriptions || [],
                similarUsers: allUsers || [],
                errors: {
                    userError,
                    subError,
                    allUsersError
                }
            }
        })
    } catch (error: any) {
        console.error('Debug subscription error:', error)
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
