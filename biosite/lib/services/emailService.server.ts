// Server-side email service using SendGrid
// This file should only be imported in server-side code

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
}

export const sendEmailWithSendGrid = async (emailData: EmailData) => {
  try {
    // Dynamic import to avoid bundling in client-side code
    const sgMail = await import('@sendgrid/mail')
    
    // Configure SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY)
    }
    
    const msg = {
      to: emailData.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@agentlinker.ca',
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    }
    
    const result = await sgMail.default.send(msg)
    return { success: true, messageId: result[0].headers['x-message-id'] }
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send email via SendGrid')
  }
}
