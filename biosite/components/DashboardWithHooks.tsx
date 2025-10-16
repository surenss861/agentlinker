'use client'

import { useDashboardStats } from '@/lib/hooks/useDashboardStats'
import { useProgressGoals } from '@/lib/hooks/useProgressGoals'
import { useLeadsFeed } from '@/lib/hooks/useLeadsFeed'
import { useSubscriptionStatus } from '@/lib/hooks/useSubscriptionStatus'
import DashboardMetrics from './DashboardMetrics'
import ProgressRings from './ProgressRings'
import QuickActionButtons from './QuickActionButtons'
import CopyLinkButton from './CopyLinkButton'
import FadeInSection from './FadeInSection'
import { Calendar } from 'lucide-react'

interface DashboardWithHooksProps {
  userId: string
  agentSlug: string
}

export default function DashboardWithHooks({ userId, agentSlug }: DashboardWithHooksProps) {
  // Real-time data hooks
  const stats = useDashboardStats(userId)
  const { leads, loading: leadsLoading } = useLeadsFeed(userId)
  const subscription = useSubscriptionStatus(userId)
  
  // Calculate progress goals
  const progressGoals = useProgressGoals(stats)

  // Debug logging
  console.log('Dashboard stats:', stats)
  console.log('Dashboard leads:', leads)
  console.log('Dashboard subscription:', subscription)

  // Prepare stats for DashboardMetrics component
  const dashboardStats = [
    { name: 'Total Views', value: stats.views, iconName: 'Eye', growth: `${stats.growth.views >= 0 ? '+' : ''}${Math.round(stats.growth.views)}%` },
    { name: 'Showing Requests', value: stats.requests, iconName: 'Users', growth: `${stats.growth.requests >= 0 ? '+' : ''}${Math.round(stats.growth.requests)}%` },
    { name: 'Booked Showings', value: stats.bookings, iconName: 'Calendar', growth: `${stats.growth.bookings >= 0 ? '+' : ''}${Math.round(stats.growth.bookings)}%` },
    { name: 'Active Listings', value: stats.listings, iconName: 'BarChart3', growth: `${stats.growth.listings >= 0 ? '+' : ''}${Math.round(stats.growth.listings)}%` },
  ]

  // Calculate conversion trend
  const conversionTrend = stats.conversion > 0 ? 'up' : 'down'
  const conversionChange = Math.abs(stats.conversion).toFixed(1)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Smart Notifications Bar */}
      <FadeInSection delay={0.15}>
        <div className="mb-6">
          {stats.views > 10 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-blue-400 font-semibold">Your listing got {stats.views} views this week</p>
                  <p className="text-sm text-gray-300">Boost it on Instagram to get even more showing requests!</p>
                </div>
              </div>
            </div>
          )}
          {stats.requests === 0 && stats.views > 5 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-orange-400 font-semibold">You're getting views but no requests yet</p>
                  <p className="text-sm text-gray-300">Try adding more listings or updating your bio to convert better!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FadeInSection>

      {/* Dynamic Progress Rings */}
      <FadeInSection delay={0.1}>
        <ProgressRings 
          views={stats.views}
          requests={stats.requests}
          bookings={stats.bookings}
          listings={stats.listings}
        />
      </FadeInSection>

      {/* Premium Animated Metric Cards */}
      <DashboardMetrics stats={dashboardStats} />

      {/* Quick Actions */}
      <FadeInSection delay={0.2}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-[#F3C77E] to-[#912F40] rounded-full"></span>
            Quick Actions
          </h2>
          <QuickActionButtons agentSlug={agentSlug} />
        </div>
      </FadeInSection>

      {/* Recent Showing Requests */}
      <FadeInSection delay={0.3}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-b from-[#F3C77E] to-[#912F40] rounded-full"></span>
            Recent Showing Requests
          </h2>
          {leadsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F3C77E] mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading showing requests...</p>
            </div>
          ) : leads && leads.length > 0 ? (
            <div className="space-y-4">
              {leads.length === 1 && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 mb-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-green-400 font-semibold">Congrats on your first showing request!</p>
                      <p className="text-sm text-gray-300">This is just the beginning of your lead generation success!</p>
                    </div>
                  </div>
                </div>
              )}
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{lead.client_name}</h3>
                      <p className="text-gray-400 text-sm">{lead.client_email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        lead.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        lead.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'New'}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {lead.message && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        "{lead.message}"
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button className="bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                      Confirm
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <a
                  href="/dashboard/leads"
                  className="text-[#F3C77E] hover:text-[#FFD89C] underline font-medium transition-colors text-lg"
                >
                  View all showing requests →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#912F40]/20 to-[#702632]/20 flex items-center justify-center border border-[#912F40]/30 animate-pulse">
                <Calendar className="w-12 h-12 text-[#F3C77E]" />
              </div>
              <p className="text-white mb-2 text-xl font-semibold">No showing requests yet</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                Share your AgentLinker page on social media to start booking 5-10 clients monthly
              </p>
              <CopyLinkButton url={`https://www.agentlinker.ca/${agentSlug}`} />
            </div>
          )}
        </div>
      </FadeInSection>

      {/* Enhanced Subscription Status */}
      <FadeInSection delay={0.4}>
        <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-[#912F40] via-[#F3C77E]/40 to-[#702632] rounded-2xl p-8 text-center text-white border border-[#F3C77E]/20 shadow-[0_0_30px_rgba(243,199,126,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          {subscription.plan === 'pro' ? (
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">🎉</span>
                <h3 className="text-2xl font-bold">AgentLinker Pro</h3>
              </div>
              <p className="text-[#FFFFFA]/90 mb-4">$20/month - All features unlocked</p>
              <div className="flex justify-center gap-4">
                <a
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Billing
                </a>
                <a
                  href="/dashboard/analytics"
                  className="inline-flex items-center gap-2 bg-[#F3C77E] text-[#080705] hover:bg-[#FFD89C] px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(243,199,126,0.3)]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </a>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-bold">Get Started Today</h3>
              </div>
              <p className="font-bold text-lg mb-2">Unlock your full potential</p>
              <p className="text-sm text-[#FFFFFA]/80 mb-6">
                Get advanced analytics, unlimited bookings, and priority support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-2 bg-[#F3C77E] text-[#080705] hover:bg-[#FFD89C] px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(243,199,126,0.4)] hover:scale-105"
                >
                  Upgrade for $20/mo →
                </a>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-[#FFFFFA]/70">One extra deal pays for 6 months</p>
                  <p className="text-xs text-[#FFFFFA]/70">Cancel anytime</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FadeInSection>

      </div>
    </div>
  )
}
