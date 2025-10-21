'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import NavBar from '@/components/NavBar'
import BookingsManager from '@/components/BookingsManager'
import { useRealtimeBookings } from '@/lib/hooks/useRealtimeBookings'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { Crown } from 'lucide-react'

export default function BookingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { subscription } = useSubscription()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!userProfile) {
        router.push('/onboarding')
        return
      }

      setUserId(user.id)
      setLoading(false)
    }

    fetchUser()
  }, [router, supabase])

  const { bookings, stats, loading: bookingsLoading, error } = useRealtimeBookings(userId!)

  const handleStatusChange = async (bookingId: string, status: string) => {
    console.log('🔄 Updating booking status:', { bookingId, status })
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)

      if (error) {
        console.error('❌ Error updating booking status:', error)
        alert(`Failed to update booking: ${error.message}`)
      } else {
        console.log('✅ Booking status updated successfully')
      }
    } catch (error) {
      console.error('❌ Error updating booking:', error)
      alert(`Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    console.log('🗑️ Deleting booking:', bookingId)
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) {
        console.error('❌ Error deleting booking:', error)
        alert(`Failed to delete booking: ${error.message}`)
      } else {
        console.log('✅ Booking deleted successfully')
      }
    } catch (error) {
      console.error('❌ Error deleting booking:', error)
      alert(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white">Loading bookings...</div>
        </div>
      </div>
    )
  }

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
                    ? 'Basic booking management - upgrade for advanced features'
                    : 'Full booking scheduler with advanced features'
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

        {/* Single Consolidated Upgrade Banner */}
        {subscription?.tier === 'free' && (
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
                  <h3 className="text-white font-semibold text-lg">Unlock Advanced Booking Scheduler</h3>
                  <p className="text-gray-300 text-sm mt-1">Get real-time scheduling, availability calendar, automated confirmations, and email notifications for $50/month</p>
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

        <BookingsManager
          bookings={bookings}
          stats={stats}
          loading={bookingsLoading}
          onStatusChange={handleStatusChange}
          onDeleteBooking={handleDeleteBooking}
        />
      </main>

    </>
  )
}
