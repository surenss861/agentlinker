import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const { userId, tier } = await request.json()

        if (!userId || !tier) {
            return NextResponse.json({ error: 'Missing userId or tier' }, { status: 400 })
        }

        console.log('🧪 Testing webhook simulation for user:', userId, 'tier:', tier)

        const supabase = await createServerSupabaseClient()

        // Simulate the webhook logic
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (fetchError) {
            console.error('❌ Error fetching user:', fetchError)
            return NextResponse.json({ error: 'User not found', details: fetchError }, { status: 404 })
        }

        console.log('👤 Current user:', currentUser)

        // Update user subscription tier (same as webhook)
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                subscription_tier: tier,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single()

        if (updateError) {
            console.error('❌ Error updating subscription:', updateError)
            return NextResponse.json({
                error: 'Failed to update subscription',
                details: updateError
            }, { status: 500 })
        }

        console.log('✅ Webhook simulation successful:', updatedUser)

        return NextResponse.json({
            success: true,
            message: 'Webhook simulation successful',
            user: updatedUser
        })
    } catch (error: any) {
        console.error('❌ Webhook test error:', error)
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
