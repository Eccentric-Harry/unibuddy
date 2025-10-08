# PR: Fix Marketplace Listing Creation (500 Error)

## Branch
`feature/marketplace-fix`

## Problem Statement
The POST `/api/listings` endpoint was failing with a 500 error when users attempted to create marketplace listings through the frontend UI.

## Root Cause Analysis

### Original Error
The issue was caused by a **content-type mismatch** between the frontend and backend:

1. **Frontend (`api.ts`)**: The `marketplaceApi.createListing()` function was configured to send `multipart/form-data`:
   ```typescript
   createListing: (data: FormData): Promise<AxiosResponse<ListingResponse>> =>
     api.post('/listings', data, {
       headers: { 'Content-Type': 'multipart/form-data' },
     }),
   ```

2. **Backend (`ListingController.java`)**: The controller expected JSON with `@RequestBody ListingCreateRequest`:
   ```java
   @PostMapping
   public ResponseEntity<ListingResponse> createListing(
       @Valid @RequestBody ListingCreateRequest request,
       @AuthenticationPrincipal User user) {
   ```

3. **Frontend Flow (`CreateListingModal.tsx`)**: The component was already uploading images separately via `/api/storage/upload` and then calling `createListing()` with a JSON payload containing image URLs.

This mismatch caused the backend to reject requests because:
- The frontend sent JSON data
- But the API client tried to set `Content-Type: multipart/form-data` headers
- The backend expected JSON and couldn't parse the malformed request

## Solution Implemented

### Client-First Upload Flow
The fix implements a **client-first image upload pattern**:

1. **Frontend uploads images** to Supabase Storage via `/api/storage/upload` endpoint
2. **Backend StorageService** handles upload using Supabase REST API with service role key
3. **Frontend receives** image URLs, paths, and metadata
4. **Frontend sends JSON** payload to `/api/listings` with pre-uploaded image data
5. **Backend saves** listing record with JSONB images column

### Changes Made

#### 1. Frontend: Fixed API Client (`frontend/src/services/api.ts`)
**Before:**
```typescript
createListing: (data: FormData): Promise<AxiosResponse<ListingResponse>> =>
  api.post('/listings', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
```

**After:**
```typescript
createListing: (data: ListingCreateRequest): Promise<AxiosResponse<ListingResponse>> =>
  api.post('/listings', data),
```

**Why:** Removed incorrect `multipart/form-data` header and changed parameter type to match the actual JSON payload being sent.

#### 2. Backend: Already Correct
The backend implementation was already correct:
- ✅ `ListingController` accepts `@RequestBody ListingCreateRequest` (JSON)
- ✅ `ListingService` saves listing with pre-uploaded image metadata
- ✅ `StorageService` handles image uploads to Supabase with service role key
- ✅ Database migrations include JSONB column for images
- ✅ Proper validation and error handling

#### 3. New Integration Test (`backend/src/test/java/.../ListingControllerIntegrationTest.java`)
Added comprehensive controller-level tests:
- ✅ `createListing_WithValidJsonPayload_ReturnsCreated()` - Tests successful listing creation
- ✅ `createListing_WithoutAuthentication_ReturnsUnauthorized()` - Tests auth requirement
- ✅ `createListing_WithInvalidData_ReturnsBadRequest()` - Tests validation

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Upload images
       ▼
┌─────────────────────────────┐
│ POST /api/storage/upload    │
│ (multipart/form-data)       │
└──────┬──────────────────────┘
       │
       │ 2. Backend uploads to Supabase
       ▼
┌─────────────────────────────┐
│  Supabase Storage API       │
│  (service role key auth)    │
└──────┬──────────────────────┘
       │
       │ 3. Returns URLs
       ▼
┌─────────────┐
│   Browser   │ 4. Sends JSON with image URLs
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ POST /api/listings          │
│ (application/json)          │
│ {                           │
│   title, description,       │
│   price, category,          │
│   images: [{url,path,alt}]  │
│ }                           │
└──────┬──────────────────────┘
       │
       │ 5. Save to database
       ▼
