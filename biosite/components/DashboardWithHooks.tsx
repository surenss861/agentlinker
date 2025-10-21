'use client'

import { useDashboardStats } from '@/lib/hooks/useDashboardStats'
import { useLeadsFeed } from '@/lib/hooks/useLeadsFeed'
import { useSubscription } from '@/lib/hooks/useSubscription'
import CopyLinkButton from './CopyLinkButton'
import { Calendar, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'

interface DashboardWithHooksProps {
  userId: string
  agentSlug: string
}

export default function DashboardWithHooks({ userId, agentSlug }: DashboardWithHooksProps) {
  // Real-time data hooks
  const stats = useDashboardStats(userId)
  const { leads, loading: leadsLoading } = useLeadsFeed(userId)
  const { subscription } = useSubscription()

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header - Demo Style */}
        <div className="bg-gray-800/50 p-6 border-b border-gray-700 rounded-t-2xl mb-0">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Dashboard</h1>
              <p className="text-gray-400">Welcome back! Here's your overview</p>
            </div>
            <div className="flex items-center gap-3">
              {subscription?.tier === 'pro' && (
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Pro Plan Active
                </div>
              )}
              <Link
                href={`/${agentSlug}`}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                target="_blank"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-b-2xl border-x border-b border-red-900/30 p-6">
          {/* Stats Cards - Demo Style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Leads</p>
                  <p className="text-3xl font-bold text-white">{stats.requests}</p>
                  <p className={`text-xs ${stats.growth.requests >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.growth.requests >= 0 ? '+' : ''}{Math.round(stats.growth.requests)}% this month
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Listings</p>
                  <p className="text-3xl font-bold text-white">{stats.listings}</p>
                  <p className={`text-xs ${stats.growth.listings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.growth.listings >= 0 ? '+' : ''}{Math.round(stats.growth.listings)}% this month
                  </p>
                </div>
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.bookings}</p>
                  <p className={`text-xs ${stats.growth.bookings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.growth.bookings >= 0 ? '+' : ''}{Math.round(stats.growth.bookings)}% this month
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-3xl font-bold text-white">{stats.views}</p>
                  <p className={`text-xs ${stats.growth.views >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.growth.views >= 0 ? '+' : ''}{Math.round(stats.growth.views)}% this month
                  </p>
                </div>
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content - Demo Style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Leads */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Leads</h3>
                <span className="text-xs text-gray-400">Last 7 days</span>
              </div>
              {leadsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-[#F3C77E] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 text-sm mt-2">Loading...</p>
                </div>
              ) : leads && leads.length > 0 ? (
                <div className="space-y-3">
                  {leads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {lead.client_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{lead.client_name}</p>
                          <p className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${lead.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        lead.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        lead.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                        {lead.status}
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/leads" className="w-full text-center text-sm text-gray-400 hover:text-white py-2 block">
                    View All Leads →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No leads yet</p>
                  <Link href="/dashboard/listings" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                    Add listings to get started
                  </Link>
                </div>
              )}
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Upcoming Bookings</h3>
                <span className="text-xs text-gray-400">Next 7 days</span>
              </div>
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming bookings</p>
                <Link href="/dashboard/bookings" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                  View all bookings
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/listings"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Listing
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors block text-center"
                >
                  📊 View Analytics
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors block text-center"
                >
                  ⚙️ Account Settings
                </Link>
                <div className="pt-2">
                  <p className="text-gray-400 text-xs mb-2">Share your profile:</p>
                  <CopyLinkButton url={`https://www.agentlinker.ca/${agentSlug}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Page Views</span>
                <span className="text-white font-bold">{stats.views}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats.views / 100) * 100, 100)}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Lead Forms</span>
                <span className="text-white font-bold">{stats.requests}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min((stats.requests / 50) * 100, 100)}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bookings</span>
                <span className="text-white font-bold">{stats.bookings}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((stats.bookings / 20) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
