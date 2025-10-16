'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, MessageSquare, Calendar, Check } from 'lucide-react'
import { format } from 'date-fns'
import AvailabilityCalendar from './AvailabilityCalendar'
import { sendBookingConfirmationEmail } from '@/lib/services/emailService'

interface BookShowingModalProps {
  agentId: string
  agentName: string
  listingId?: string
  listingAddress?: string
  onClose: () => void
}

export default function BookShowingModal({
  agentId,
  agentName,
  listingId,
  listingAddress,
  onClose
}: BookShowingModalProps) {
  const [step, setStep] = useState<'calendar' | 'details' | 'success'>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: ''
  })

  const handleSelectSlot = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep('details')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine date and time into ISO timestamp
      const dateTime = new Date(`${format(selectedDate!, 'yyyy-MM-dd')}T${selectedTime}:00`)
      
      const bookingData = {
        user_id: agentId,
        listing_id: listingId || null,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone || null,
        scheduled_at: dateTime.toISOString(),
        duration: 30,
        status: 'pending',
        location: listingAddress || null,
        notes: formData.notes || null
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const bookingResult = await response.json()

      // Send confirmation email via server-side API
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.client_email,
            subject: `Booking Request Confirmed - ${listingAddress || 'Property Showing'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #912F40;">Booking Request Sent!</h2>
                <p>Hello ${formData.client_name},</p>
                <p>Your showing request has been successfully sent to ${agentName}.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>📅 Booking Details</h3>
                  <p><strong>Property:</strong> ${listingAddress || 'Property Showing'}</p>
                  <p><strong>Date:</strong> ${format(selectedDate!, 'EEEE, MMMM d, yyyy')}</p>
                  <p><strong>Time:</strong> ${selectedTime}</p>
                  <p><strong>Agent:</strong> ${agentName}</p>
                </div>
                
                <p>You'll receive another email once the agent confirms your booking.</p>
                <p>Best regards,<br>The AgentLinker Team</p>
              </div>
            `,
            text: `
Booking Request Sent!

Hello ${formData.client_name},

Your showing request has been successfully sent to ${agentName}.

BOOKING DETAILS:
Property: ${listingAddress || 'Property Showing'}
Date: ${format(selectedDate!, 'EEEE, MMMM d, yyyy')}
Time: ${selectedTime}
Agent: ${agentName}

You'll receive another email once the agent confirms your booking.

Best regards,
The AgentLinker Team
            `
          })
        })

        if (emailResponse.ok) {
          console.log('✅ Confirmation email sent successfully via SendGrid')
        } else {
          console.warn('⚠️ Email API failed, trying fallback method')
          // Fallback to client-side email service
          await sendBookingConfirmationEmail({
            to: formData.client_email,
            subject: `Booking Request Confirmed - ${listingAddress || 'Property Showing'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #912F40;">Booking Request Sent!</h2>
                <p>Hello ${formData.client_name},</p>
                <p>Your showing request has been successfully sent to ${agentName}.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>📅 Booking Details</h3>
                  <p><strong>Property:</strong> ${listingAddress || 'Property Showing'}</p>
                  <p><strong>Date:</strong> ${format(selectedDate!, 'EEEE, MMMM d, yyyy')}</p>
                  <p><strong>Time:</strong> ${selectedTime}</p>
                  <p><strong>Agent:</strong> ${agentName}</p>
                </div>
                
                <p>You'll receive another email once the agent confirms your booking.</p>
                <p>Best regards,<br>The AgentLinker Team</p>
              </div>
            `,
            text: `
Booking Request Sent!

Hello ${formData.client_name},

Your showing request has been successfully sent to ${agentName}.

BOOKING DETAILS:
Property: ${listingAddress || 'Property Showing'}
Date: ${format(selectedDate!, 'EEEE, MMMM d, yyyy')}
Time: ${selectedTime}
Agent: ${agentName}

You'll receive another email once the agent confirms your booking.

Best regards,
The AgentLinker Team
            `
          })
        }
      } catch (emailError) {
        console.warn('⚠️ Failed to send confirmation email:', emailError)
        // Don't fail the booking if email fails
      }

      setStep('success')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#1A1A1A] rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-[#702632]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          {step === 'calendar' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-2">Book a Showing</h2>
              <p className="text-gray-400 mb-6">
                Schedule a viewing with {agentName}
                {listingAddress && ` for ${listingAddress}`}
              </p>

              <AvailabilityCalendar
                agentId={agentId}
                onSelectSlot={handleSelectSlot}
                selectedDate={selectedDate || undefined}
                selectedTime={selectedTime}
              />

              {selectedDate && selectedTime && (
                <div className="mt-6 bg-[#912F40]/10 border border-[#912F40]/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Selected Time</div>
                      <div className="text-lg font-bold text-white">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                      </div>
                    </div>
                    <button
                      onClick={handleContinue}
                      className="bg-[#912F40] hover:bg-[#702632] text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      Continue
                      <Check className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'details' && (
            <>
              <button
                onClick={() => setStep('calendar')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
              >
                ← Back to calendar
              </button>

              <h2 className="text-3xl font-bold text-white mb-2">Your Information</h2>
              <p className="text-gray-400 mb-6">
                Please provide your contact details so we can confirm your booking
              </p>

              <div className="bg-[#912F40]/10 border border-[#912F40]/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-[#912F40]" />
                  <span className="font-medium">
                    {format(selectedDate!, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#912F40]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#702632]/40 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#912F40]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#702632]/40 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#912F40]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#702632]/40 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#912F40]" />
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/50 border border-[#702632]/40 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#912F40] focus:border-[#912F40]"
                    placeholder="Any specific questions or requirements?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#912F40] hover:bg-[#702632] disabled:bg-gray-600 text-white px-6 py-4 rounded-lg font-medium transition text-lg"
                >
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Booking Request Sent!</h2>
              <p className="text-gray-400 mb-2">
                Your showing request for <strong className="text-white">{format(selectedDate!, 'EEEE, MMMM d')}</strong> at <strong className="text-white">{selectedTime}</strong> has been sent to {agentName}.
              </p>
              <p className="text-gray-400 mb-8">
                You'll receive a confirmation email at <strong className="text-white">{formData.client_email}</strong> once the agent confirms your booking.
              </p>
              <button
                onClick={onClose}
                className="bg-[#912F40] hover:bg-[#702632] text-white px-8 py-3 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

