import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Get date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch analytics events
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (eventsError) {
      console.error('Error fetching analytics events:', eventsError)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, created_at, source, listing_id')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())

    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
    }

    // Fetch bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, created_at, status, listing_id')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
    }

    // Calculate metrics
    const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0
    const linkClicks = events?.filter(e => e.event_type === 'link_click').length || 0
    const listingViews = events?.filter(e => e.event_type === 'listing_view').length || 0
    const bookingClicks = events?.filter(e => e.event_type === 'booking_click').length || 0
    const leadForms = events?.filter(e => e.event_type === 'lead_form').length || 0

    const totalLeads = leads?.length || 0
    const totalBookings = bookings?.length || 0

    const conversionRate = pageViews > 0 
      ? ((totalLeads / pageViews) * 100).toFixed(1)
      : '0.0'

    const bookingConversionRate = totalLeads > 0
      ? ((totalBookings / totalLeads) * 100).toFixed(1)
      : '0.0'

    // Calculate traffic by source
    const trafficSources: Record<string, number> = {}
    events?.forEach(event => {
      if (event.metadata?.utm_source) {
        const source = event.metadata.utm_source as string
        trafficSources[source] = (trafficSources[source] || 0) + 1
      } else if (event.referrer) {
        const source = new URL(event.referrer).hostname
        trafficSources[source] = (trafficSources[source] || 0) + 1
      } else {
        trafficSources['direct'] = (trafficSources['direct'] || 0) + 1
      }
    })

    // Calculate daily trends (last 30 days)
    const dailyStats: Record<string, { date: string; views: number; leads: number; bookings: number }> = {}
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyStats[dateStr] = { date: dateStr, views: 0, leads: 0, bookings: 0 }
    }

    events?.forEach(event => {
      const dateStr = new Date(event.created_at).toISOString().split('T')[0]
      if (dailyStats[dateStr] && event.event_type === 'page_view') {
        dailyStats[dateStr].views++
      }
    })

    leads?.forEach(lead => {
      const dateStr = new Date(lead.created_at).toISOString().split('T')[0]
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].leads++
      }
    })

    bookings?.forEach(booking => {
      const dateStr = new Date(booking.created_at).toISOString().split('T')[0]
      if (dailyStats[dateStr]) {
        dailyStats[dateStr].bookings++
      }
    })

    const dailyTrends = Object.values(dailyStats).reverse()

    // Get top listings
    const listingPerformance: Record<string, { listing_id: string; views: number; leads: number; bookings: number }> = {}
    
    events?.forEach(event => {
      if (event.listing_id) {
        if (!listingPerformance[event.listing_id]) {
          listingPerformance[event.listing_id] = {
            listing_id: event.listing_id,
            views: 0,
            leads: 0,
            bookings: 0
          }
        }
        if (event.event_type === 'listing_view') {
          listingPerformance[event.listing_id].views++
        }
      }
    })

    leads?.forEach(lead => {
      if (lead.listing_id && listingPerformance[lead.listing_id]) {
        listingPerformance[lead.listing_id].leads++
      }
    })

    bookings?.forEach(booking => {
      if (booking.listing_id && listingPerformance[booking.listing_id]) {
        listingPerformance[booking.listing_id].bookings++
      }
    })

    const topListings = Object.values(listingPerformance)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    // Return comprehensive metrics
    return NextResponse.json({
      metrics: {
        pageViews,
        linkClicks,
        listingViews,
        bookingClicks,
        leadForms,
        totalLeads,
        totalBookings,
        conversionRate: parseFloat(conversionRate),
        bookingConversionRate: parseFloat(bookingConversionRate)
      },
      trafficSources,
      dailyTrends,
      topListings,
      recentEvents: events?.slice(0, 20) || []
    })
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for tracking events
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const {
      user_id,
      event_type,
      listing_id,
      lead_id,
      booking_id,
      metadata,
      ip_address,
      user_agent,
      referrer
    } = body

    // Validate required fields
    if (!user_id || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, event_type' },
        { status: 400 }
      )
    }

    // Insert analytics event
    const { data, error } = await supabase
      .from('analytics_events')
      .insert({
        user_id,
        event_type,
        listing_id,
        lead_id,
        booking_id,
        metadata: metadata || {},
        ip_address,
        user_agent,
        referrer
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