┌─────────────────────────────┐
│  PostgreSQL (Supabase)      │
│  listings table (JSONB)     │
└─────────────────────────────┘
```

## Environment Variables Required

### Backend (`application.properties`)
Already configured:
```properties
supabase.url=https://fdeadgzxjuqevlohtvsl.supabase.co
supabase.service-role-key=eyJhbGc...
supabase.storage.bucket=listing-images
```

### Frontend (`.env`)
```env
VITE_SUPABASE_URL=https://fdeadgzxjuqevlohtvsl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=http://localhost:8080/api
```

## Testing

### Manual Testing
1. ✅ Start backend: `./mvnw spring-boot:run`
2. ✅ Start frontend: `npm run dev`
3. ✅ Login with verified college user
4. ✅ Navigate to Marketplace
5. ✅ Click "Create Listing"
6. ✅ Fill form with title, description, price, category
7. ✅ Upload 1-5 images (JPEG/PNG/WebP, max 5MB each)
8. ✅ Submit - should return 201 Created
9. ✅ Verify listing appears in marketplace grid
10. ✅ Verify images display correctly

### Automated Testing
Run integration tests:
```bash
cd backend
./mvnw test -Dtest=ListingControllerIntegrationTest
./mvnw test -Dtest=ListingServiceIntegrationTest
```

### API Testing with curl
```bash
# Get auth token first (login)
TOKEN="your-jwt-token"

# Create listing
curl -X POST http://localhost:8080/api/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MacBook Pro 2020",
    "description": "Excellent condition, rarely used, comes with charger and case",
    "price": 899.99,
    "category": "electronics",
    "images": [
      {
        "url": "https://fdeadgzxjuqevlohtvsl.supabase.co/storage/v1/object/public/listing-images/user-id/123-abc.jpg",
        "path": "user-id/123-abc.jpg",
        "alt": "MacBook Pro front view"
      }
    ]
  }'
```

Expected response: `201 Created` with listing data

## Files Changed

### Modified
- ✅ `frontend/src/services/api.ts` - Fixed createListing API call signature

### Added
- ✅ `backend/src/test/java/com/unibuddy/collegeBuddy/controller/ListingControllerIntegrationTest.java` - New integration test

### Unchanged (Already Correct)
- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/controller/ListingController.java`
- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/service/ListingService.java`
- ✅ `backend/src/main/java/com/unibuddy/collegeBuddy/service/StorageService.java`
- ✅ `frontend/src/components/marketplace/CreateListingModal.tsx`
- ✅ Database migrations (V1__Create_marketplace_tables.sql)

## Verification Checklist

- [x] Backend compiles without errors
- [x] Backend starts successfully on port 8080
- [x] StorageService initializes with Supabase service role key
- [x] Database migrations applied (version 3)
- [x] Integration tests created for listing creation
- [x] Frontend API client fixed to send JSON
- [x] No breaking changes to existing functionality
- [x] Client-first upload flow working end-to-end

## TODO / Notes

### Storage Bucket Setup
Ensure the Supabase storage bucket exists:
1. Go to Supabase Dashboard → Storage
2. Create bucket named `listing-images` if not exists
3. Set bucket to **public** (or implement signed URLs for private)
4. Configure CORS for frontend domain

### Future Improvements
- [ ] Add image optimization/compression on backend
- [ ] Implement signed URLs for private listings
- [ ] Add bulk image upload endpoint
- [ ] Add progress tracking for multi-image uploads
- [ ] Add image deletion when listing is deleted
- [ ] Add retry logic for failed uploads

## Summary

**The 500 error was caused by a content-type mismatch.** The frontend was trying to send JSON data but the API client wrapper incorrectly set `Content-Type: multipart/form-data`. The fix was simple: update `api.ts` to correctly send JSON requests to `/api/listings`.

The backend was already correctly implemented with:
- Proper StorageService using Supabase REST API
- Client-first upload pattern
- JSON-based listing creation
- JSONB storage for image metadata

**Impact:** This fix restores marketplace listing creation functionality with zero breaking changes.

