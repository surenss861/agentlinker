-- Debug and clean up bookings table
-- This script will help us see what's in the bookings table and clean up test data

-- 1. Check what bookings exist
SELECT 
  id,
  user_id,
  client_name,
  client_email,
  scheduled_at,
  duration,
  status,
  created_at
FROM bookings 
ORDER BY created_at DESC;

-- 2. Count total bookings
SELECT COUNT(*) as total_bookings FROM bookings;

-- 3. Check bookings by status
SELECT 
  status,
  COUNT(*) as count
FROM bookings 
GROUP BY status;

-- 4. If you want to clear all test bookings (uncomment the line below)
-- DELETE FROM bookings WHERE status = 'pending' OR status = 'test';

-- 5. Check if there are any bookings blocking the current week
SELECT 
  id,
  client_name,
  scheduled_at,
  duration,
  status,
  EXTRACT(DOW FROM scheduled_at) as day_of_week
FROM bookings 
WHERE scheduled_at >= '2025-10-13' 
  AND scheduled_at < '2025-10-20'
ORDER BY scheduled_at;
