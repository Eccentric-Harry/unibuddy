# College Marketplace Image Upload Fix - Implementation Summary

## Problem Analysis

The original implementation had the following issues:
1. **Images were uploaded to Supabase Storage** instead of local filesystem
2. **"blob" text was displayed** instead of actual images
3. **Images weren't persisted** in the resources directory

## Solution Implemented

### Backend Changes

#### 1. Updated `StorageService.java` (Local File Storage)
**Location:** `/backend/src/main/java/com/unibuddy/collegeBuddy/service/StorageService.java`

**Changes:**
- Removed Supabase REST API integration
- Implemented local filesystem storage using Java NIO
- Files are saved to `uploads/{userId}/{timestamp-uuid}.{extension}`
- Returns URL in format: `http://localhost:8080/uploads/{userId}/{filename}`

**Key Features:**
- ✅ Validates file type (JPEG, PNG, WebP only)
- ✅ Validates file size (5MB max)
- ✅ Creates user-specific directories
- ✅ Generates unique filenames to prevent conflicts
- ✅ Returns proper URLs for frontend consumption

#### 2. Updated `WebConfig.java` (Static File Serving)
**Location:** `/backend/src/main/java/com/unibuddy/config/WebConfig.java`

**Changes:**
- Configured Spring to serve static files from `uploads/` directory
- Maps `/uploads/**` URLs to physical filesystem location
- Sets appropriate cache headers (1 hour)
- Auto-creates upload directory on startup

**Key Features:**
- ✅ Serves files from absolute path (not classpath)
- ✅ CORS configuration for frontend access
- ✅ Automatic directory creation
- ✅ Logging for debugging

### How It Works

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Upload image (multipart/form-data)
       ▼
┌─────────────────────────────┐
│ POST /api/storage/upload    │
│ StorageController           │
└──────┬──────────────────────┘
       │
       │ 2. Save to filesystem
       ▼
┌─────────────────────────────┐
│  StorageService             │
│  → uploads/userId/file.jpg  │
└──────┬──────────────────────┘
       │
       │ 3. Return metadata
       │    { url, path, alt }
       ▼
┌─────────────┐
│   Browser   │ 4. Create listing with image URLs
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ POST /api/listings          │
│ (JSON with image URLs)      │
└─────────────────────────────┘
```

### File Structure

```
backend/
├── uploads/                          # Upload directory (auto-created)
│   └── {user-id}/                   # User-specific folder
│       └── {timestamp}-{uuid}.jpg   # Uploaded images
│
└── src/main/java/com/unibuddy/
    ├── config/
    │   └── WebConfig.java           # ✅ Updated - Static file serving
    └── collegeBuddy/
        ├── service/
        │   └── StorageService.java  # ✅ Updated - Local storage
        └── controller/
            └── StorageController.java # Unchanged - Uses StorageService
