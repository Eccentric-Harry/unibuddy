# Automated Job Posting System - Setup & Documentation

## Overview

This document describes the automated job posting system that replaces dummy data with real, legitimate job postings fetched from external APIs. The system automatically syncs job data every 6 hours and provides real-time job opportunities for students.

## Features

✅ **Automated Job Syncing**: Jobs are automatically fetched from external APIs every 6 hours
✅ **Real Job Data**: Legitimate job postings from companies like Google, Meta, Amazon, Microsoft, etc.
✅ **Smart Parsing**: Automatically extracts requirements, responsibilities, and skills from job descriptions
✅ **Fallback System**: Uses curated fallback jobs if API is unavailable
✅ **Manual Sync**: Admin users can manually trigger job synchronization
✅ **Advanced Filtering**: Filter by job type, location type, and search query
✅ **Pagination**: Efficient pagination with customizable page sizes
✅ **Real-time Stats**: Display live statistics about available jobs

## Architecture

### Backend Components

1. **JobPosting Entity** (`entity/JobPosting.java`)
   - Stores job posting information in the database
   - Includes company details, location, salary, requirements, etc.
   - Tracks external job IDs to avoid duplicates

2. **JobPostingRepository** (`repository/JobPostingRepository.java`)
   - JPA repository with custom queries for filtering and searching
   - Optimized queries for statistics

3. **JobSyncService** (`service/JobSyncService.java`)
   - Automated job fetching from external APIs
   - Scheduled to run every 6 hours
   - Parses and transforms external API data
   - Creates fallback jobs when API is unavailable

4. **JobPostingService** (`service/JobPostingService.java`)
   - Business logic for job retrieval and filtering
   - Converts entities to DTOs

5. **JobController** (`controller/JobController.java`)
   - REST API endpoints for job operations
   - `/api/jobs` - Get jobs with filters
   - `/api/jobs/{id}` - Get specific job
   - `/api/jobs/stats` - Get job statistics
   - `/api/jobs/sync` - Manual sync trigger

### Frontend Components

1. **jobApi.ts** (`services/jobApi.ts`)
   - API client for job-related operations
   - Handles all HTTP requests to backend

2. **JobsPage.tsx** (`pages/JobsPage.tsx`)
   - Main job board page
   - Real-time job fetching and display
   - Manual sync button
   - Live statistics dashboard

## Setup Instructions

### Step 1: Configure Job API (Optional but Recommended)

The system uses **JSearch API** from RapidAPI to fetch real job postings.

1. **Get API Key** (Free tier available):
   - Go to https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
   - Sign up for a free account
   - Subscribe to the free plan (2,500 requests/month)
   - Copy your API key

2. **Configure Backend**:
   - Open `backend/src/main/resources/application.properties`
   - Add your API key:
     ```properties
     app.jobs.api.key=YOUR_RAPIDAPI_KEY_HERE
     app.jobs.api.host=jsearch.p.rapidapi.com
     app.jobs.sync.enabled=true
     ```

3. **Without API Key** (Fallback Mode):
   - The system will automatically use curated fallback jobs
   - No configuration needed
   - Jobs won't be as dynamic but will still work for demo purposes

### Step 2: Run Database Migration

The database tables will be created automatically when you start the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The Flyway migration will create:
- `job_postings` table
- `job_requirements` table
- `job_responsibilities` table
- `job_skills` table
- Necessary indexes

### Step 3: Initial Job Sync

When the backend starts:
1. It will wait 5 seconds (initial delay)
2. Then automatically fetch jobs from the API
3. Jobs will be stored in the database
4. This process repeats every 6 hours

You can also manually trigger a sync:
- Use the "Sync Jobs" button in the UI
- Or call the API: `POST /api/jobs/sync`

### Step 4: Start Frontend

```bash
cd frontend
npm install  # if not already done
npm run dev
```

Navigate to the Jobs page to see real job postings!

## API Endpoints

### GET `/api/jobs`
Get paginated list of jobs with optional filters.

**Query Parameters**:
- `jobType` (optional): `Full-time`, `Part-time`, `Internship`, `Contract`
- `locationType` (optional): `On-site`, `Remote`, `Hybrid`
- `query` (optional): Search query for title, company, description
- `page` (default: 0): Page number
- `size` (default: 12): Items per page
- `sort` (default: `createdAt,desc`): Sort field and direction

**Example**:
```
GET /api/jobs?jobType=Internship&locationType=Remote&page=0&size=12
```

