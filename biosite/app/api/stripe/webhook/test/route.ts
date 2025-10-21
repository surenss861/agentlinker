import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    environment: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    return NextResponse.json({
      message: 'Test webhook received',
      timestamp: new Date().toISOString(),
      hasBody: !!body,
      hasSignature: !!signature,
      bodyLength: body.length,
      environment: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
