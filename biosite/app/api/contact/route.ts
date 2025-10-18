import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email to AgentLinker
    const { data, error } = await resend.emails.send({
      from: 'AgentLinker Contact Form <contact@agentlinker.ca>',
      to: ['contact@agentlinker.ca'],
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #000; color: #fff; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; color: #ef4444;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 15px;">
              <strong>Name:</strong> ${name}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Email:</strong> ${email}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Subject:</strong> ${subject}
            </div>
            <div style="margin-bottom: 15px;">
              <strong>Message:</strong>
            </div>
            <div style="background: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #ef4444;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p>This message was sent from the AgentLinker contact form.</p>
              <p>Reply directly to this email to respond to ${email}</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending contact email:', error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: 'AgentLinker <contact@agentlinker.ca>',
      to: [email],
      subject: 'Thank you for contacting AgentLinker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #000; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; color: #ef4444;">Thank You!</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to AgentLinker! We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <div style="background: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #ef4444; margin: 15px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Check out our <a href="https://agentlinker.ca/demo" style="color: #ef4444;">demo</a> to see AgentLinker in action</li>
              <li>Read our <a href="https://agentlinker.ca/pricing" style="color: #ef4444;">pricing</a> to see our plans</li>
              <li>Sign up for a <a href="https://agentlinker.ca/signup" style="color: #ef4444;">free account</a> to get started</li>
            </ul>
            <p>Best regards,<br>The AgentLinker Team</p>
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p>© 2024 AgentLinker. All rights reserved.<br>Turn every click into a client.</p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
