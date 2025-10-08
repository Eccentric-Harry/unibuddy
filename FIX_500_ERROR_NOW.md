# URGENT: Fix 500 Error - Missing Supabase Service Role Key

## ⚠️ ROOT CAUSE IDENTIFIED

Your `application.properties` file has:
```properties
supabase.service-role-key=YOUR_SERVICE_ROLE_KEY_HERE
```

This placeholder is causing the 500 error because the backend can't authenticate with Supabase!

## 🔧 IMMEDIATE FIX (2 minutes)

### Step 1: Get Your Supabase Service Role Key

1. **Open [Supabase Dashboard](https://app.supabase.com/project/fdeadgzxjuqevlohtvsl)**

2. **Click Settings → API** (in left sidebar)

3. **Scroll to "Project API keys" section**

4. **Find and copy the `service_role` key**
   - It's labeled **"service_role secret"**
   - It starts with `eyJ...` and is VERY long
   - ⚠️ Do NOT use the "anon public" key - that won't work!

### Step 2: Update application.properties

Open: `/backend/src/main/resources/application.properties`

Find line 34 and replace:
```properties
supabase.service-role-key=YOUR_SERVICE_ROLE_KEY_HERE
```

With:
```properties
supabase.service-role-key=eyJhbGciOi...YOUR_ACTUAL_SERVICE_KEY_HERE
```

**Save the file!**

### Step 3: Create the Storage Bucket (if not done)

1. **Supabase Dashboard → Storage → Buckets**
2. **Click "New Bucket"**
3. **Settings:**
   - Name: `listing-images` (exact spelling!)
   - Public bucket: **ON** (toggle enabled)
   - File size limit: 5 MB
   - Allowed MIME types: `image/*`
4. **Click "Create bucket"**

### Step 4: Restart Backend

```bash
# Stop the current backend (Ctrl+C if running)
cd /Users/eccentricharry/Projects/UniBuddy/backend
./mvnw spring-boot:run
```

**Look for this in the logs:**
```
✓ Supabase service role key is configured
StorageService initialized with bucket: listing-images
```

If you see:
```
⚠️ CRITICAL: Supabase service role key is not configured!
```
Then the key is still wrong!

### Step 5: Test Upload

1. **Login to your app**
2. **Marketplace → Create Listing**
3. **Fill form and upload image**
4. **Should work now!** ✅

## 🧪 Test From Terminal (Optional but Recommended)

This tests if your service key works directly with Supabase:

```bash
# Replace <YOUR_SERVICE_ROLE_KEY> with your actual key
curl -v -X POST \
  "https://fdeadgzxjuqevlohtvsl.supabase.co/storage/v1/object/listing-images/test-upload.jpg" \
  -H "Authorization: Bearer <YOUR_SERVICE_ROLE_KEY>" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/test-image.jpg"
```

**Expected result:** 
- Status: 200 or 201
- Response: JSON with upload details

**If you get 404:** Bucket doesn't exist
**If you get 403:** Service key is wrong
**If you get 200:** Everything is working! 🎉

## 📋 What I Fixed in StorageService.java

I updated the code to:

1. ✅ **Check if service key is configured on startup**
   - Logs clear warning if key is missing
   
2. ✅ **Validate service key before upload**
   - Throws helpful error: "Supabase service role key is not configured"
   
3. ✅ **Better error handling**
   - Catches specific Supabase errors (bucket not found, permission denied)
   - Logs detailed information for debugging
   
4. ✅ **Improved logging**
   - Shows upload URL, file details, and response status
   - Easier to debug issues

## 🔍 How to Check Logs

When you restart the backend, watch for:

```
StorageService initialized with bucket: listing-images and URL: https://fdeadgzxjuqevlohtvsl.supabase.co
✓ Supabase service role key is configured
```

When you try to upload, you'll see:

**Success:**
```
Uploading file to: https://fdeadgzxjuqevlohtvsl.supabase.co/storage/v1/object/listing-images/...
Supabase response status: 200 OK
✓ File uploaded successfully: https://...
```

**Error (if key still wrong):**
```
⚠️ CRITICAL: Supabase service role key is not configured! Uploads will fail.
```

**Error (if bucket doesn't exist):**
```
Supabase client error (404): {"error":"Bucket not found"}
Storage bucket 'listing-images' not found. Please create it in Supabase dashboard.
```

## 🎯 Summary

**The 500 error is because:**
- Your service role key is set to placeholder text
- Backend can't authenticate with Supabase
- Upload request fails

**To fix:**
1. Get service role key from Supabase Dashboard
2. Update application.properties line 34
3. Create bucket (if missing)
4. Restart backend
5. Test upload

**Total time: ~2 minutes** ⏱️

Once you add the real service role key, the 500 error will disappear!