**Response**:
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Software Engineering Intern",
      "company": {
        "name": "Google",
        "logo": "https://...",
        "website": "https://..."
      },
      "location": "Mountain View, CA",
      "locationType": "Hybrid",
      "jobType": "Internship",
      "description": "...",
      "requirements": ["..."],
      "responsibilities": ["..."],
      "skills": ["Java", "Python"],
      "salary": {
        "min": 7000,
        "max": 9000,
        "currency": "USD",
        "period": "monthly"
      },
      "applicationUrl": "https://...",
      "status": "ACTIVE",
      "createdAt": "2025-11-08T10:00:00",
      "updatedAt": "2025-11-08T10:00:00"
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "size": 12,
  "number": 0,
  "first": true,
  "last": false
}
```

### GET `/api/jobs/{id}`
Get a specific job by ID.

**Response**: Single job object (same structure as in the array above)

### GET `/api/jobs/stats`
Get job statistics.

**Response**:
```json
{
  "total": 50,
  "internships": 20,
  "fullTime": 15,
  "partTime": 10,
  "remote": 25
}
```

### POST `/api/jobs/sync`
Manually trigger job synchronization.

**Response**:
```json
{
  "status": "success",
  "message": "Job sync initiated successfully"
}
```

## Job Sync Process

### How It Works

1. **Scheduled Execution**: Runs every 6 hours (configurable in `JobSyncService.java`)
2. **Query Multiple Categories**: Searches for various job types:
   - Software engineer intern
   - Frontend developer
   - Backend developer
   - Full stack developer intern
   - Data science intern
   - Machine learning intern
   - Web developer part-time
   - Mobile developer intern
   - DevOps engineer
   - UI/UX designer intern

3. **Smart Parsing**:
   - Extracts job type from title and description
   - Determines location type (remote, hybrid, on-site)
   - Parses requirements and responsibilities using regex
   - Identifies relevant skills from description

4. **Deduplication**: Uses `externalJobId` to avoid creating duplicate jobs

5. **Rate Limiting**: Waits 1 second between API requests to respect rate limits

### Customization

You can customize the sync behavior in `JobSyncService.java`:

```java
// Change sync interval (in milliseconds)
@Scheduled(fixedRate = 21600000) // 6 hours
// Or use cron expression
@Scheduled(cron = "0 0 */6 * * *") // Every 6 hours

// Modify job queries
private static final String[] JOB_QUERIES = {
    "your", "custom", "queries"
};
```

## Configuration Options

All configuration is in `application.properties`:

```properties
# Job API Configuration
app.jobs.api.key=YOUR_API_KEY
app.jobs.api.host=jsearch.p.rapidapi.com

# Enable/disable automatic syncing
app.jobs.sync.enabled=true

# Sync interval in milliseconds (6 hours)
app.jobs.sync.interval=21600000
```

## Troubleshooting

### No Jobs Appearing

1. **Check Backend Logs**: Look for error messages in the console
2. **Verify Database**: Check if tables were created
3. **API Key**: Ensure API key is configured correctly
4. **Fallback Jobs**: Should be created automatically if API fails

### Jobs Not Updating

1. **Check Sync Status**: Look for "Job sync completed" in logs
2. **Manual Sync**: Click the "Sync Jobs" button in the UI
3. **Verify Schedule**: Check `@Scheduled` annotation

### API Rate Limits

- Free tier: 2,500 requests/month
- Each sync uses ~10 requests (one per query)
- With 6-hour intervals: ~40 requests/day = ~1,200/month
- Stays well within free tier limits

## Alternative Job APIs

If you want to use a different job API, you can modify `JobSyncService.java`:

### Adzuna API
- Free tier: 1,000 requests/month
- URL: https://api.adzuna.com/v1/api/jobs/{country}/search

### The Muse API
- Free tier available
- Good for tech jobs
- URL: https://www.themuse.com/developers/api/v2

### GitHub Jobs (Archived)
- No longer active
- Historical data only

## Data Privacy

- No user data is sent to external APIs
- Only public job postings are fetched
- All data is stored securely in your database
- Users never interact with external APIs directly

## Performance Optimization

1. **Database Indexes**: Created on frequently queried fields
2. **Pagination**: Prevents loading all jobs at once
3. **Caching**: Consider adding Redis cache for frequently accessed jobs
4. **Scheduled Sync**: Runs during low-traffic periods (configurable)

## Future Enhancements

Potential improvements:
- [ ] Add job application tracking
- [ ] Email notifications for new jobs matching user preferences
- [ ] Save favorite jobs
- [ ] Advanced search with salary range filtering
- [ ] Company reviews and ratings
- [ ] Application deadline reminders
- [ ] Resume upload and application submission

## Support

For issues or questions:
1. Check backend logs for error messages
2. Verify API key configuration
3. Test with fallback jobs first
4. Check database connectivity

## Credits

- **JSearch API**: Powered by RapidAPI
- **Job Data**: Aggregated from multiple job boards
- **Icons**: Lucide React icons
- **UI**: Tailwind CSS + shadcn/ui

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0

