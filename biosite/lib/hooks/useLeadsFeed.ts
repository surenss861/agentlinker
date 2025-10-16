'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Lead {
  id: string
  user_id: string
  listing_id?: string
  client_name: string
  client_email: string
  client_phone?: string
  message?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
}

export function useLeadsFeed(userId: string) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error fetching leads:', error)
          return
        }

        setLeads(data || [])
      } catch (error) {
        console.error('Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

    // Set up real-time subscription for leads
    const channel = supabase
      .channel('realtime:leads')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('Lead change received:', payload)
          fetchLeads()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { leads, loading }
}
