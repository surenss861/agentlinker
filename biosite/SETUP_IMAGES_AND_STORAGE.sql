-- ============================================
-- COMPLETE IMAGE & STORAGE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Fix listings status constraint to allow 'draft'
-- -------------------------------------------------------
ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_status_check;
ALTER TABLE listings ADD CONSTRAINT listings_status_check 
CHECK (status IN ('active', 'pending', 'sold', 'draft'));

-- Step 2: Create storage bucket for listing images
-- -------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set up RLS policies for listings bucket
-- -------------------------------------------------------

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own listing images" ON storage.objects;

-- Allow authenticated users to upload their own listing images
CREATE POLICY "Users can upload listing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to listing images
CREATE POLICY "Public can view listing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listings');

-- Allow users to update their own listing images
CREATE POLICY "Users can update their own listing images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own listing images
CREATE POLICY "Users can delete their own listing images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'listings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Step 4: Clean up old placeholder listings (optional)
-- -------------------------------------------------------
-- Uncomment the line below if you want to delete listings with placeholder images
-- DELETE FROM listings WHERE images::text LIKE '%via.placeholder.com%';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'listings';

-- Check if policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%listing%';

-- Check status constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'listings'::regclass 
AND conname = 'listings_status_check';

