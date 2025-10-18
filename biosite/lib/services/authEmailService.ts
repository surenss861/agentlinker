import { createClient } from '@/lib/supabase'

interface AuthEmailOptions {
  email: string
  redirectTo?: string
}

interface AuthEmailResult {
  success: boolean
  error?: string
  message?: string
}

export class AuthEmailService {
  private supabase = createClient()

  /**
   * Send email confirmation for new signups
   */
  async sendEmailConfirmation({ email, redirectTo }: AuthEmailOptions): Promise<AuthEmailResult> {
    try {
      console.log('📧 Sending email confirmation to:', email)
      
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/onboarding`
        }
      })

      if (error) {
        console.error('Email confirmation error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Email confirmation sent successfully')
      return {
        success: true,
        message: 'Confirmation email sent! Please check your inbox and spam folder.'
      }
    } catch (err: any) {
      console.error('Failed to send email confirmation:', err)
      return {
        success: false,
        error: err.message || 'Failed to send confirmation email'
      }
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset({ email, redirectTo }: AuthEmailOptions): Promise<AuthEmailResult> {
    try {
      console.log('📧 Sending password reset email to:', email)
      
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`
      })

      if (error) {
        console.error('Password reset error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Password reset email sent successfully')
      return {
        success: true,
        message: 'Password reset email sent! Check your inbox and spam folder.'
      }
    } catch (err: any) {
      console.error('Failed to send password reset:', err)
      return {
        success: false,
        error: err.message || 'Failed to send password reset email'
      }
    }
  }

  /**
   * Check if user's email is confirmed
   */
  async checkEmailConfirmation(email: string): Promise<{ confirmed: boolean; user?: any }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error) {
        console.error('Error checking email confirmation:', error)
        return { confirmed: false }
      }

      return {
        confirmed: user?.email_confirmed_at ? true : false,
        user
      }
    } catch (err) {
      console.error('Failed to check email confirmation:', err)
      return { confirmed: false }
    }
  }

  /**
   * Resend confirmation email for unconfirmed users
   */
  async resendConfirmation(email: string): Promise<AuthEmailResult> {
    try {
      console.log('📧 Resending confirmation email to:', email)
      
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/onboarding`
        }
      })

      if (error) {
        console.error('Resend confirmation error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log('✅ Confirmation email resent successfully')
      return {
        success: true,
        message: 'Confirmation email resent! Please check your inbox.'
      }
    } catch (err: any) {
      console.error('Failed to resend confirmation:', err)
      return {
        success: false,
        error: err.message || 'Failed to resend confirmation email'
      }
    }
  }
}

// Export singleton instance
export const authEmailService = new AuthEmailService()
