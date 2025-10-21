import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test webhook received')
    
    const body = await request.json()
    console.log('🧪 Test webhook body:', body)
    
    const supabase = await createServerSupabaseClient()
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id, subscription_tier')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database test failed:', testError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: testError.message
      }, { status: 500 })
    }
    
    console.log('✅ Database connection successful')
    
    return NextResponse.json({
      message: 'Test webhook successful',
      timestamp: new Date().toISOString(),
      databaseTest: 'passed',
      environment: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error: any) {
    console.error('❌ Test webhook error:', error)
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
