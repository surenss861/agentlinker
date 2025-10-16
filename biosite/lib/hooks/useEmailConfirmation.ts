import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface EmailConfirmationData {
  clientName: string
  clientEmail: string
  agentName: string
  agentEmail: string
  listingAddress: string
  scheduledDate: string
  scheduledTime: string
  bookingId: string
}

export const useEmailConfirmation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const sendBookingConfirmation = async (data: EmailConfirmationData) => {
    setLoading(true)
    setError(null)

    try {
      // Call the Supabase Edge Function
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'send-booking-confirmation',
        {
          body: data
        }
      )

      if (functionError) {
        throw new Error(functionError.message)
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to send confirmation email')
      }

      return { success: true, messageId: result.messageId }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error sending confirmation email:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    sendBookingConfirmation,
    loading,
    error,
    clearError: () => setError(null)
  }
}
