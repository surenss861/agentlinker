import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, full_name, email, phone, message, source, listing_id } = body

    if (!user_id || !full_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Insert lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        user_id,
        client_name: full_name,
        client_email: email,
        client_phone: phone,
        message,
        listing_id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Get user email for notification
    const { data: agent } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    // TODO: Send email notification to agent
    // This would integrate with your email service (e.g., SendGrid, Resend)

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get leads for user
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

