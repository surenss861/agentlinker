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

      // Determine billing cycle and amount
      const isSubscription = tier === 'pro'
      const billingCycle = isSubscription ? 'monthly' : 'one_time'
      const amountPaid = isSubscription ? 2000 : 2500 // $20 for pro, $25 for business

      // Calculate period dates
      const now = new Date()
      const periodStart = now
      const periodEnd = isSubscription ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : now

      // Insert subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: agent_id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_checkout_session_id: session.id,
          tier: tier,
          status: 'active',
          amount_paid: amountPaid,
          currency: 'usd',
          billing_cycle: billingCycle,
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          metadata: {
            session_id: session.id,
            payment_status: session.payment_status,
            livemode: session.livemode,
            created_at: session.created
          }
        })

      if (subscriptionError) {
        console.error('❌ Error creating subscription record:', subscriptionError)
        return NextResponse.json({ error: 'Failed to create subscription record' }, { status: 500 })
      }

      console.log(`✅ Subscription record created for user ${agent_id} (${tier} plan, $${amountPaid / 100})`)
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

      // Find user by customer ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        const newStatus = subscription.status === 'active' ? 'active' :
          subscription.status === 'canceled' ? 'canceled' :
            subscription.status === 'past_due' ? 'past_due' :
              subscription.status === 'unpaid' ? 'unpaid' : 'incomplete'

        // Update subscription record
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: newStatus,
            current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
            current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
        } else {
          console.log(`✅ Subscription ${subscription.id} status updated to ${newStatus}`)
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Update subscription record to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error updating canceled subscription:', error)
      } else {
        console.log(`✅ Subscription ${subscription.id} marked as canceled`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}