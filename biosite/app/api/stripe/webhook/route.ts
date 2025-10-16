import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

// Only initialize Stripe if environment variables are available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
}) : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received')

    // Return early if Stripe is not configured
    if (!stripe || !webhookSecret) {
      console.log('❌ Stripe webhook not configured, skipping')
      return NextResponse.json({ received: true })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      console.log('✅ Checkout session completed')
      const session = event.data.object as Stripe.Checkout.Session
      const { agent_id, tier } = session.metadata || {}

      console.log('📋 Session metadata:', { agent_id, tier })
      console.log('💰 Payment status:', session.payment_status)
      console.log('💳 Payment intent:', session.payment_intent)

      // CRITICAL: Only process if payment was actually successful
      if (session.payment_status !== 'paid') {
        console.log('❌ Payment not successful, skipping subscription update')
        console.log('Payment status:', session.payment_status)
        return NextResponse.json({ 
          message: 'Payment not successful, subscription not updated',
          payment_status: session.payment_status 
        })
      }

      if (!agent_id || !tier) {
        console.error('❌ Missing metadata in checkout session:', { agent_id, tier })
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Additional verification: Check if this is a test mode session
      if (session.livemode === false) {
        console.log('🧪 Test mode session detected')
      }

      // Update user subscription tier
      const { error } = await supabase
        .from('users')
        .update({
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', agent_id)

      if (error) {
        console.error('❌ Error updating user subscription:', error)
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
      }

      console.log(`✅ User ${agent_id} upgraded to ${tier} plan (Payment: ${session.payment_status})`)
    }

    // Handle payment failures
    if (event.type === 'checkout.session.expired') {
      console.log('⏰ Checkout session expired - no action needed')
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.log('❌ Payment failed - no subscription update')
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment failure details:', paymentIntent.last_payment_error)
    }

    // Handle subscription status changes
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Find user by customer ID (you might need to store this in your users table)
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        const newTier = subscription.status === 'active' ? 'pro' : 'free'

        const { error } = await supabase
          .from('users')
          .update({
            subscription_tier: newTier,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error updating subscription status:', error)
        } else {
          console.log(`✅ User ${user.id} subscription updated to ${newTier}`)
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        const { error } = await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error downgrading subscription:', error)
        } else {
          console.log(`✅ User ${user.id} subscription cancelled, downgraded to free`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}