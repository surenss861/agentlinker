'use client'

import { useState } from 'react'
import { Calendar, Clock, Phone, Mail, MapPin, CheckCircle, XCircle, CalendarDays, Lock } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import type { Booking, BookingStats } from '@/lib/hooks/useRealtimeBookings'
import { useSubscription } from '@/lib/hooks/useSubscription'

interface BookingsManagerProps {
  bookings: Booking[]
  stats: BookingStats
  loading: boolean
  onStatusChange: (bookingId: string, status: string) => void
  onDeleteBooking: (bookingId: string) => void
}

export default function BookingsManager({
  bookings,
  stats,
  loading,
  onStatusChange,
  onDeleteBooking
}: BookingsManagerProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const { subscription, hasFeature } = useSubscription()

  // Filter bookings
  const now = new Date()
  const upcomingBookings = bookings.filter(b => 
    new Date(b.scheduled_at) >= now && ['pending', 'confirmed'].includes(b.status)
  )
  const pastBookings = bookings.filter(b => 
    new Date(b.scheduled_at) < now || ['completed', 'cancelled'].includes(b.status)
  )

  // Limit bookings for free users
  const maxBookingsForFree = 3
  const displayUpcomingBookings = hasFeature('bookingScheduler') 
    ? upcomingBookings 
    : upcomingBookings.slice(0, maxBookingsForFree)
  const displayPastBookings = hasFeature('bookingScheduler') 
    ? pastBookings 
    : pastBookings.slice(0, maxBookingsForFree)

  // Apply status filter
  let filteredBookings = filterStatus === 'upcoming' ? displayUpcomingBookings : 
                         filterStatus === 'past' ? displayPastBookings :
                         hasFeature('bookingScheduler') ? bookings : [...displayUpcomingBookings, ...displayPastBookings]

  if (filterStatus !== 'all' && filterStatus !== 'upcoming' && filterStatus !== 'past') {
    filteredBookings = bookings.filter(b => b.status === filterStatus)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">📅 Bookings & Appointments</h1>
        <p className="text-gray-400">
          {upcomingBookings.length} upcoming · {pastBookings.length} past
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <Calendar className="w-10 h-10 text-[#F3C77E]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-blue-400">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <CalendarDays className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Pro Upgrade Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 backdrop-blur-md border border-[#F3C77E]/30 rounded-xl p-6 mb-8"
      >
        <p className="text-white text-center">
          <strong className="text-[#F3C77E]">✨ Upgrade to Pro</strong> to unlock unlimited bookings, automatic reminders, and more!{' '}
          <a href="/dashboard/billing" className="underline font-bold hover:text-[#F3C77E] transition-colors">
            Get started →
          </a>
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'upcoming', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'bg-[#F3C77E] text-[#080705]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-[#F3C77E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-12 text-center border border-white/10"
        >
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
          <p className="text-gray-400">
            Bookings will appear here when clients schedule with you
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#F3C77E]/50 transition-all cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{booking.client_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    {booking.listings && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.listings.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-white mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{format(new Date(booking.scheduled_at), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(booking.scheduled_at), 'h:mm a')}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4" />
                    {hasFeature('bookingScheduler') ? (
                      <a
                        href={`mailto:${booking.client_email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#F3C77E] transition-colors"
                      >
                        {booking.client_email}
                      </a>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {booking.client_email.substring(0, 3)}***@***.***
                      </span>
                    )}
                  </div>
                  {booking.client_phone && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Phone className="w-4 h-4" />
                      {hasFeature('bookingScheduler') ? (
                        <a
                          href={`tel:${booking.client_phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#F3C77E] transition-colors"
                        >
                          {booking.client_phone}
                        </a>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          ***-***-{booking.client_phone.slice(-4)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    {hasFeature('bookingScheduler') ? (
                      <p className="text-sm text-gray-300">{booking.notes}</p>
                    ) : (
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span>Notes hidden - Upgrade to Pro to view</span>
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!hasFeature('bookingScheduler')) {
                          alert('Upgrade to Pro to manage bookings')
                          return
                        }
                        console.log('🔵 Confirm button clicked for booking:', booking.id)
                        onStatusChange(booking.id, 'confirmed')
                      }}
                      className={`px-4 py-2 rounded-lg transition-all text-sm font-medium border ${
                        hasFeature('bookingScheduler')
                          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                      }`}
                      disabled={!hasFeature('bookingScheduler')}
                    >
                      {hasFeature('bookingScheduler') ? '✓ Confirm' : '🔒 Confirm'}
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!hasFeature('bookingScheduler')) {
                          alert('Upgrade to Pro to manage bookings')
                          return
                        }
                        onStatusChange(booking.id, 'completed')
                      }}
                      className={`px-4 py-2 rounded-lg transition-all text-sm font-medium border ${
                        hasFeature('bookingScheduler')
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30'
                          : 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                      }`}
                      disabled={!hasFeature('bookingScheduler')}
                    >
                      {hasFeature('bookingScheduler') ? '✓ Mark Complete' : '🔒 Mark Complete'}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!hasFeature('bookingScheduler')) {
                        alert('Upgrade to Pro to manage bookings')
                        return
                      }
                      console.log('🔴 Cancel button clicked for booking:', booking.id)
                      onStatusChange(booking.id, 'cancelled')
                    }}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium border ${
                      hasFeature('bookingScheduler')
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30'
                        : 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                    }`}
                    disabled={!hasFeature('bookingScheduler')}
                  >
                    {hasFeature('bookingScheduler') ? '✕ Cancel' : '🔒 Cancel'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!hasFeature('bookingScheduler')) {
                        alert('Upgrade to Pro to manage bookings')
                        return
                      }
                      console.log('🗑️ Delete button clicked for booking:', booking.id)
                      if (confirm('Delete this booking?')) {
                        onDeleteBooking(booking.id)
                      }
                    }}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      hasFeature('bookingScheduler')
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                        : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!hasFeature('bookingScheduler')}
                  >
                    {hasFeature('bookingScheduler') ? 'Delete' : '🔒 Delete'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Free user limit message */}
          {!hasFeature('bookingScheduler') && (upcomingBookings.length > maxBookingsForFree || pastBookings.length > maxBookingsForFree) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#F3C77E]" />
                <div>
                  <h3 className="text-white font-semibold">Showing {maxBookingsForFree} of {bookings.length} bookings</h3>
                  <p className="text-gray-300 text-sm">Upgrade to Pro to see all bookings and manage them</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-b from-[#1A0E10] to-[#080705] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Status</label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => {
                      onStatusChange(selectedBooking.id, e.target.value)
                      setSelectedBooking({ ...selectedBooking, status: e.target.value as any })
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#F3C77E] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Client Info */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Client Information</h3>
                  {hasFeature('bookingScheduler') ? (
                    <div className="space-y-2">
                      <p className="text-gray-300"><strong>Name:</strong> {selectedBooking.client_name}</p>
                      <p className="text-gray-300"><strong>Email:</strong> {selectedBooking.client_email}</p>
                      {selectedBooking.client_phone && (
                        <p className="text-gray-300"><strong>Phone:</strong> {selectedBooking.client_phone}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span><strong>Name:</strong> {selectedBooking.client_name.substring(0, 3)}***</span>
                      </p>
                      <p className="text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span><strong>Email:</strong> {selectedBooking.client_email.substring(0, 3)}***@***.***</span>
                      </p>
                      {selectedBooking.client_phone && (
                        <p className="text-gray-500 flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          <span><strong>Phone:</strong> ***-***-{selectedBooking.client_phone.slice(-4)}</span>
                        </p>
                      )}
                      <p className="text-[#F3C77E] text-sm mt-3">Upgrade to Pro to view full contact information</p>
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Date & Time</h3>
                  <p className="text-gray-300">
                    {format(new Date(selectedBooking.scheduled_at), 'EEEE, MMMM d, yyyy')} at {format(new Date(selectedBooking.scheduled_at), 'h:mm a')}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Duration: {selectedBooking.duration} minutes</p>
                </div>

                {/* Location */}
                {(selectedBooking.location || selectedBooking.listings) && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Location</h3>
                    {selectedBooking.listings && (
                      <div>
                        <p className="text-white font-medium">{selectedBooking.listings.title}</p>
                        <p className="text-gray-400 text-sm">
                          {selectedBooking.listings.address}, {selectedBooking.listings.city}, {selectedBooking.listings.state}
                        </p>
                      </div>
                    )}
                    {selectedBooking.location && !selectedBooking.listings && (
                      <p className="text-gray-300">{selectedBooking.location}</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Notes</h3>
                    {hasFeature('bookingScheduler') ? (
                      <p className="text-gray-300">{selectedBooking.notes}</p>
                    ) : (
                      <p className="text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        <span>Notes hidden - Upgrade to Pro to view</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (!hasFeature('bookingScheduler')) {
                        alert('Upgrade to Pro to manage bookings')
                        return
                      }
                      if (confirm('Delete this booking?')) {
                        onDeleteBooking(selectedBooking.id)
                        setSelectedBooking(null)
                      }
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all font-medium border ${
                      hasFeature('bookingScheduler')
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30'
                        : 'bg-gray-500/20 text-gray-500 border-gray-500/30 cursor-not-allowed'
                    }`}
                    disabled={!hasFeature('bookingScheduler')}
                  >
                    {hasFeature('bookingScheduler') ? 'Delete Booking' : '🔒 Delete Booking'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

