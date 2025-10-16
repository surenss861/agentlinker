import { NextRequest, NextResponse } from 'next/server'
import { sendEmailWithSendGrid } from '@/lib/services/emailService.server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json()

    if (!to || !subject || !html || !text) {
      return NextResponse.json(
        { error: 'Missing required email fields' },
        { status: 400 }
      )
    }

    const result = await sendEmailWithSendGrid({
      to,
      subject,
      html,
      text
    })

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
