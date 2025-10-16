# Fix Images & Listings - Complete Guide

## Issues Found
1. ❌ **Upload endpoint was returning placeholder URLs** instead of uploading to Supabase
2. ❌ **No storage bucket** for listing images
3. ❌ **Database constraint error** - 'draft' status not allowed in listings table

## ✅ What I Fixed

### 1. Fixed Upload Endpoint
Updated `app/api/upload/route.ts` to:
- Actually upload files to Supabase Storage
- Store files in `listings` bucket
- Return real Supabase Storage URLs

### 2. Created Storage Setup Script
File: `supabase-listings-storage.sql`
- Creates `listings` bucket
- Allows authenticated users to upload images
- Allows public read access
- Sets up proper RLS policies

### 3. Fixed Status Constraint
File: `fix-listings-status-constraint.sql`
- Adds 'draft' to allowed status values
- Fixes the check constraint error

## 🚀 Steps to Fix (Run in Order)

### Step 1: Fix Database Constraint
```bash
# Run this in Supabase SQL Editor
```
Copy and paste the contents of `fix-listings-status-constraint.sql`

### Step 2: Create Storage Bucket
```bash
# Run this in Supabase SQL Editor
```
Copy and paste the contents of `supabase-listings-storage.sql`

### Step 3: Verify Storage Bucket
1. Go to Supabase Dashboard
2. Click "Storage" in sidebar
3. You should see a "listings" bucket
4. Make sure it's set to "Public"

### Step 4: Test Upload
1. Go to http://localhost:3001/dashboard/listings
2. Click "Add Listing"
3. Upload an image
4. Check the Network tab - you should see:
   - POST to `/api/upload` returns a Supabase URL (not placeholder)
   - URL format: `https://kjmnomtndntstbhpdklv.supabase.co/storage/v1/object/public/listings/...`

### Step 5: Delete Old Placeholder Listings
The existing listings have placeholder URLs that won't work. Either:
- Delete them from the dashboard
- Or run this SQL to clean them up:
```sql
DELETE FROM listings WHERE images::text LIKE '%via.placeholder.com%';
```

### Step 6: Create New Listing with Real Images
1. Go to dashboard/listings
2. Add a new listing
3. Upload real images (PNG, JPG, WEBP)
4. Save the listing
5. Visit your agent page - images should now display!

## 🎯 Expected Result

After following these steps:
- ✅ Images upload to Supabase Storage
- ✅ Images display on agent profile page
- ✅ Images display in listings dashboard
- ✅ Draft status works correctly
- ✅ No more placeholder URL errors

## 🔍 Troubleshooting

### If images still don't show:
1. Check browser console for errors
2. Check Network tab - see if image URLs return 404
3. Verify storage bucket is public in Supabase dashboard
4. Check that RLS policies were created correctly

### If upload fails:
1. Check that `listings` bucket exists
2. Check that you're authenticated
3. Check file size (max 50MB)
4. Check file type (must be image)

### If draft error persists:
Run this to check current constraint:
```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'listings'::regclass 
AND conname = 'listings_status_check';
```

