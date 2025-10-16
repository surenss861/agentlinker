-- Weekly Performance Email System
-- Note: pg_cron extension may not be available in all Supabase projects
-- Use alternative scheduling methods below

-- 1. Manual trigger function (always works)
CREATE OR REPLACE FUNCTION trigger_weekly_performance_emails()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- This function will be called by external cron service
  -- For now, just log that it was triggered
  INSERT INTO analytics (user_id, event_type, source, value)
  VALUES ('00000000-0000-0000-0000-000000000000', 'weekly_email_triggered', 'manual', 1);
  
  -- Return success message
  SELECT json_build_object(
    'success', true,
    'message', 'Weekly email trigger logged. Use external cron service to call the edge function.',
    'timestamp', now()
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION trigger_weekly_performance_emails() TO authenticated;

-- 2. Create a table to track email schedules (alternative approach)
CREATE TABLE IF NOT EXISTS email_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  schedule_type text DEFAULT 'weekly',
  last_sent timestamptz,
  next_send timestamptz DEFAULT (now() + interval '7 days'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS email_schedules_next_send_idx ON email_schedules(next_send) WHERE is_active = true;

-- 3. Function to get users due for weekly emails
CREATE OR REPLACE FUNCTION get_users_due_for_weekly_emails()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  subscription_tier text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.subscription_tier
  FROM users u
  LEFT JOIN email_schedules es ON u.id = es.user_id
  WHERE u.subscription_tier IN ('trial', 'pro')
    AND (es.id IS NULL OR es.next_send <= now() OR es.is_active = false);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_users_due_for_weekly_emails() TO authenticated;
