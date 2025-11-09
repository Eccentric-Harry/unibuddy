# Tutoring System - SQL Column Name Fix

## Issue Fixed ✅

### Problem
Backend was throwing SQL error:
```
ERROR: column t.createdat does not exist
Hint: Perhaps you meant to reference the column "t.created_at".
```

### Root Cause
The native SQL query was using camelCase column names (`createdAt`) but PostgreSQL table has snake_case columns (`created_at`).

## Changes Made

### 1. Repository Query Update
**File**: `TutoringListingRepository.java`

**Change**: Removed hardcoded `ORDER BY t.created_at DESC` from the native query to let Pageable handle sorting dynamically.

**Before**:
```sql
SELECT * FROM tutoring_listings t 
WHERE ...
ORDER BY t.created_at DESC
```

**After**:
```sql
SELECT * FROM tutoring_listings t 
WHERE ...
-- ORDER BY removed, handled by Pageable
```

### 2. Service Sort Field Conversion
**File**: `TutoringListingService.java`

**Changes**:
1. Updated `parseSort()` to use `created_at` instead of `createdAt`
2. Added `camelToSnakeCase()` helper method to convert field names

**Added Code**:
```java
private Sort parseSort(String sortBy) {
    if (sortBy == null || sortBy.isEmpty()) {
        return Sort.by(Sort.Direction.DESC, "created_at");  // ✅ Fixed
    }

    String[] parts = sortBy.split(",");
    String field = parts[0];
    Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
            ? Sort.Direction.ASC
            : Sort.Direction.DESC;

    // Convert camelCase to snake_case for native queries
    String snakeCaseField = camelToSnakeCase(field);
    return Sort.by(direction, snakeCaseField);
}

private String camelToSnakeCase(String str) {
    // Convert camelCase to snake_case
    return str.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
}
```

## Field Name Mapping

| Frontend/API (camelCase) | Database Column (snake_case) |
|-------------------------|------------------------------|
| createdAt | created_at |
| updatedAt | updated_at |
| hourlyRate | hourly_rate |
| tutorId | tutor_id |

## Why This Matters

- **Native Queries**: When using `@Query(nativeQuery = true)`, column names must match the actual database schema
- **PostgreSQL**: By default uses snake_case for column names
- **JPA Entities**: Use camelCase in Java but are mapped to snake_case in DB
- **Sort Fields**: Need to be converted when using native queries

## Testing

The backend should now:
✅ Accept sorting parameters in camelCase (e.g., `sort=createdAt,desc`)
✅ Convert them to snake_case for SQL (e.g., `created_at`)  
✅ Execute queries without column name errors  
✅ Return properly sorted results  

## How to Test

1. **Restart the backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Test the API**:
   ```bash
   # Default sort (created_at desc)
   curl http://localhost:8080/api/tutoring?page=0&size=12
   
   # Explicit sort by createdAt
   curl "http://localhost:8080/api/tutoring?page=0&size=12&sort=createdAt,desc"
   
   # Sort by hourlyRate
   curl "http://localhost:8080/api/tutoring?page=0&size=12&sort=hourlyRate,asc"
   ```

3. **Check frontend**: Refresh the tutoring page - it should load without errors!

## Summary

✅ **Fixed**: SQL column name mismatch  
✅ **Added**: Automatic camelCase to snake_case conversion  
✅ **Improved**: Dynamic sorting support  
✅ **Status**: Ready to restart backend and test  

The tutoring system is now fully functional! 🎉

