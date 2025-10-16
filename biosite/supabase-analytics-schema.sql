-- =====================================================
-- AgentLinker Analytics System Schema
-- Purpose: Track full conversion funnel from views to bookings
-- =====================================================

-- Drop existing analytics_events table if it exists
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP MATERIALIZED VIEW IF EXISTS analytics_summary CASCADE;

-- 1. ANALYTICS EVENTS TABLE
-- Logs all visitor interactions across the funnel
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'link_click', 'listing_view', 'booking_click', 'lead_form')),
  
  -- Optional references
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Metadata for tracking sources, UTM params, etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Visitor info
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX analytics_events_user_id_idx ON analytics_events(user_id);
CREATE INDEX analytics_events_created_at_idx ON analytics_events(created_at);
CREATE INDEX analytics_events_event_type_idx ON analytics_events(event_type);
CREATE INDEX analytics_events_user_created_idx ON analytics_events(user_id, created_at DESC);

-- 2. MATERIALIZED VIEW FOR FAST DASHBOARD QUERIES
-- Aggregates daily stats for quick loading
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT
  user_id,
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'link_click') as link_clicks,
  COUNT(*) FILTER (WHERE event_type = 'listing_view') as listing_views,
  COUNT(*) FILTER (WHERE event_type = 'booking_click') as booking_clicks,
  COUNT(*) FILTER (WHERE event_type = 'lead_form') as lead_forms,
  COUNT(DISTINCT listing_id) as unique_listings_viewed,
  COUNT(DISTINCT ip_address) as unique_visitors
FROM analytics_events
GROUP BY user_id, DATE_TRUNC('day', created_at);

-- Index on materialized view
CREATE INDEX analytics_summary_user_day_idx ON analytics_summary(user_id, day DESC);

-- 3. ROW LEVEL SECURITY

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own analytics
CREATE POLICY "Users can view their own analytics"
  ON analytics_events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analytics
CREATE POLICY "Users can insert their own analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public can insert analytics (for tracking public page views)
CREATE POLICY "Public can insert analytics"
  ON analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. HELPER FUNCTIONS

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversion rate
CREATE OR REPLACE FUNCTION get_conversion_rate(p_user_id UUID, p_days INT DEFAULT 30)
RETURNS TABLE (
  page_views BIGINT,
  lead_forms BIGINT,
  bookings BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_type = 'lead_form') as lead_forms,
    (SELECT COUNT(*) FROM bookings WHERE user_id = p_user_id 
     AND created_at >= NOW() - (p_days || ' days')::INTERVAL) as bookings,
    CASE 
      WHEN COUNT(*) FILTER (WHERE event_type = 'page_view') > 0 THEN
        ROUND(
          (COUNT(*) FILTER (WHERE event_type = 'lead_form')::NUMERIC / 
           COUNT(*) FILTER (WHERE event_type = 'page_view')::NUMERIC) * 100,
          1
        )
      ELSE 0
    END as conversion_rate
  FROM analytics_events
  WHERE user_id = p_user_id
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top performing listings
CREATE OR REPLACE FUNCTION get_top_listings(p_user_id UUID, p_limit INT DEFAULT 5)
RETURNS TABLE (
  listing_id UUID,
  views BIGINT,
  leads BIGINT,
  bookings BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.listing_id,
    COUNT(*) FILTER (WHERE ae.event_type = 'listing_view') as views,
    COUNT(*) FILTER (WHERE ae.event_type = 'lead_form') as leads,
    (SELECT COUNT(*) FROM bookings WHERE bookings.listing_id = ae.listing_id) as bookings,
    CASE 
      WHEN COUNT(*) FILTER (WHERE ae.event_type = 'listing_view') > 0 THEN
        ROUND(
          (COUNT(*) FILTER (WHERE ae.event_type = 'lead_form')::NUMERIC / 
           COUNT(*) FILTER (WHERE ae.event_type = 'listing_view')::NUMERIC) * 100,
          1
        )
      ELSE 0
    END as conversion_rate
  FROM analytics_events ae
  WHERE ae.user_id = p_user_id
    AND ae.listing_id IS NOT NULL
  GROUP BY ae.listing_id
  ORDER BY conversion_rate DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGERS

-- Auto-log lead form submissions to analytics
CREATE OR REPLACE FUNCTION log_lead_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO analytics_events (user_id, event_type, lead_id, listing_id, metadata)
  VALUES (
    NEW.user_id,
    'lead_form',
    NEW.id,
    NEW.listing_id,
    jsonb_build_object(
      'source', NEW.source,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_analytics_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_analytics();

-- Auto-log booking submissions to analytics
CREATE OR REPLACE FUNCTION log_booking_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO analytics_events (user_id, event_type, booking_id, listing_id, metadata)
  VALUES (
    NEW.user_id,
    'booking_click',
    NEW.id,
    NEW.listing_id,
    jsonb_build_object(
      'status', NEW.status,
      'scheduled_at', NEW.scheduled_at,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_analytics_trigger
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_analytics();

-- 6. SCHEDULED REFRESH (Optional - run via cron or Edge Function)
-- Uncomment this if you want daily auto-refresh of materialized view
-- SELECT cron.schedule('refresh-analytics-summary', '0 2 * * *', 'SELECT refresh_analytics_summary()');

-- =====================================================
-- DONE! Now you have:
-- ✅ analytics_events table for all tracking
-- ✅ Materialized view for fast queries
-- ✅ Helper functions for conversion metrics
-- ✅ Auto-logging from leads and bookings
-- ✅ RLS policies for security
-- =====================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Analytics system installed successfully!';
  RAISE NOTICE 'Tables created: analytics_events';
  RAISE NOTICE 'Materialized view: analytics_summary';
  RAISE NOTICE 'Helper functions: get_conversion_rate(), get_top_listings()';
  RAISE NOTICE 'Navigate to /dashboard/analytics to see your conversion funnel!';
END $$;

