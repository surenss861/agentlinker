import { useState } from 'react'
import { authEmailService } from '@/lib/services/authEmailService'

interface UseAuthEmailReturn {
  // Email confirmation
  sendEmailConfirmation: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  
  // Password reset
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  
  // Email status
  checkEmailConfirmation: (email: string) => Promise<{ confirmed: boolean; user?: any }>
  
  // Loading states
  confirmationLoading: boolean
  resetLoading: boolean
  resendLoading: boolean
  
  // Error handling
  error: string | null
  clearError: () => void
}

export const useAuthEmail = (): UseAuthEmailReturn => {
  const [confirmationLoading, setConfirmationLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const sendEmailConfirmation = async (email: string) => {
    setConfirmationLoading(true)
    setError(null)

    try {
      const result = await authEmailService.sendEmailConfirmation({ email })
      
      if (!result.success) {
        setError(result.error || 'Failed to send confirmation email')
      }
      
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send confirmation email'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setConfirmationLoading(false)
    }
  }

  const resendConfirmation = async (email: string) => {
    setResendLoading(true)
    setError(null)

    try {
      const result = await authEmailService.resendConfirmation(email)
      
      if (!result.success) {
        setError(result.error || 'Failed to resend confirmation email')
      }
      
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend confirmation email'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setResendLoading(false)
    }
  }

  const sendPasswordReset = async (email: string) => {
    setResetLoading(true)
    setError(null)

    try {
      const result = await authEmailService.sendPasswordReset({ email })
      
      if (!result.success) {
        setError(result.error || 'Failed to send password reset email')
      }
      
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send password reset email'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setResetLoading(false)
    }
  }

  const checkEmailConfirmation = async (email: string) => {
    try {
      return await authEmailService.checkEmailConfirmation(email)
    } catch (err: any) {
      console.error('Failed to check email confirmation:', err)
      return { confirmed: false }
    }
  }

  return {
    sendEmailConfirmation,
    resendConfirmation,
    sendPasswordReset,
    checkEmailConfirmation,
    confirmationLoading,
    resetLoading,
    resendLoading,
    error,
    clearError
  }
}
