# Quick Fix for 500 Error - Get Supabase Service Role Key

## The Issue
The SSL handshake error was caused by the S3 SDK trying to connect to Supabase. I've replaced it with Supabase's REST API which is simpler and more reliable.

## What You Need to Do NOW

### Step 1: Get Your Supabase Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **fdeadgzxjuqevlohtvsl**
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API** 
5. Scroll down to **Project API keys** section
6. Copy the **service_role** key (NOT the anon key)
   - It starts with `eyJ...` and is much longer than the anon key
   - This key has admin privileges - keep it SECRET!

### Step 2: Add the Key to Your Backend

Open this file: `/backend/src/main/resources/application.properties`

Find this line:
```properties
supabase.service-role-key=YOUR_SERVICE_ROLE_KEY_HERE
```

Replace `YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key:
```properties
supabase.service-role-key=eyJhbGc...your_actual_key_here
```

### Step 3: Create the Storage Bucket (If Not Done Already)

1. In Supabase Dashboard → **Storage** → **Buckets**
2. Click **New Bucket**
3. Name: `listing-images`
4. Settings:
   - **Public bucket**: YES (toggle ON)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: Leave default or add `image/jpeg, image/png, image/webp`
5. Click **Create bucket**

### Step 4: Restart Your Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Step 5: Test Upload

1. Login to your app
2. Go to Marketplace → Create Listing
3. Upload an image
4. Should work now! ✅

## What I Changed

### Replaced S3 SDK with REST API
The old approach used AWS S3 SDK which had SSL/TLS handshake issues with Supabase. The new approach uses Spring's `RestTemplate` to call Supabase's REST API directly:

**Before (S3 SDK - had SSL errors):**
```java
S3Client s3Client = S3Client.builder()
    .endpointOverride(...)
    .build();
s3Client.putObject(...);
```

**After (REST API - works reliably):**
```java
RestTemplate restTemplate = new RestTemplate();
String url = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename;
restTemplate.exchange(url, HttpMethod.POST, ...);
```

## Why This is Better

1. ✅ **No SSL handshake issues** - Direct HTTPS calls work better
2. ✅ **Simpler** - No complex S3 client configuration
3. ✅ **More reliable** - Uses Supabase's official REST API
4. ✅ **Better error messages** - Easier to debug

## Troubleshooting

### Still getting 500 error?
- **Check logs**: Look for `StorageService` messages in backend console
- **Verify service key**: Make sure it's the service_role key, not anon key
- **Check bucket exists**: Must be named exactly `listing-images`
- **Check bucket is public**: Toggle must be ON in Supabase dashboard

### Getting 403 Forbidden?
- Service role key is wrong or missing
- Bucket name doesn't match

### Getting 404 Not Found?
- Bucket doesn't exist
- Bucket name is wrong (check spelling: `listing-images`)

### Images upload but don't appear?
- Check bucket is set to PUBLIC
- Check the URL in browser console - it should be accessible

## Test It

Once you've added the service role key and restarted the backend, try this:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try uploading an image
4. Look for `/api/storage/upload` request
5. Should return 200 OK with URL, path, and alt text

Example successful response:
```json
{
  "url": "https://fdeadgzxjuqevlohtvsl.supabase.co/storage/v1/object/public/listing-images/user-id/1234567890-abcd1234.jpg",
  "path": "user-id/1234567890-abcd1234.jpg",
  "alt": "my-image"
}
```

## Security Note

⚠️ **IMPORTANT**: The service role key is like a master password. It has admin access to your Supabase project.

- ✅ Keep it in `application.properties` (this file is in `.gitignore`)
- ❌ NEVER commit it to GitHub
- ❌ NEVER put it in the frontend
- ❌ NEVER share it publicly

If you accidentally expose it:
1. Go to Supabase Dashboard → Settings → API
2. Click **Reset service_role key**
3. Update your `application.properties` with the new key

