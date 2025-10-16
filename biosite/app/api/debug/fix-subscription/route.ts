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

    // Update user subscription tier
    const { error } = await supabase
      .from('users')
      .update({
        subscription_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('❌ Error updating subscription:', error)
      return NextResponse.json({ error: 'Failed to update subscription', details: error }, { status: 500 })
    }

    console.log(`✅ Manual subscription update successful: User ${userId} upgraded to ${tier}`)
    return NextResponse.json({ 
      success: true, 
      message: `Subscription updated to ${tier}`,
      userId,
      tier
    })

  } catch (error: any) {
    console.error('Manual subscription update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
