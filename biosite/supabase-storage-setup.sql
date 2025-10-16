-- =====================================================
-- AgentLinker Storage Setup
-- Purpose: Create storage buckets for profile photos
-- =====================================================

-- 1. CREATE STORAGE BUCKET FOR PROFILE PHOTOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. SET UP STORAGE POLICIES

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own photos
CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all profile photos
CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- =====================================================
-- OPTIONAL: Add profile_photo_url column if it doesn't exist
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_photo_url TEXT;
  END IF;
END $$;

-- =====================================================
-- DONE! Now you can:
-- ✅ Upload profile photos via Settings page
-- ✅ Photos are stored in 'profile-photos' bucket
-- ✅ Each user can only manage their own photos
-- ✅ All profile photos are publicly accessible
-- =====================================================

SELECT 'Storage setup complete! Profile photo uploads are ready.' AS status;

