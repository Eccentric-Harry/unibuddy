# Quick Fix - 400 Bad Request Error

## Problem
The frontend was sending `price` as a **string** (`"100.00"`), but the backend expects a **number** for `BigDecimal` conversion.

## Fix Applied

### File: `frontend/src/components/marketplace/CreateListingModal.tsx`
**Before:**
```typescript
price: Number(price).toFixed(2), // Returns string "100.00"
```

**After:**
```typescript
price: Number(price), // Returns number 100
```

### File: `frontend/src/types/marketplace.ts`
**Before:**
```typescript
price: string | number;
```

**After:**
```typescript
price: number;
```

## How to Test

1. **Restart Frontend** (if running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test the Flow:**
   - Login to your account
   - Go to Marketplace page
   - Click "Create Listing"
   - Fill in the form:
     - Title: "Test Book" (at least 5 characters)
     - Description: "This is a test listing to verify the fix works correctly" (at least 20 characters)
     - Price: 100 (any number > 0)
     - Category: Select any category
     - Images: Upload 1-3 images
   - Click "Create Listing"

3. **Expected Result:**
   - ✅ Success toast: "Listing created successfully"
   - ✅ Modal closes
   - ✅ New listing appears in marketplace
   - ✅ Images display correctly (not "blob")

4. **If Still Getting 400 Error:**
   - Check browser console for detailed error
   - Check backend logs for validation errors
   - Verify all fields meet requirements:
     - Title: 5-255 characters
     - Description: min 20 characters
     - Price: > 0
     - Category: not empty
     - Images: max 5 files, each max 5MB

## Backend Validation Requirements

According to `ListingCreateRequest.java`:

```java
@Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
private String title;

@Size(min = 20, message = "Description must be at least 20 characters")
private String description;

@DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
private BigDecimal price;

@NotBlank(message = "Category is required")
private String category;

@Size(max = 5, message = "Maximum 5 images allowed")
private List<ListingImageDto> images;
```

## Common Validation Errors

| Error Message | Cause | Fix |
|--------------|-------|-----|
| "Title must be between 5 and 255 characters" | Title too short/long | Use 5-255 characters |
| "Description must be at least 20 characters" | Description too short | Use at least 20 characters |
| "Price must be greater than 0" | Price is 0 or negative | Use positive number |
| "Category is required" | Category is empty | Select a category |
| "Maximum 5 images allowed" | Too many images | Upload max 5 images |

## Files Changed
- ✅ `frontend/src/components/marketplace/CreateListingModal.tsx`
- ✅ `frontend/src/types/marketplace.ts`
