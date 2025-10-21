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
    console.log('🔍 Environment check:', {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV
    })

    // Return early if Stripe is not configured
    if (!stripe || !webhookSecret) {
      console.log('❌ Stripe webhook not configured, skipping')
      console.log('❌ Stripe instance:', !!stripe)
      console.log('❌ Webhook secret:', !!webhookSecret)
      return NextResponse.json({
        error: 'Stripe webhook not configured',
        hasStripe: !!stripe,
        hasWebhookSecret: !!webhookSecret
      }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    console.log('🔍 Request details:', {
      bodyLength: body.length,
      hasSignature: !!signature,
      signatureLength: signature?.length
    })

    if (!signature) {
      console.error('❌ No stripe-signature header found')
      return NextResponse.json({ error: 'No signature header' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Signature verified, event type:', event.type)
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      console.error('❌ Signature:', signature.substring(0, 20) + '...')
      console.error('❌ Body preview:', body.substring(0, 100) + '...')
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
        console.log('🧪 Test mode session detected - this is expected for debugging')
      } else {
        console.log('🚀 Live mode session detected')
      }

      // Determine billing cycle and amount
      const isSubscription = tier === 'pro'
      let billingCycle: string
      let amountPaid: number
      
      if (tier === 'pro') {
        billingCycle = 'monthly'
        amountPaid = 2000 // $20.00
      } else if (tier === 'business') {
        billingCycle = 'one_time'
        amountPaid = 2500 // $25.00
      } else if (tier === 'help') {
        billingCycle = 'one_time'
        amountPaid = 5000 // $50.00
      } else {
        console.error('❌ Unknown tier in webhook:', tier)
        return NextResponse.json({ error: 'Unknown tier' }, { status: 400 })
      }

      // Calculate period dates
      const now = new Date()
      const periodStart = now
      const periodEnd = isSubscription ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : now

      // CRITICAL: Update user's subscription_tier in users table
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          subscription_tier: tier,
          stripe_customer_id: session.customer as string
        })
        .eq('id', agent_id)

      if (userUpdateError) {
        console.error('❌ Error updating user subscription tier:', userUpdateError)
        return NextResponse.json({ error: 'Failed to update user subscription' }, { status: 500 })
      }

      console.log(`✅ User subscription tier updated to ${tier} for user ${agent_id}`)

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
        // Don't fail here since we already updated the users table
        console.log('⚠️ User tier was updated but subscription record failed')
      } else {
        console.log(`✅ Subscription record created for user ${agent_id} (${tier} plan, $${amountPaid / 100})`)
      }
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

        // If subscription is no longer active, downgrade user to free
        if (newStatus !== 'active') {
          await supabase
            .from('users')
            .update({ subscription_tier: 'free' })
            .eq('id', user.id)
          console.log(`✅ User ${user.id} downgraded to free tier`)
        }

        // Update subscription record
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: newStatus,
            current_period_start: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000).toISOString() : null,
            current_period_end: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
            canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null,
            cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
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

      // Find user by customer ID and downgrade to free
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (user) {
        await supabase
          .from('users')
          .update({ subscription_tier: 'free' })
          .eq('id', user.id)
        console.log(`✅ User ${user.id} downgraded to free tier after cancellation`)
      }

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