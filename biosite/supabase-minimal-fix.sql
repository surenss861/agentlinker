-- MINIMAL FIX: Just add the stripe_customer_id column
-- Run this FIRST in Supabase SQL Editor

-- Step 1: Add stripe_customer_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Step 2: Create index
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Step 3: Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'stripe_customer_id';
