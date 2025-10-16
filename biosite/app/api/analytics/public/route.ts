import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, event_type, source } = body

    if (!user_id || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use the anon client for public analytics (no auth required)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('analytics')
      .insert({
        user_id,
        event_type,
        source: source || 'unknown',
        value: 1,
      })

    if (error) {
      console.error('Analytics error:', error)
      // Don't throw - just log the error and continue
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    // Don't throw - just log the error and continue
    return NextResponse.json({ success: true })
  }
}
