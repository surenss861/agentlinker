import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request (optional security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Triggering weekly performance emails via Vercel Cron...')

    // Call the Supabase Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/weekly-performance`
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ 
        trigger: 'vercel_cron',
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Edge function failed:', errorText)
      throw new Error(`Edge function failed: ${errorText}`)
    }

    const result = await response.json()
    console.log('📧 Weekly emails result:', result)

    return NextResponse.json({ 
      success: true, 
      message: 'Weekly performance emails triggered successfully',
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('❌ Weekly emails cron error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to trigger weekly emails',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
