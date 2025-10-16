'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface DashboardStats {
  views: number
  requests: number
  bookings: number
  listings: number
  conversion: number
  growth: {
    views: number
    requests: number
    bookings: number
    listings: number
  }
}

export function useDashboardStats(userId: string) {
  const [stats, setStats] = useState<DashboardStats>({
    views: 0,
    requests: 0,
    bookings: 0,
    listings: 0,
    conversion: 0,
    growth: { views: 0, requests: 0, bookings: 0, listings: 0 }
  })

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const fetchStats = async () => {
      try {
        // Get current week's data
        const currentWeek = new Date()
        currentWeek.setDate(currentWeek.getDate() - 7)

        // Get last week's data for comparison
        const lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 14)

        // Fetch views (analytics events)
        const { data: currentViews } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', userId)
          .eq('event_type', 'view')
          .gte('created_at', currentWeek.toISOString())

        const { data: lastWeekViews } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', userId)
          .eq('event_type', 'view')
          .gte('created_at', lastWeek.toISOString())
          .lt('created_at', currentWeek.toISOString())

        // Fetch leads (showing requests)
        const { data: currentRequests } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', currentWeek.toISOString())

        const { data: lastWeekRequests } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', lastWeek.toISOString())
          .lt('created_at', currentWeek.toISOString())

        // Fetch bookings
        const { data: currentBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', currentWeek.toISOString())

        const { data: lastWeekBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', lastWeek.toISOString())
          .lt('created_at', currentWeek.toISOString())

        // Fetch listings
        const { count: listingsCount } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'active')

        // Calculate growth percentages
        const viewsGrowth = calculateGrowth(currentViews?.length || 0, lastWeekViews?.length || 0)
        const requestsGrowth = calculateGrowth(currentRequests?.length || 0, lastWeekRequests?.length || 0)
        const bookingsGrowth = calculateGrowth(currentBookings?.length || 0, lastWeekBookings?.length || 0)
        const listingsGrowth = 5 // Static for now since listings don't have weekly data

        // Calculate conversion rate
        const totalViews = currentViews?.length || 0
        const totalRequests = currentRequests?.length || 0
        const conversion = totalViews > 0 ? (totalRequests / totalViews) * 100 : 0

        setStats({
          views: totalViews,
          requests: totalRequests,
          bookings: currentBookings?.length || 0,
          listings: listingsCount || 0,
          conversion,
          growth: {
            views: viewsGrowth,
            requests: requestsGrowth,
            bookings: bookingsGrowth,
            listings: listingsGrowth
          }
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }

    fetchStats()

    // Set up real-time subscriptions
    const channel = supabase
      .channel('realtime:dashboard')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'analytics' }, 
        fetchStats
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        fetchStats
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        fetchStats
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'listings' }, 
        fetchStats
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return stats
}

function calculateGrowth(current: number, lastWeek: number): number {
  if (lastWeek === 0) return current > 0 ? 100 : 0
  return ((current - lastWeek) / lastWeek) * 100
}
