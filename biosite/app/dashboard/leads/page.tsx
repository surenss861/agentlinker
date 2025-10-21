'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import LeadsManagerSimple from '@/components/LeadsManagerSimple'
import { useRealtimeLeads } from '@/lib/hooks/useRealtimeLeads'
import { useResponseTimeTracking } from '@/lib/utils/response-tracking'
import { useSimpleSubscription } from '@/lib/hooks/useSimpleSubscription'
import { Crown } from 'lucide-react'

export default function LeadsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { subscription, isPro } = useSimpleSubscription()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          console.error('Auth error:', authError)
          router.push('/login')
          return
        }

        setUserId(user.id)
      } catch (error) {
        console.error('Error in fetchUser:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, supabase])

  const { leads, stats, loading: leadsLoading, error } = useRealtimeLeads(userId)
  const { trackResponseTime } = useResponseTimeTracking()

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      // Find the lead to get its creation time
      const lead = leads.find(l => l.id === leadId)

      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId)

      if (error) {
        console.error('Error updating lead status:', error)
        alert(`Failed to update lead status: ${error.message}`)
        return
      }

      // Track response time if status changed to contacted
      if (lead && status === 'confirmed') {
        await trackResponseTime(leadId, lead.created_at, status, supabase)
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert(`Failed to update lead status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) {
        console.error('Error deleting lead:', error)
        alert(`Failed to delete lead: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert(`Failed to delete lead: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading leads...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Pro Check - No Upgrade Banner for Pro Users */}
        {!isPro && (
          <div className="mb-6 p-6 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs font-medium">
                      Free Plan
                    </span>
                    <span className="text-gray-400 text-sm">Preview Only</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Unlock Full Leads Management</h3>
                  <p className="text-gray-300 text-sm mt-1">Get real-time tracking, status updates, analytics, and conversion tools for $20/month</p>
                </div>
              </div>
              <a
                href="/dashboard/billing"
                className="px-6 py-3 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-lg font-semibold hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all shadow-lg"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Showing Requests</h1>
          <p className="text-gray-400 mt-2">
            🎯 Your communication and conversion hub • Goal: 5-10/month
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <LeadsManagerSimple
          leads={leads}
          stats={stats}
          loading={leadsLoading}
          onStatusChange={handleStatusChange}
          onDeleteLead={handleDeleteLead}
        />
      </main>

    </>
  )
}

