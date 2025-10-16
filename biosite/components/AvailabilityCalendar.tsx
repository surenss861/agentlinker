'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, X, Check } from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO, isAfter, isBefore } from 'date-fns'

interface Booking {
  id: string
  scheduled_at: string
  duration: number
  status: string
}

interface AvailabilityCalendarProps {
  agentId: string
  onSelectSlot: (date: Date, time: string) => void
  selectedDate?: Date
  selectedTime?: string
}

export default function AvailabilityCalendar({ 
  agentId, 
  onSelectSlot, 
  selectedDate, 
  selectedTime 
}: AvailabilityCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Default available hours (9 AM - 5 PM)
  const availableHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  useEffect(() => {
    fetchBookings()
  }, [agentId, currentWeek])

  const fetchBookings = async () => {
    try {
      const startDate = currentWeek
      const endDate = addWeeks(currentWeek, 1)
      
      const response = await fetch(
        `/api/bookings?user_id=${agentId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setExistingBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const isSlotBooked = (date: Date, time: string): boolean => {
    const slotDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`)
    
    const isBooked = existingBookings.some(booking => {
      if (booking.status === 'cancelled') return false
      
      const bookingStart = parseISO(booking.scheduled_at)
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000)
      
      const overlaps = (
        slotDateTime >= bookingStart &&
        slotDateTime < bookingEnd
      )
      
      
      return overlaps
    })
    
    return isBooked
  }

  const isPastSlot = (date: Date, time: string): boolean => {
    const slotDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`)
    return isBefore(slotDateTime, new Date())
  }

  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
  }

  const handleSlotClick = (date: Date, time: string) => {
    if (!isPastSlot(date, time) && !isSlotBooked(date, time)) {
      onSelectSlot(date, time)
    }
  }

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-[#702632]/40 p-6">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#912F40]" />
          Select Date & Time
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
          >
            ← Prev
          </button>
          <span className="text-white text-sm">
            {format(currentWeek, 'MMM d')} - {format(addWeeks(currentWeek, 1), 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
          >
            Next →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading availability...</div>
      ) : (
        <div className="grid grid-cols-8 gap-2">
          {/* Time column header */}
          <div className="text-xs font-medium text-gray-500 sticky left-0 bg-[#1A1A1A]">
            <Clock className="h-4 w-4 mx-auto mb-2" />
          </div>

          {/* Day headers */}
          {getWeekDates().map((date, index) => (
            <div key={index} className="text-center">
              <div className="text-xs font-medium text-gray-400">{weekDays[index]}</div>
              <div className="text-sm font-bold text-white">{format(date, 'd')}</div>
            </div>
          ))}

          {/* Time slots */}
          {availableHours.map((time) => (
            <React.Fragment key={time}>
              {/* Time label */}
              <div className="text-xs text-gray-500 py-2 text-right pr-2">
                {time}
              </div>

              {/* Day slots */}
              {getWeekDates().map((date) => {
                const booked = isSlotBooked(date, time)
                const past = isPastSlot(date, time)
                const selected = selectedDate && isSameDay(date, selectedDate) && selectedTime === time

                return (
                  <button
                    key={`${format(date, 'yyyy-MM-dd')}-${time}`}
                    onClick={() => handleSlotClick(date, time)}
                    disabled={booked || past}
                    className={`
                      py-2 rounded text-xs font-medium transition
                      ${past 
                        ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
                        : booked
                        ? 'bg-red-900/30 text-red-400 cursor-not-allowed'
                        : selected
                        ? 'bg-[#912F40] text-white ring-2 ring-[#912F40]'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-[#702632] hover:text-white cursor-pointer'
                      }
                    `}
                  >
                    {past ? (
                      <X className="h-3 w-3 mx-auto" />
                    ) : booked ? (
                      <X className="h-3 w-3 mx-auto" />
                    ) : selected ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      '•'
                    )}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-700/50 rounded"></div>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#912F40] rounded"></div>
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-900/30 rounded"></div>
          <span className="text-gray-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-800/30 rounded"></div>
          <span className="text-gray-400">Past</span>
        </div>
      </div>
    </div>
  )
}

