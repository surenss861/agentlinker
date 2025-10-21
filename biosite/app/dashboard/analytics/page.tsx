'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import { Eye, Users, Calendar, MousePointer, TrendingUp, ArrowUp, ArrowDown, Lock, Crown } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSimpleSubscription } from '@/lib/hooks/useSimpleSubscription'
import ProSoftwall, { UpgradeModal } from '@/components/ProSoftwall'

interface AnalyticsData {
  metrics: {
    pageViews: number
    linkClicks: number
    listingViews: number
    bookingClicks: number
    leadForms: number
    totalLeads: number
    totalBookings: number
    conversionRate: number
    bookingConversionRate: number
  }
  trafficSources: Record<string, number>
  dailyTrends: Array<{ date: string; views: number; leads: number; bookings: number }>
  topListings: Array<{ listing_id: string; views: number; leads: number; bookings: number }>
  recentEvents: any[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { hasFeature, isPro } = useSimpleSubscription()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        router.push('/onboarding')
        return
      }

      setUser(user)
      setUserProfile(profile)

      // Fetch analytics
      const response = await fetch(`/api/analytics?days=${days}`)
      const data = await response.json()

      if (response.ok) {
        setAnalytics(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [router, supabase, days])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <>
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">Failed to load analytics</div>
        </div>
      </>
    )
  }

  const { metrics, trafficSources, dailyTrends, topListings, recentEvents } = analytics

  // Limit data for free users
  const maxDataPointsForFree = 7
  const displayDailyTrends = hasFeature('analytics')
    ? dailyTrends
    : dailyTrends.slice(0, maxDataPointsForFree)
  const displayTopListings = hasFeature('analytics')
    ? topListings
    : topListings.slice(0, 3)
  const displayRecentEvents = hasFeature('analytics')
    ? recentEvents
    : recentEvents.slice(0, 5)

  const COLORS = ['#F3C77E', '#912F40', '#4A90E2', '#50E3C2', '#F5A623', '#BD10E0']

  const trafficData = Object.entries(trafficSources).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  return (
    <>
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Status */}
        {subscription && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.tier === 'free'
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
                    ? 'Analytics preview only - upgrade for full access'
                    : 'Full analytics access enabled'
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

        {/* Upgrade Banner for Free Users */}
        {subscription?.tier === 'free' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F3C77E] to-[#912F40] rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Unlock Advanced Analytics</h3>
                  <p className="text-gray-300 text-sm">Get detailed conversion tracking, traffic analysis, and ROI insights</p>
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📊 Analytics & ROI</h1>
            <p className="text-gray-400 mt-2">Track your conversion from views to bookings</p>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map(d => (
              <button
                key={d}
                onClick={() => {
                  if (!hasFeature('analytics')) {
                    alert('Upgrade to Pro to change time periods')
                    return
                  }
                  setDays(d)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${days === d
                  ? hasFeature('analytics')
                    ? 'bg-[#F3C77E] text-[#080705]'
                    : 'bg-gray-500/20 text-gray-500'
                  : hasFeature('analytics')
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!hasFeature('analytics')}
              >
                {hasFeature('analytics') ? `${d} Days` : `🔒 ${d} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-gradient-to-r from-[#912F40] to-[#702632] text-white rounded-2xl p-8 mb-8 shadow-[0_0_30px_rgba(145,47,64,0.3)] border border-white/10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-b from-[#F3C77E] to-[#FFFFFA] rounded-full"></span>
            Your Conversion Funnel
          </h3>
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{metrics.pageViews}</div>
              <div className="text-sm text-[#FFFFFA]/75 mb-3">Page Views</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-[#F3C77E] h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{metrics.totalLeads}</div>
              <div className="text-sm text-[#FFFFFA]/75 mb-3">Lead Requests</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-[#F3C77E] h-2 rounded-full"
                  style={{ width: metrics.pageViews > 0 ? `${(metrics.totalLeads / metrics.pageViews) * 100}%` : '0%' }}>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{metrics.totalBookings}</div>
              <div className="text-sm text-[#FFFFFA]/75 mb-3">Bookings</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-[#F3C77E] h-2 rounded-full"
                  style={{ width: metrics.pageViews > 0 ? `${(metrics.totalBookings / metrics.pageViews) * 100}%` : '0%' }}>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{metrics.conversionRate.toFixed(1)}%</div>
              <div className="text-sm text-[#FFFFFA]/75 mb-3">Conversion Rate</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-[#F3C77E] h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.conversionRate * 10, 100)}%` }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { name: 'Page Views', value: metrics.pageViews, icon: Eye, color: 'text-blue-400' },
            { name: 'Link Clicks', value: metrics.linkClicks, icon: MousePointer, color: 'text-purple-400' },
            { name: 'Listing Views', value: metrics.listingViews, icon: TrendingUp, color: 'text-orange-400' },
            { name: 'Lead Forms', value: metrics.leadForms, icon: Users, color: 'text-green-400' },
            { name: 'Bookings', value: metrics.totalBookings, icon: Calendar, color: 'text-teal-400' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="group bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex flex-col items-center">
                  <Icon className={`h-6 w-6 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400 text-center">{stat.name}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Trends */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F3C77E]" />
              Daily Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={displayDailyTrends}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F3C77E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F3C77E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Legend />
                <Area type="monotone" dataKey="views" stroke="#F3C77E" fillOpacity={1} fill="url(#colorViews)" name="Views" />
                <Area type="monotone" dataKey="leads" stroke="#4A90E2" fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-[#F3C77E]" />
              Traffic Sources
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F3C77E]" />
            Recent Activity
          </h3>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="space-y-2">
              {displayRecentEvents.map((event) => {
                const eventIcons: Record<string, any> = {
                  page_view: Eye,
                  link_click: MousePointer,
                  lead_form: Users,
                  listing_view: TrendingUp,
                  booking_click: Calendar,
                }
                const Icon = eventIcons[event.event_type] || Eye

                return (
                  <div key={event.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300 flex-1">
                      {event.event_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleDateString()} at {new Date(event.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No activity yet. Share your AgentLinker page to start tracking!</p>
          )}
        </div>

        {/* Free user data limit message */}
        {!hasFeature('analytics') && (dailyTrends.length > maxDataPointsForFree || topListings.length > 3 || recentEvents.length > 5) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#F3C77E]" />
              <div>
                <h3 className="text-white font-semibold">Limited data preview</h3>
                <p className="text-gray-300 text-sm">Upgrade to Pro to see full analytics with unlimited data points and advanced insights</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Advanced Analytics"
        description="Get detailed conversion tracking, traffic analysis, ROI insights, and performance metrics to optimize your real estate business."
        requiredTier="pro"
      />
    </>
  )
}
