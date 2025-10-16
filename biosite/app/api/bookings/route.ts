import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const {
      user_id,
      lead_id,
      listing_id,
      client_name,
      client_email,
      client_phone,
      scheduled_at,
      duration,
      status,
      location,
      notes
    } = body

    // Validate required fields
    if (!user_id || !client_name || !client_email || !scheduled_at) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id,
        lead_id,
        listing_id,
        client_name,
        client_email,
        client_phone,
        scheduled_at,
        duration: duration || 30,
        status: status || 'pending',
        location,
        notes
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking', details: error.message },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email to client and agent

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    // Check if it's a public availability query (by agent ID)
    const userId = searchParams.get('user_id')
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    if (userId && startDate && endDate) {
      // Public query - fetch bookings for availability calendar (no auth required)
      const { data, error } = await supabase
        .from('bookings')
        .select('id, scheduled_at, duration, status')
        .eq('user_id', userId)
        .gte('scheduled_at', startDate)
        .lte('scheduled_at', endDate)
        .in('status', ['pending', 'confirmed'])

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch bookings' },
          { status: 500 }
        )
      }

      return NextResponse.json({ bookings: data }, { status: 200 })
    }

    // Authenticated query - fetch all bookings for the logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listings:listing_id (
          id,
          title,
          address,
          city,
          state,
          images
        ),
        leads:lead_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