```

## Testing Instructions

### 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

**Expected Logs:**
```
✓ Upload directory created/verified at: /path/to/backend/uploads
✓ Serving static files from: /path/to/backend/uploads
✓ Static resource handler configured: /uploads/** -> /path/to/backend/uploads
✓ CORS configured for: http://localhost:5173
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Image Upload Flow

1. **Login** with a verified college user
2. **Navigate to Marketplace** (`/marketplace`)
3. **Click "Create Listing"** button
4. **Fill in the form:**
   - Title: "Test Product"
   - Description: "This is a test listing to verify image upload"
   - Price: 100
   - Category: Books
   - **Upload 1-3 images** (JPEG/PNG, max 5MB each)
5. **Submit** the form

### 4. Verify Image Upload

#### Backend Verification:
```bash
# Check if files were created
ls -la backend/uploads/<user-id>/

# Example output:
# -rw-r--r--  1 user  staff  123456 Nov 8 15:44 1699445678123-abc12345.jpg
```

#### Frontend Verification:
- Images should display in the listing card (not "blob" text)
- Clicking on image should open enlarged view in modal
- Images should load from `http://localhost:8080/uploads/...`

#### Browser DevTools:
```
Network Tab → Filter: images
Should see: GET http://localhost:8080/uploads/{userId}/{filename}.jpg → 200 OK
```

## API Endpoints

### Upload Single Image
```http
POST /api/storage/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: <image file>

Response:
{
  "url": "http://localhost:8080/uploads/{userId}/{filename}.jpg",
  "path": "{userId}/{filename}.jpg",
  "alt": "original-filename"
}
```

### Upload Multiple Images
```http
POST /api/storage/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- files: <array of image files>

Response:
{
  "uploaded": [
    { "url": "...", "path": "...", "alt": "..." },
    { "url": "...", "path": "...", "alt": "..." }
  ],
  "errors": []
}
```

### View Image (Static)
```http
GET /uploads/{userId}/{filename}.jpg
Response: Image file (served by Spring Static Resources)
```

## Troubleshooting

### Issue: "File not found" or 404 errors

**Check:**
1. Upload directory exists: `ls backend/uploads/`
2. Files have correct permissions: `ls -la backend/uploads/*/`
3. Backend logs show: `✓ Serving static files from: ...`

**Fix:**
```bash
cd backend
mkdir -p uploads
chmod 755 uploads
```

### Issue: Images not displaying in frontend

**Check:**
1. Browser DevTools → Network tab → Filter by "img"
2. Verify URLs are: `http://localhost:8080/uploads/...` (not Supabase URLs)
3. Check CORS headers in response

**Fix:**
- Restart backend to reload WebConfig
- Clear browser cache
- Verify `app.base-url` in `application.properties`

### Issue: "blob" text still appearing

**This indicates the image URL is a blob URL instead of server URL**

**Check:**
1. Frontend is using correct API endpoint: `/api/storage/upload`
2. Backend returns proper JSON: `{ url: "http://...", path: "...", alt: "..." }`
3. Frontend stores `response.data.url` in listing

**Debug:**
```javascript
// In CreateListingModal.tsx, add console.log:
const response = await api.post('/storage/upload', formData);
console.log('Upload response:', response.data); // Should show server URL, not blob
```

## Configuration

### application.properties
```properties
# Upload directory (relative to backend root)
app.upload.dir=uploads

# Base URL for generating image URLs
app.base-url=http://localhost:8080

# Frontend URL for CORS
app.frontend-url=http://localhost:5173
```

## Database Schema

The `listings` table stores image metadata as JSONB:

```sql
-- images column structure
images JSONB

-- Example data:
[
  {
    "url": "http://localhost:8080/uploads/user-id/1699445678123-abc12345.jpg",
    "path": "user-id/1699445678123-abc12345.jpg",
    "alt": "product-image"
  },
  {
    "url": "http://localhost:8080/uploads/user-id/1699445678456-def67890.jpg",
    "path": "user-id/1699445678456-def67890.jpg",
    "alt": "product-detail"
  }
]
```

## Security Considerations

1. **File Type Validation:** Only JPEG, PNG, WebP allowed
2. **File Size Limit:** 5MB maximum per file
3. **Path Traversal Prevention:** Files are resolved relative to upload directory
4. **User Isolation:** Files stored in user-specific directories
5. **Unique Filenames:** Prevents file overwrites and conflicts

## Production Deployment Notes

For production, consider:

1. **Use external storage** (AWS S3, Cloudflare R2, etc.)
2. **CDN integration** for better performance
3. **Image optimization** (compression, WebP conversion)
4. **Backup strategy** for uploaded files
5. **Monitoring** for storage usage
6. **Rate limiting** on upload endpoints

## Files Modified

- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/service/StorageService.java`
- ✅ `backend/src/main/java/com/unibuddy/config/WebConfig.java`
- 🗑️ `backend/src/main/java/com/unibuddy/collegeBuddy/config/WebConfig.java` (deleted duplicate)

## Files Unchanged

- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/controller/StorageController.java`
- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/controller/ListingController.java`
- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/service/ListingService.java`
- ✅ `frontend/src/components/marketplace/CreateListingModal.tsx`
- ✅ `frontend/src/services/api.ts`

---

**Implementation Date:** November 8, 2025
**Status:** ✅ Complete and Tested
