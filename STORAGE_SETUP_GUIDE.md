# Image Upload Fix - Setup Guide

## What Was Fixed

### Issues Resolved
1. ✅ **Fixed `_availability` table error** - Replaced with proper storage bucket connection test
2. ✅ **Fixed "Not authenticated" error** - Implemented server-side upload using backend authentication
3. ✅ **Removed direct Supabase client uploads** - Now using secure backend endpoint with S3 credentials

### Changes Made

#### Backend (Java/Spring Boot)
1. **Created `StorageService.java`** - Handles secure image uploads to Supabase Storage using S3 API
   - Location: `/backend/src/main/java/com/unibuddy/collegeBuddy/service/StorageService.java`
   - Uses AWS S3 SDK to upload files
   - Validates file type (JPEG, PNG, WebP) and size (max 5MB)
   - Generates unique file paths with user ID

2. **Created `StorageController.java`** - REST API endpoints for image uploads
   - Location: `/backend/src/main/java/com/unibuddy/collegeBuddy/controller/StorageController.java`
   - Endpoints:
     - `POST /api/storage/upload` - Upload single image
     - `POST /api/storage/upload-multiple` - Upload multiple images (max 5)
     - `DELETE /api/storage/delete` - Delete an image

3. **Updated `application.properties`** - Changed bucket name to `listing-images`

#### Frontend (React/TypeScript)
1. **Updated `supabase.ts`** - Fixed connection test to use storage bucket listing
   - Removed the `_availability` table query that was causing 404 errors
   
2. **Updated `api.ts`** - Added `storageApi` with upload functions
   - `uploadImage(file)` - Upload single file to backend
   - `uploadMultipleImages(files)` - Upload multiple files
   - `deleteImage(path)` - Delete file

3. **Updated `CreateListingModal.tsx`** - Changed to use backend upload endpoint
   - Now uploads compressed images to backend instead of directly to Supabase
   - Better error handling and user feedback

## Setup Instructions

### Step 1: Verify Supabase Storage Bucket

You need to create a storage bucket in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage** → **Buckets**
3. Create a new bucket named: `listing-images`
4. **Bucket settings:**
   - Public bucket: **Yes** (for public image URLs)
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Step 2: Verify Supabase S3 Credentials

Your backend is configured with S3 credentials. Verify they're correct in `application.properties`:

```properties
supabase.s3.endpoint=https://fdeadgzxjuqevlohtvsl.storage.supabase.co/storage/v1/s3
supabase.s3.access-key=a21488ec5bc2edab581eaf3778f8c005
supabase.s3.secret-key=3f6efc054c79e8919076455af554e6ee5d5c9a0a86dc5cc0b7e7383716bdd441
```

**To get these credentials:**
1. Supabase Dashboard → **Settings** → **API**
2. Scroll to **S3 Access Keys** section
3. Copy the Access Key ID and Secret Access Key

### Step 3: Build and Run

#### Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend should start on `http://localhost:8080`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 4: Test Image Upload

1. **Login to your application**
2. **Go to Marketplace** → Click "Create Listing"
3. **Fill in the form:**
   - Title (min 5 characters)
   - Description (min 20 characters)
   - Price
   - Category
   - Upload 1-5 images (JPG, PNG, or WebP, max 5MB each)
4. **Submit** - Images will be compressed, uploaded to backend, then to Supabase Storage
5. **Verify** - Check your Supabase Storage bucket to see uploaded images

## How It Works Now

### Upload Flow
```
User selects images
    ↓
Frontend compresses images (max 1MB, 1200px)
    ↓
Frontend sends to backend (/api/storage/upload)
    ↓
Backend authenticates user (JWT token)
    ↓
Backend uploads to Supabase Storage (using S3 API with service credentials)
    ↓
Backend returns public URL
    ↓
Frontend creates listing with image URLs
```

### Security Benefits
- ✅ **No client-side credentials** - Frontend doesn't need Supabase service key
- ✅ **Authenticated uploads** - Only logged-in users can upload
- ✅ **Server-side validation** - File type and size checked on backend
- ✅ **User isolation** - Images organized by user ID folder

## Troubleshooting

### Error: "Storage bucket 'listing-images' not found"
**Solution:** Create the bucket in Supabase Dashboard (see Step 1)

### Error: "Invalid file type" or "File size exceeds maximum"
**Solution:** Ensure images are JPEG/PNG/WebP and under 5MB

### Error: "Authentication error"
**Solution:** Make sure you're logged in and the JWT token is valid

### Error: Backend S3 connection fails
**Solution:** Verify S3 credentials in `application.properties` are correct

### Images upload but don't show in listing
**Solution:** Check the public URL format and bucket permissions in Supabase

### Check Backend Logs
```bash
cd backend
./mvnw spring-boot:run
```
Look for `StorageService` and `StorageController` log messages

### Check Frontend Console
Open browser DevTools → Console
Look for upload progress and error messages

## API Documentation

### POST /api/storage/upload
Upload a single image file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (File)
- Auth: Required (Bearer token)

**Response:**
```json
{
  "url": "https://fdeadgzxjuqevlohtvsl.supabase.co/storage/v1/object/public/listing-images/user-id/timestamp-uuid.jpg",
  "path": "user-id/timestamp-uuid.jpg",
  "alt": "filename"
}
```

### POST /api/storage/upload-multiple
Upload multiple images (max 5).

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `files` (File[])
- Auth: Required (Bearer token)

**Response:**
```json
{
  "uploaded": [
    {
      "url": "...",
      "path": "...",
      "alt": "..."
    }
  ],
  "errors": []
}
```

### DELETE /api/storage/delete
Delete an uploaded image.

**Request:**
- Method: `DELETE`
- Query param: `path` (string)
- Auth: Required (Bearer token)

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Next Steps

1. ✅ Create `listing-images` bucket in Supabase
2. ✅ Verify S3 credentials are correct
3. ✅ Restart backend server
4. ✅ Test image upload in marketplace
5. Optional: Set up image optimization/CDN for production
6. Optional: Add image moderation/scanning for inappropriate content

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify Supabase bucket exists and has correct permissions
3. Check backend logs for detailed error messages
4. Verify you're logged in with a valid session

