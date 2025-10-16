-- Create subscriptions table for tracking all subscription purchases and status
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'trialing')),
  amount_paid INTEGER NOT NULL DEFAULT 0, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Create function to update user subscription_tier when subscription changes
CREATE OR REPLACE FUNCTION update_user_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's subscription_tier based on the most recent active subscription
  UPDATE users 
  SET subscription_tier = (
    SELECT tier 
    FROM subscriptions 
    WHERE user_id = NEW.user_id 
      AND status = 'active' 
    ORDER BY created_at DESC 
    LIMIT 1
  ),
  updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user subscription_tier
CREATE TRIGGER trigger_update_user_subscription_tier
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_subscription_tier();

-- Create RLS policies for subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own subscriptions (for webhook processing)
CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: System can update subscriptions (for webhook processing)
CREATE POLICY "System can update subscriptions" ON subscriptions
  FOR UPDATE USING (true);

-- Create a view for active subscriptions
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT 
  s.*,
  u.email,
  u.full_name,
  u.slug
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Grant permissions
GRANT SELECT ON active_subscriptions TO authenticated;
GRANT ALL ON subscriptions TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Insert some sample data (optional - remove in production)
-- INSERT INTO subscriptions (user_id, tier, status, amount_paid, billing_cycle, current_period_start, current_period_end)
-- VALUES 
--   ('your-user-id-here', 'pro', 'active', 2000, 'monthly', NOW(), NOW() + INTERVAL '1 month');

COMMENT ON TABLE subscriptions IS 'Tracks all subscription purchases and status changes';
COMMENT ON COLUMN subscriptions.amount_paid IS 'Amount paid in cents (e.g., 2000 = $20.00)';
COMMENT ON COLUMN subscriptions.metadata IS 'Additional data from Stripe webhooks';
COMMENT ON COLUMN subscriptions.billing_cycle IS 'How often the subscription is billed';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Whether to cancel at the end of current period';
