// Email service with SendGrid integration
// SendGrid: Professional email service with 100 free emails/day
// Fallback: EmailJS for client-side sending

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

// EmailJS configuration (you'll need to sign up at emailjs.com)
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id',
  templateId: 'booking_confirmation', // You'll create this template in EmailJS
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key'
}

// SendGrid is handled server-side via /api/send-email endpoint
// This client-side service only handles EmailJS and fallbacks

// Option 2: EmailJS Integration (Client-side, free)
export const sendEmailWithEmailJS = async (emailData: EmailData) => {
  try {
    // Dynamic import to avoid SSR issues
    const emailjs = await import('@emailjs/browser')
    
    const templateParams = {
      to_email: emailData.to,
      subject: emailData.subject,
      message: emailData.text,
      html_message: emailData.html
    }

    const result = await emailjs.default.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )

    return { success: true, messageId: result.text }
  } catch (error) {
    console.error('EmailJS error:', error)
    throw new Error('Failed to send email via EmailJS')
  }
}

// Option 2: Simple SMTP with Gmail (Server-side)
export const sendEmailWithSMTP = async (emailData: EmailData) => {
  try {
    // SMTP functionality removed to prevent client-side bundling issues
    // Use the /api/send-email endpoint for server-side email sending
    console.log('SMTP email sending is handled server-side via /api/send-email')
    throw new Error('Use /api/send-email endpoint for email sending')
  } catch (error) {
    console.error('SMTP error:', error)
    throw new Error('Failed to send email via SMTP')
  }
}

// Option 3: Simple fetch to external email service
export const sendEmailWithExternalService = async (emailData: EmailData) => {
  try {
    // Example with a free email API service
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        template_params: {
          to_email: emailData.to,
          subject: emailData.subject,
          message: emailData.text,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Email service request failed')
    }

    const result = await response.json()
    return { success: true, messageId: result.messageId || 'unknown' }
  } catch (error) {
    console.error('External email service error:', error)
    throw new Error('Failed to send email via external service')
  }
}

// Main email sending function - client-side only (server-side uses API)
export const sendBookingConfirmationEmail = async (emailData: EmailData) => {
  // This function is for client-side use only
  // Server-side should use the /api/send-email endpoint
  
  // Try EmailJS (client-side)
  const isEmailJSConfigured = EMAILJS_CONFIG.serviceId !== 'your_service_id' && 
                              EMAILJS_CONFIG.publicKey !== 'your_public_key'
  
  if (isEmailJSConfigured) {
    try {
      console.log('📧 Sending email via EmailJS...')
      return await sendEmailWithEmailJS(emailData)
    } catch (error) {
      console.warn('EmailJS failed, trying fallback:', error)
    }
  }
  
  // Fallback to external service
  try {
    console.log('📧 Sending email via external service...')
    return await sendEmailWithExternalService(emailData)
  } catch (fallbackError) {
    console.error('All email methods failed:', fallbackError)
    
    // For development, just log the email content instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent in production:')
      console.log('To:', emailData.to)
      console.log('Subject:', emailData.subject)
      console.log('Content:', emailData.text)
      
      return { success: true, messageId: 'development-mock' }
    }
    
    throw new Error('Unable to send confirmation email')
  }
}
