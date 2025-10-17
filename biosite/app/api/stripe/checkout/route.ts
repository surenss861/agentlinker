import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tier } = body

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For development - use real Stripe checkout with test mode
    // Remove this block to always use real Stripe checkout
    // if (process.env.NODE_ENV === 'development') {
    //   const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true&tier=${tier}`
    //   console.log('🔧 Development mode: Creating mock checkout for tier:', tier)
    //   console.log('🔧 NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
    //   console.log('🔧 Redirect URL:', redirectUrl)
    //   return NextResponse.json({ 
    //     url: redirectUrl,
    //     message: 'Development mode - Stripe checkout bypassed'
    //   })
    // }

    // Create Stripe Checkout Session with dynamic pricing
    const stripe = getStripe()

    // Determine mode and pricing based on tier
    const isSubscription = tier === 'pro'
    const mode = isSubscription ? 'subscription' : 'payment'

    // Create line items based on tier
    const lineItems: any = isSubscription
      ? [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AgentLinker Pro',
            description: 'Monthly subscription for unlimited listings, analytics, and premium features',
          },
          unit_amount: 2000, // $20.00 in cents
          recurring: {
            interval: 'month' as const,
          },
        },
        quantity: 1,
      }]
      : [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AgentLinker Business Verification',
            description: 'One-time verification badge and lifetime access to all features',
          },
          unit_amount: 2500, // $25.00 in cents
        },
        quantity: 1,
      }]

    const session = await stripe.checkout.sessions.create({
      customer_email: userProfile.email,
      line_items: lineItems,
      mode: mode as any,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        agent_id: userProfile.id,
        tier: tier,
      },
    })

    // Store the Stripe customer ID if it was created
    if (session.customer) {
      await supabase
        .from('users')
        .update({
          stripe_customer_id: session.customer as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id)
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

