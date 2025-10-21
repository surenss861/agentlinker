-- Updated subscription table structure for proper checkout flow
-- This ensures webhook can properly process checkout.session.completed events

-- First, let's check the current table structure
-- If the table exists, we'll modify it; if not, we'll create it

-- Drop existing subscriptions table if it exists (be careful in production!)
-- DROP TABLE IF EXISTS subscriptions;

-- Create the subscriptions table with proper structure
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Stripe-related fields
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT UNIQUE, -- This is crucial for webhook processing
  
  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'business', 'help')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
  
  -- Payment details
  amount_paid INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  
  -- Period tracking
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- Trial information
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Cancellation tracking
  canceled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- Metadata for additional information
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_checkout_session_id ON subscriptions(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_subscription_updated_at ON subscriptions;
CREATE TRIGGER trigger_update_subscription_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Users can update their own subscription status (for manual updates)
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert policy for service role (webhooks)
CREATE POLICY "Service role can insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Create a function to handle checkout.session.completed events
CREATE OR REPLACE FUNCTION handle_checkout_session_completed(
  session_id TEXT,
  customer_id TEXT,
  user_id UUID,
  tier TEXT,
  amount_paid INTEGER,
  billing_cycle TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  subscription_id UUID;
BEGIN
  -- Update user's subscription_tier
  UPDATE users 
  SET subscription_tier = tier,
      stripe_customer_id = customer_id,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Insert or update subscription record
  INSERT INTO subscriptions (
    user_id,
    stripe_customer_id,
    stripe_checkout_session_id,
    tier,
    status,
    amount_paid,
    currency,
    billing_cycle,
    current_period_start,
    current_period_end,
    metadata
  ) VALUES (
    user_id,
    customer_id,
    session_id,
    tier,
    'active',
    amount_paid,
    'usd',
    billing_cycle,
    NOW(),
    CASE 
      WHEN billing_cycle = 'monthly' THEN NOW() + INTERVAL '1 month'
      WHEN billing_cycle = 'yearly' THEN NOW() + INTERVAL '1 year'
      ELSE NOW()
    END,
    jsonb_build_object(
      'checkout_session_id', session_id,
      'processed_at', NOW()::text,
      'webhook_event', 'checkout.session.completed'
    )
  )
  ON CONFLICT (stripe_checkout_session_id) 
  DO UPDATE SET
    tier = EXCLUDED.tier,
    status = 'active',
    updated_at = NOW();
  
  -- Get the subscription ID
  SELECT id INTO subscription_id FROM subscriptions WHERE stripe_checkout_session_id = session_id;
  
  -- Return success
  SELECT json_build_object(
    'success', true,
    'subscription_id', subscription_id,
    'user_id', user_id,
    'tier', tier,
    'message', 'Subscription activated successfully'
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO anon, authenticated;
GRANT USAGE ON SEQUENCE subscriptions_id_seq TO anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_checkout_session_completed TO anon, authenticated;
