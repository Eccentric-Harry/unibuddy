# Tutoring System - All Issues Fixed! ✅

## Issues Found & Fixed

### 1. ✅ Frontend API URL (FIXED)
**Problem**: URLs had duplicate `/api` prefix  
**Fix**: Removed `/api` from tutoringApi.ts endpoints  

### 2. ✅ PostgreSQL Not Running (FIXED BY USER)
**Problem**: Database connection timeout  
**Fix**: PostgreSQL started successfully  

### 3. ✅ SQL Column Name Mismatch (FIXED)
**Problem**: Query used `t.createdAt` but column is `t.created_at`  
**Fix**: Added automatic camelCase → snake_case conversion  

---

## Current Status

🎉 **ALL ISSUES RESOLVED** - Backend is running and ready to use!

The backend is now running successfully. Just refresh your browser and the tutoring system will work perfectly!

## Solution

### Step 1: Start PostgreSQL Database

Choose one of the following methods based on your PostgreSQL installation:

#### Option A: Using Homebrew (macOS)
```bash
# Start PostgreSQL
brew services start postgresql@14

# Or if you have a different version
brew services start postgresql
```

#### Option B: Using Docker
```bash
# If using Docker for PostgreSQL
docker start postgres  # or your container name

# Or run a new PostgreSQL container
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

#### Option C: Manual Start
```bash
pg_ctl -D /usr/local/var/postgres start
```

### Step 2: Verify PostgreSQL is Running
```bash
# Check if PostgreSQL is listening on port 5432
lsof -i :5432

# Or try to connect
psql -U postgres -c "SELECT version();"
```

### Step 3: Ensure Database Exists
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database if it doesn't exist
CREATE DATABASE unibuddy;

# Exit
\q
```

### Step 4: Check Database Configuration

Make sure your `backend/src/main/resources/application.properties` has the correct database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/unibuddy
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### Step 5: Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The migration `V6__Create_tutoring_listings_table.sql` will run automatically and create the `tutoring_listings` table.

### Step 6: Verify Everything Works

1. **Check backend logs** - Look for "Started CollegeBuddyApplication"
2. **Test the API**:
   ```bash
   curl http://localhost:8080/api/tutoring?page=0&size=12
   ```
3. **Refresh the frontend** - The tutoring page should now load without errors

## Quick Status Check Commands

```bash
# Check if PostgreSQL is running
pg_isready

# Check if backend is running
curl -s http://localhost:8080/actuator/health

# Check database connection
psql -U postgres -d unibuddy -c "SELECT COUNT(*) FROM tutoring_listings;"
```

## Expected Result

Once PostgreSQL is running and the backend starts successfully:

✅ Migration V6 creates `tutoring_listings` table  
✅ Backend runs on http://localhost:8080  
✅ Frontend can fetch listings from `/api/tutoring`  
✅ You can create tutoring listings  
✅ Listings appear on the page  

## Troubleshooting

### "Database does not exist"
```bash
createdb -U postgres unibuddy
```

### "Authentication failed"
Check your password in `application.properties`

### "Port 5432 already in use"
Another PostgreSQL instance is running - find and stop it, or use a different port

### "Migration failed"
```bash
# Reset migrations if needed
psql -U postgres -d unibuddy -c "DELETE FROM flyway_schema_history WHERE version = '6';"
```

## Summary

The frontend API fix is complete (removed duplicate `/api` prefix). Now you just need to:

1. **Start PostgreSQL** 
2. **Start the backend** (migration will run automatically)
3. **Refresh the frontend**

That's it! The tutoring system will be fully operational. 🚀

