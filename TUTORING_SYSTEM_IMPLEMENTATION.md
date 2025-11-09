# Tutoring System Implementation

## Overview
This document describes the implementation of a complete tutoring listing system where students can offer informal/casual tutoring services to other students.

## Backend Implementation

### 1. Entity: `TutoringListing.java`
**Location**: `backend/src/main/java/com/unibuddy/collegeBuddy/entity/TutoringListing.java`

**Features**:
- UUID primary key
- Title, description, and hourly rate
- JSONB fields for subjects (with icons), syllabus, and availability
- Status enum: ACTIVE, BOOKED, INACTIVE
- Many-to-One relationship with User (tutor)
- Automatic timestamps (createdAt, updatedAt)

### 2. Repository: `TutoringListingRepository.java`
**Location**: `backend/src/main/java/com/unibuddy/collegeBuddy/repository/TutoringListingRepository.java`

**Features**:
- Advanced filtering with native queries
- Full-text search on title and description
- JSONB querying for subjects
- Price range filtering
- Status filtering
- Pagination support

### 3. DTOs
**Location**: `backend/src/main/java/com/unibuddy/collegeBuddy/dto/`

- **TutoringListingDTO**: Response DTO with tutor information
- **CreateTutoringListingRequest**: Request DTO for creating/updating listings

### 4. Service: `TutoringListingService.java`
**Location**: `backend/src/main/java/com/unibuddy/collegeBuddy/service/TutoringListingService.java`

**Features**:
- Create listing (requires email verification)
- Get listings with filters and pagination
- Get listing by ID
- Get user's own listings
- Update listing (owner only)
- Delete listing (owner only)
- Update status (owner only)
- Automatic subject icon assignment based on subject name
- Tutor info enrichment (rating, reviews - placeholders for future)

### 5. Controller: `TutoringListingController.java`
**Location**: `backend/src/main/java/com/unibuddy/collegeBuddy/controller/TutoringListingController.java`

**Endpoints**:
- `POST /api/tutoring` - Create a new tutoring listing
- `GET /api/tutoring` - Get all listings with filters
  - Query params: `minPrice`, `maxPrice`, `subject`, `query`, `status`, `page`, `size`, `sort`
- `GET /api/tutoring/{id}` - Get listing by ID
- `GET /api/tutoring/my-listings` - Get current user's listings
- `PUT /api/tutoring/{id}` - Update a listing
- `PATCH /api/tutoring/{id}/status` - Update listing status
- `DELETE /api/tutoring/{id}` - Delete a listing

### 6. Database Migration: `V6__Create_tutoring_listings_table.sql`
**Location**: `backend/src/main/resources/db/migration/V6__Create_tutoring_listings_table.sql`

**Features**:
- Creates `tutoring_listings` table
- JSONB columns for flexible data storage
- Foreign key to users table (ON DELETE CASCADE)
- Indexes for:
  - tutor_id
  - status
  - created_at
  - hourly_rate
  - GIN index on subjects (JSONB)
  - Full-text search index

## Frontend Implementation

### 1. API Service: `tutoringApi.ts`
**Location**: `frontend/src/services/tutoringApi.ts`

**Features**:
- `getListings()` - Fetch listings with filters
- `getListingById()` - Fetch single listing
- `getMyListings()` - Fetch user's own listings
- `createListing()` - Create new listing
- `updateListing()` - Update existing listing
- `updateStatus()` - Update listing status
- `deleteListing()` - Delete listing

### 2. Updated Components

#### TutoringPage.tsx
**Changes**:
- Replaced dummy data with real API calls
- Added error handling with toast notifications
- Async/await for all API operations
- Proper loading states

#### TutoringModal.tsx (Already Exists)
**Features**:
- Form for creating tutoring listings
- Fields match the dummy data structure:
  - Title
  - Description
  - Subjects (add/remove dynamically)
  - Hourly Rate
  - Syllabus (3 key topics)
  - Availability (3 time slots)

#### TutoringCard.tsx (Already Exists)
- Displays tutoring listing information
- Shows tutor details, subjects, rate
- Contact button

