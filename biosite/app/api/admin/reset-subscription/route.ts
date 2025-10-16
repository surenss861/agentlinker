import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    console.log('🔄 Resetting subscription for user:', userId)

    const supabase = await createServerSupabaseClient()

    // Reset user subscription tier to free
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        subscription_tier: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error resetting subscription:', updateError)
      return NextResponse.json({ 
        error: 'Failed to reset subscription', 
        details: updateError 
      }, { status: 500 })
    }

    console.log('✅ User subscription reset to free:', updatedUser)

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription reset to free',
      user: updatedUser
    })
  } catch (error: any) {
    console.error('❌ Reset subscription error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
