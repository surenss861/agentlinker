import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

/**
 * TEMPORARY MANUAL ACTIVATION ENDPOINT
 * Use this to manually activate Pro subscription if webhook failed
 * DELETE THIS FILE after fixing webhook setup
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔧 Manual activation for user:', user.id)

    // Update user to Pro tier
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        subscription_tier: 'pro',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (userError) {
      console.error('Error updating user:', userError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Create subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        tier: 'pro',
        status: 'active',
        amount_paid: 2000,
        currency: 'usd',
        billing_cycle: 'monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          manual_activation: true,
          activated_at: new Date().toISOString()
        }
      })

    if (subError) {
      console.error('Error creating subscription:', subError)
      // Don't fail if subscription record fails, user tier is already updated
    }

    console.log('✅ User manually activated to Pro')

    return NextResponse.json({ 
      success: true,
      message: 'Pro subscription activated successfully',
      tier: 'pro'
    })
  } catch (error: any) {
    console.error('Manual activation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

