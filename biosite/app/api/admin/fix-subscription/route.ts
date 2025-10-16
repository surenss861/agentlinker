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

    // First, let's check the current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching user:', fetchError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Current user data:', currentUser)

    // Update user subscription tier
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
      console.error('Error updating subscription:', updateError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }

    console.log(`✅ User ${userId} subscription updated to ${tier}`)
    console.log('Updated user data:', updatedUser)

    return NextResponse.json({ 
      success: true, 
      message: `Subscription updated to ${tier}`,
      user: updatedUser
    })
  } catch (error: any) {
    console.error('Subscription fix error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
