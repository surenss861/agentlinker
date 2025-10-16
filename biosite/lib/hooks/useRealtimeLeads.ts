import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Lead {
  id: string
  user_id: string
  listing_id: string | null
  client_name: string
  client_email: string | null
  client_phone: string | null
  message: string | null
  status: 'new' | 'contacted' | 'scheduled' | 'closed' | 'lost'
  created_at: string
  updated_at: string
  source?: string
  follow_up_date?: string
  notes?: string
  response_time?: number // in hours
}

export type { Lead }

interface LeadStats {
  total: number
  thisMonth: number
  conversionRate: number
  averageResponseTime: number
  pipelineBreakdown: {
    new: number
    contacted: number
    scheduled: number
    closed: number
    lost: number
  }
  leadsBySource: Record<string, number>
  dailyLeads: { date: string; count: number }[]
}

export function useRealtimeLeads(userId: string) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    thisMonth: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    pipelineBreakdown: {
      new: 0,
      contacted: 0,
      scheduled: 0,
      closed: 0,
      lost: 0
    },
    leadsBySource: {},
    dailyLeads: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    const fetchLeads = async () => {
      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (leadsError) {
          console.error('Error fetching leads:', leadsError)
          setError(leadsError.message)
          return
        }

        setLeads(leadsData || [])
        
        // Calculate stats
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const thisMonthLeads = leadsData?.filter(lead => 
          new Date(lead.created_at) >= startOfMonth
        ) || []

        const totalLeads = leadsData?.length || 0
        const completedLeads = leadsData?.filter(lead => lead.status === 'completed').length || 0
        const conversionRate = totalLeads > 0 ? (completedLeads / totalLeads) * 100 : 0

        // Calculate average response time from actual data
        const respondedLeads = leadsData?.filter(lead => 
          lead.status === 'confirmed' || lead.status === 'completed'
        ) || []
        
        let averageResponseTime = 0
        if (respondedLeads.length > 0) {
          const totalResponseTime = respondedLeads.reduce((sum, lead) => {
            if (lead.response_time) {
              return sum + lead.response_time
            }
            // Calculate response time if not stored
            const created = new Date(lead.created_at)
            const updated = new Date(lead.updated_at)
            const responseTime = (updated.getTime() - created.getTime()) / (1000 * 60 * 60) // hours
            return sum + responseTime
          }, 0)
          averageResponseTime = totalResponseTime / respondedLeads.length
        }

        // Pipeline breakdown
        const pipelineBreakdown = {
          new: leadsData?.filter(lead => lead.status === 'pending').length || 0,
          contacted: leadsData?.filter(lead => lead.status === 'confirmed').length || 0,
          scheduled: leadsData?.filter(lead => lead.status === 'confirmed').length || 0,
          closed: leadsData?.filter(lead => lead.status === 'completed').length || 0,
          lost: leadsData?.filter(lead => lead.status === 'cancelled').length || 0
        }

        // Calculate leads by source
        const leadsBySource: Record<string, number> = {}
        leadsData?.forEach(lead => {
          const source = lead.source || 'direct'
          leadsBySource[source] = (leadsBySource[source] || 0) + 1
        })

        // Calculate daily leads for last 30 days
        const dailyLeadsMap: Record<string, number> = {}
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - i)
          return d.toISOString().split('T')[0]
        }).reverse()

        // Initialize all days to 0
        last30Days.forEach(date => {
          dailyLeadsMap[date] = 0
        })

        // Count leads per day
        leadsData?.forEach(lead => {
          const date = new Date(lead.created_at).toISOString().split('T')[0]
          if (dailyLeadsMap.hasOwnProperty(date)) {
            dailyLeadsMap[date]++
          }
        })

        const dailyLeads = Object.entries(dailyLeadsMap).map(([date, count]) => ({
          date,
          count
        }))

        setStats({
          total: totalLeads,
          thisMonth: thisMonthLeads.length,
          conversionRate,
          averageResponseTime,
          pipelineBreakdown,
          leadsBySource,
          dailyLeads
        })

      } catch (err) {
        console.error('Error in fetchLeads:', err)
        setError('Failed to fetch leads')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

          // Set up real-time subscription
          const channel = supabase
            .channel('realtime-leads')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'leads',
                filter: `user_id=eq.${userId}`
              },
              (payload) => {
                try {
                  console.log('Leads change received:', payload)
                  
                  if (payload.eventType === 'INSERT') {
                    const newLead = payload.new as Lead
                    setLeads(prev => [newLead, ...prev])
                    
                    // Update stats
                    setStats(prev => ({
                      ...prev,
                      total: prev.total + 1,
                      thisMonth: prev.thisMonth + 1,
                      pipelineBreakdown: {
                        ...prev.pipelineBreakdown,
                        new: prev.pipelineBreakdown.new + 1
                      }
                    }))
                  } else if (payload.eventType === 'UPDATE') {
                    const updatedLead = payload.new as Lead
                    const oldLead = payload.old as Lead
                    
                    setLeads(prev => 
                      prev.map(lead => 
                        lead.id === updatedLead.id ? updatedLead : lead
                      )
                    )

                    // Update pipeline breakdown if status changed
                    if (oldLead.status !== updatedLead.status) {
                      setStats(prev => ({
                        ...prev,
                        pipelineBreakdown: {
                          ...prev.pipelineBreakdown,
                          [oldLead.status]: Math.max(0, prev.pipelineBreakdown[oldLead.status as keyof typeof prev.pipelineBreakdown] - 1),
                          [updatedLead.status]: prev.pipelineBreakdown[updatedLead.status as keyof typeof prev.pipelineBreakdown] + 1
                        }
                      }))
                    }
                  } else if (payload.eventType === 'DELETE') {
                    const deletedLead = payload.old as Lead
                    setLeads(prev => 
                      prev.filter(lead => lead.id !== deletedLead.id)
                    )

                    // Update stats
                    setStats(prev => ({
                      ...prev,
                      total: Math.max(0, prev.total - 1),
                      thisMonth: Math.max(0, prev.thisMonth - 1),
                      pipelineBreakdown: {
                        ...prev.pipelineBreakdown,
                        [deletedLead.status]: Math.max(0, prev.pipelineBreakdown[deletedLead.status as keyof typeof prev.pipelineBreakdown] - 1)
                      }
                    }))
                  }
                } catch (error) {
                  console.error('Error processing real-time leads update:', error)
                }
              }
            )
            .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return {
    leads,
    stats,
    loading,
    error,
    refetch: () => window.location.reload() // Simple refetch for now
  }
}
