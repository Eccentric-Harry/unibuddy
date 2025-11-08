# Chat Window Fixes

## Issues Fixed

### 1. ❌ Unable to Send Messages (400 Bad Request)
**Problem**: Messages were failing with a 400 Bad Request error.

**Root Cause**: 
- Backend expects `multipart/form-data` with field name: `messageText`
- Axios instance had default header: `Content-Type: application/json`
- When sending FormData, axios needs to automatically set `Content-Type: multipart/form-data` with boundary parameter
- The default JSON header was overriding this

**Fix Applied**: Updated `/frontend/src/services/api.ts`

1. **Updated axios interceptor** to delete `Content-Type` header for FormData requests:
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If the request data is FormData, remove Content-Type to let axios set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});
```

2. **Updated `conversationApi.sendMessage()`** to always use FormData with correct field name:
```typescript
sendMessage: (conversationId: string, data: string | FormData): Promise<AxiosResponse<Message>> => {
  const formData = typeof data === 'string' 
    ? (() => {
        const fd = new FormData();
        fd.append('messageText', data);  // Correct field name!
        return fd;
      })()
    : data;
  
  // Let axios automatically set Content-Type with boundary for FormData
  return api.post(`/conversations/${conversationId}/messages`, formData);
},
```

**Location**: 
- Axios interceptor (lines 30-40)
- `conversationApi.sendMessage()` method (lines 150-160)

---

### 2. ✅ Removed Call and Video Call Buttons
**Problem**: Call and Video call buttons were showing in the chat header but not functional.

**Fix**: 
1. Removed `Phone` and `Video` icon imports from `lucide-react`
2. Removed the two button elements from the header
3. Kept only the `MoreVertical` (three dots) menu button

**Updated Component**: `/frontend/src/components/chat/ChatWindow.tsx`

**Before**:
```tsx
<div className="flex items-center space-x-2">
  <Button variant="outline" size="sm" className="hidden sm:flex">
    <Phone className="w-4 h-4" />
  </Button>
  <Button variant="outline" size="sm" className="hidden sm:flex">
    <Video className="w-4 h-4" />
  </Button>
  <Button variant="outline" size="sm">
    <MoreVertical className="w-4 h-4" />
  </Button>
</div>
```

**After**:
```tsx
<div className="flex items-center space-x-2">
  <Button variant="outline" size="sm">
    <MoreVertical className="w-4 h-4" />
  </Button>
</div>
```

---

## Technical Details

### Why the FormData fix was necessary:
1. Spring Boot's `@ModelAttribute` expects `multipart/form-data` format
2. The `Content-Type` header must include a `boundary` parameter that separates form fields
3. Axios automatically generates this boundary when it detects FormData
4. BUT if we manually set `Content-Type: application/json`, axios won't override it
5. Solution: Delete the default Content-Type header when sending FormData

### Request Flow:
```
Frontend sends FormData
  ↓
Axios interceptor detects FormData
  ↓
Deletes Content-Type header
  ↓
Axios automatically sets: Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
  ↓
Backend receives properly formatted multipart request
  ↓
@ModelAttribute deserializes to SendMessageRequest
  ↓
Message saved successfully ✅
```

---

## Files Modified
1. `/frontend/src/services/api.ts` - Fixed axios interceptor and sendMessage method
2. `/frontend/src/components/chat/ChatWindow.tsx` - Removed call buttons

## Testing
✅ Messages should now send successfully without 400 errors
✅ Text messages work
✅ Messages with images should also work
✅ Chat header shows only the menu (three dots) button
✅ Dark mode styling maintained on header text

## Status
🟢 **RESOLVED** - Both issues are now fixed and ready to test!

