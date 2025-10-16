import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (you can customize this logic)
    const { data: userProfile } = await supabase
      .from('users')
      .select('email')
      .eq('id', user.id)
      .single()

    // For now, allow any authenticated user to trigger (for testing)
    // In production, you'd check for admin privileges
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Call the Supabase Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/weekly-performance`
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ trigger: 'manual', triggered_by: user.id })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Edge function failed: ${errorText}`)
    }

    const result = await response.json()

    // Log the manual trigger
    await supabase
      .from('analytics')
      .insert({
        user_id: user.id,
        event_type: 'weekly_email_manual_trigger',
        source: 'admin_panel',
        value: 1
      })

    return NextResponse.json({ 
      success: true, 
      message: 'Weekly performance emails triggered successfully',
      result 
    })

  } catch (error) {
    console.error('Error triggering weekly emails:', error)
    return NextResponse.json(
      { error: 'Failed to trigger weekly emails' },
      { status: 500 }
    )
  }
}
