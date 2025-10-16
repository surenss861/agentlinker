'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Booking {
  id: string
  user_id: string
  lead_id?: string
  listing_id?: string
  scheduled_at: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  client_name: string
  client_email: string
  client_phone?: string
  location?: string
  notes?: string
  created_at: string
  updated_at: string
  listings?: {
    id: string
    title: string
    address: string
    city: string
    state: string
    images?: string[]
  }
  leads?: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export interface BookingStats {
  total: number
  upcoming: number
  past: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  thisMonth: number
  avgLeadToBookingTime: number
  statusBreakdown: {
    pending: number
    confirmed: number
    completed: number
    cancelled: number
  }
}

export function useRealtimeBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    upcoming: 0,
    past: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    thisMonth: 0,
    avgLeadToBookingTime: 0,
    statusBreakdown: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: bookingsData, error: fetchError } = await supabase
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
          .eq('user_id', userId)
          .order('scheduled_at', { ascending: false })

        if (fetchError) {
          console.error('Error fetching bookings:', fetchError)
          setError(fetchError.message)
          setLoading(false)
          return
        }

        setBookings(bookingsData || [])

        // Calculate stats
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const total = bookingsData?.length || 0
        const upcoming = bookingsData?.filter(b => 
          new Date(b.scheduled_at) >= now && ['pending', 'confirmed'].includes(b.status)
        ).length || 0
        const past = bookingsData?.filter(b => 
          new Date(b.scheduled_at) < now || ['completed', 'cancelled'].includes(b.status)
        ).length || 0
        const thisMonth = bookingsData?.filter(b => 
          new Date(b.created_at) >= startOfMonth
        ).length || 0

        const statusBreakdown = {
          pending: bookingsData?.filter(b => b.status === 'pending').length || 0,
          confirmed: bookingsData?.filter(b => b.status === 'confirmed').length || 0,
          completed: bookingsData?.filter(b => b.status === 'completed').length || 0,
          cancelled: bookingsData?.filter(b => b.status === 'cancelled').length || 0
        }

        // Calculate average lead to booking time
        let avgLeadToBookingTime = 0
        const bookingsWithLeads = bookingsData?.filter(b => b.lead_id && b.leads) || []
        if (bookingsWithLeads.length > 0) {
          const totalTime = bookingsWithLeads.reduce((sum, booking) => {
            // We'd need to fetch lead created_at separately, so skip for now
            return sum
          }, 0)
          avgLeadToBookingTime = totalTime / bookingsWithLeads.length
        }

        setStats({
          total,
          upcoming,
          past,
          pending: statusBreakdown.pending,
          confirmed: statusBreakdown.confirmed,
          completed: statusBreakdown.completed,
          cancelled: statusBreakdown.cancelled,
          thisMonth,
          avgLeadToBookingTime,
          statusBreakdown
        })

        setLoading(false)
      } catch (err) {
        console.error('Unexpected error fetching bookings:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchBookings()

    // Set up real-time subscription
    const channel = supabase
      .channel('realtime-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          try {
            console.log('Bookings change received:', payload)

            if (payload.eventType === 'INSERT') {
              const newBooking = payload.new as Booking
              setBookings(prev => [newBooking, ...prev])

              // Update stats
              setStats(prev => {
                const currentStatusCount = typeof prev[newBooking.status as keyof BookingStats] === 'number'
                  ? (prev[newBooking.status as keyof BookingStats] as number)
                  : 0
                  
                return {
                  ...prev,
                  total: prev.total + 1,
                  thisMonth: prev.thisMonth + 1,
                  [newBooking.status]: currentStatusCount + 1,
                  statusBreakdown: {
                    ...prev.statusBreakdown,
                    [newBooking.status]: prev.statusBreakdown[newBooking.status] + 1
                  }
                }
              })
            } else if (payload.eventType === 'UPDATE') {
              const updatedBooking = payload.new as Booking
              const oldBooking = payload.old as Booking

              setBookings(prev =>
                prev.map(booking =>
                  booking.id === updatedBooking.id ? updatedBooking : booking
                )
              )

              // Update status breakdown if status changed
              if (oldBooking.status !== updatedBooking.status) {
                setStats(prev => ({
                  ...prev,
                  statusBreakdown: {
                    ...prev.statusBreakdown,
                    [oldBooking.status]: Math.max(0, prev.statusBreakdown[oldBooking.status] - 1),
                    [updatedBooking.status]: prev.statusBreakdown[updatedBooking.status] + 1
                  }
                }))
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedBooking = payload.old as Booking
              setBookings(prev =>
                prev.filter(booking => booking.id !== deletedBooking.id)
              )

              // Update stats
              setStats(prev => ({
                ...prev,
                total: Math.max(0, prev.total - 1),
                statusBreakdown: {
                  ...prev.statusBreakdown,
                  [deletedBooking.status]: Math.max(0, prev.statusBreakdown[deletedBooking.status] - 1)
                }
              }))
            }
          } catch (error) {
            console.error('Error processing real-time bookings update:', error)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return { bookings, stats, loading, error }
}