## Data Flow

### Creating a Tutoring Listing

1. **Frontend**: User clicks "Offer Tutoring" button
2. **Frontend**: System checks authentication and email verification
3. **Frontend**: Opens TutoringModal with form
4. **Frontend**: User fills in:
   - Title (e.g., "Python Programming & Data Structures")
   - Description
   - Subjects (as text, e.g., "Python", "Data Structures")
   - Hourly Rate (₹)
   - Syllabus (3 topics)
   - Availability (3 time slots)
5. **Frontend**: Submits to `POST /api/tutoring`
6. **Backend**: Validates user is authenticated and email verified
7. **Backend**: Converts subject names to Subject objects with:
   - ID (kebab-case of name)
   - Name (as provided)
   - IconUrl (automatically assigned based on subject name)
8. **Backend**: Saves to database
9. **Backend**: Returns complete listing with tutor info
10. **Frontend**: Displays success toast and refreshes listings

### Viewing Tutoring Listings

1. **Frontend**: Page loads, calls `GET /api/tutoring?page=0&size=12&sort=createdAt,desc`
2. **Backend**: Queries database with filters and pagination
3. **Backend**: Enriches each listing with tutor information
4. **Backend**: Returns paginated response
5. **Frontend**: Displays listings in grid

### Filtering

1. **Frontend**: User applies filters (subject, price range)
2. **Frontend**: Calls API with filter parameters
3. **Backend**: Uses native SQL query to filter:
   - JSONB subject matching
   - Price range comparison
   - Full-text search (if query provided)
4. **Backend**: Returns filtered results
5. **Frontend**: Updates display

## Database Schema

```sql
tutoring_listings
├── id (UUID, PK)
├── title (VARCHAR)
├── description (TEXT)
├── hourly_rate (DECIMAL)
├── subjects (JSONB)
│   └── [{ id, name, iconUrl }]
├── syllabus (JSONB)
│   └── ["topic1", "topic2", "topic3"]
├── availability (JSONB)
│   └── ["Monday: 2-6 PM", ...]
├── status (VARCHAR)
├── tutor_id (UUID, FK -> users.id)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Security

- Authentication required for:
  - Creating listings
  - Updating listings
  - Deleting listings
  - Viewing "my listings"
- Email verification required for creating listings
- Users can only update/delete their own listings
- Anonymous users can view all listings

## Future Enhancements

1. **Ratings & Reviews**
   - Add reviews table
   - Calculate average rating
   - Display reviews on tutor profile

2. **Booking System**
   - Allow students to book tutoring sessions
   - Calendar integration
   - Automatic status updates (ACTIVE -> BOOKED)

3. **Messaging**
   - Direct messaging between students and tutors
   - Integration with existing chat system

4. **Advanced Search**
   - Search by tutor name
   - Search by college
   - Filter by rating

5. **Subject Categories**
   - Predefined subject list
   - Subject icons mapping table
   - Subject hierarchy (e.g., CS -> Python, Java)

6. **Profile Enhancement**
   - Add "major" field to User entity
   - Display tutor's major separately from bio
   - Add tutor certifications/qualifications

## Testing

### To Test the Implementation:

1. **Start Backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow**:
   - Register/Login as a user
   - Verify your email
   - Navigate to /tutoring
   - Click "Offer Tutoring"
   - Fill in the form with sample data
   - Submit
   - Verify the listing appears
   - Test filtering by subject/price
   - Test viewing listing details

## Output Matches Dummy Data

The implementation ensures that the output matches the dummy data structure exactly:

- ✅ Title
- ✅ Description
- ✅ Hourly Rate
- ✅ Subjects (with id, name, iconUrl)
- ✅ Syllabus (array of strings)
- ✅ Availability (array of strings)
- ✅ Status (ACTIVE/BOOKED/INACTIVE)
- ✅ Tutor Info (id, name, avatarUrl, year, collegeName, major, rating, totalReviews)
- ✅ Timestamps (createdAt, updatedAt)

All fields from the dummy data are preserved in the database and API responses.

