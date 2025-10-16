'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import LeadsManagerSimple from '@/components/LeadsManagerSimple'
import { useRealtimeLeads } from '@/lib/hooks/useRealtimeLeads'
import { useResponseTimeTracking } from '@/lib/utils/response-tracking'
import { useSubscription } from '@/lib/hooks/useSubscription'
import ProSoftwall, { UpgradeModal } from '@/components/ProSoftwall'
import { Crown } from 'lucide-react'

export default function LeadsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isProUser, setIsProUser] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { subscription, hasFeature, getUpgradeText } = useSubscription()

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

        // Check if user is Pro (mock for now)
        setIsProUser(true) // TODO: Check actual subscription status
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
      <div className="min-h-screen bg-gradient-to-b from-[#080705] to-[#1A0E10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F3C77E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading leads...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080705] to-[#1A0E10]">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        {subscription && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.tier === 'free' 
                    ? 'bg-gray-600 text-gray-300' 
                    : subscription.tier === 'pro'
                    ? 'bg-[#912F40] text-white'
                    : 'bg-[#F3C77E] text-black'
                }`}>
                  {subscription.tier === 'free' ? 'Free Plan' : 
                   subscription.tier === 'pro' ? 'Pro Plan' : 'Business Plan'}
                  {subscription.tier !== 'free' && <Crown className="w-4 h-4 inline ml-1" />}
                </div>
                <span className="text-gray-400">
                  {subscription.tier === 'free' 
                    ? 'Leads preview only - upgrade for full access'
                    : 'Full leads management enabled'
                  }
                </span>
              </div>
              {subscription.tier === 'free' && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-lg font-medium hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all"
                >
                  Upgrade Now
                </button>
              )}
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

        {/* Upgrade Banner for Free Users */}
        {subscription?.tier === 'free' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Unlock Full Leads Management</h3>
                  <p className="text-gray-300 text-sm">Get real-time tracking, advanced analytics, and conversion tools</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-[#F3C77E] to-[#912F40] text-white rounded-lg font-medium hover:from-[#F3C77E]/80 hover:to-[#912F40]/80 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
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

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Leads Management"
        description="Get full leads management, real-time tracking, status updates, and advanced conversion tools to grow your real estate business."
        requiredTier="pro"
      />
    </div>
  )
}

