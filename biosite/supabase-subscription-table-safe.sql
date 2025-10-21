-- Safe subscription table structure update
-- This handles existing policies and tables gracefully

-- Create the subscriptions table with proper structure (only if it doesn't exist)
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

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add stripe_checkout_session_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'stripe_checkout_session_id') THEN
    ALTER TABLE subscriptions ADD COLUMN stripe_checkout_session_id TEXT;
  END IF;
  
  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE table_name = 'subscriptions' AND constraint_name = 'subscriptions_stripe_checkout_session_id_key') THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_stripe_checkout_session_id_key UNIQUE (stripe_checkout_session_id);
  END IF;
  
  -- Add other missing columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'stripe_payment_intent_id') THEN
    ALTER TABLE subscriptions ADD COLUMN stripe_payment_intent_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'billing_cycle') THEN
    ALTER TABLE subscriptions ADD COLUMN billing_cycle TEXT DEFAULT 'monthly';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'current_period_start') THEN
    ALTER TABLE subscriptions ADD COLUMN current_period_start TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'current_period_end') THEN
    ALTER TABLE subscriptions ADD COLUMN current_period_end TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'trial_start') THEN
    ALTER TABLE subscriptions ADD COLUMN trial_start TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'trial_end') THEN
    ALTER TABLE subscriptions ADD COLUMN trial_end TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'canceled_at') THEN
    ALTER TABLE subscriptions ADD COLUMN canceled_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'cancel_at_period_end') THEN
    ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'metadata') THEN
    ALTER TABLE subscriptions ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscriptions' AND column_name = 'updated_at') THEN
    ALTER TABLE subscriptions ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
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

-- Create trigger to automatically update updated_at (drop first if exists)
DROP TRIGGER IF EXISTS trigger_update_subscription_updated_at ON subscriptions;
CREATE TRIGGER trigger_update_subscription_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON subscriptions;

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

-- Grant sequence permissions only if the sequence exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'subscriptions_id_seq') THEN
    GRANT USAGE ON SEQUENCE subscriptions_id_seq TO anon, authenticated;
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION handle_checkout_session_completed TO anon, authenticated;

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
ORDER BY ordinal_position;
