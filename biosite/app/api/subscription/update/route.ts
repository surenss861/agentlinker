import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, tier } = await request.json()

    if (!userId || !tier) {
      return NextResponse.json({ error: 'Missing userId or tier' }, { status: 400 })
    }

    if (!['free', 'pro', 'business'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const supabase = createClient()

    // Update user subscription tier
    const { error } = await supabase
      .from('users')
      .update({ 
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating subscription:', error)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    console.log(`✅ User ${userId} subscription updated to ${tier}`)

    return NextResponse.json({ 
      success: true, 
      message: `Subscription updated to ${tier}` 
    })
  } catch (error: any) {
    console.error('Subscription update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
