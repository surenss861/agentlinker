import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const { userId, tier } = await request.json()

        if (!userId || !tier) {
            return NextResponse.json({ error: 'Missing userId or tier' }, { status: 400 })
        }

    console.log(`🔧 Manual subscription update: User ${userId} to ${tier}`)

    const supabase = await createServerSupabaseClient()

    // First, create a subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        tier: tier,
        status: 'active',
        amount_paid: tier === 'pro' ? 2000 : 2500, // $20 for pro, $25 for business
        currency: 'usd',
        billing_cycle: tier === 'pro' ? 'monthly' : 'one_time',
        current_period_start: new Date().toISOString(),
        current_period_end: tier === 'pro' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
          : new Date().toISOString(),
        metadata: {
          manual_fix: true,
          fixed_at: new Date().toISOString(),
          fixed_by: 'debug_endpoint'
        }
      })

    if (subscriptionError) {
      console.error('❌ Error creating subscription record:', subscriptionError)
      return NextResponse.json({ 
        error: 'Failed to create subscription record', 
        details: subscriptionError 
      }, { status: 500 })
    }

    console.log(`✅ Subscription record created for user ${userId} (${tier} plan)`)
    return NextResponse.json({ 
      success: true, 
      message: `Subscription record created and user updated to ${tier}`,
      userId,
      tier
    })

    } catch (error: any) {
        console.error('Manual subscription update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
