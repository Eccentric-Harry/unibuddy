# ✅ Testing Checklist - Automated Job System

Use this checklist to verify your automated job posting system is working correctly.

## Pre-Start Verification

- [ ] Backend compiles successfully
  ```bash
  cd backend && ./mvnw clean compile
  ```
  Expected: BUILD SUCCESS

- [ ] Frontend has no new errors in job files
  - Check JobsPage.tsx
  - Check jobApi.ts

## Backend Testing

### 1. Database Migration
- [ ] Start backend
  ```bash
  cd backend && ./mvnw spring-boot:run
  ```
- [ ] Check logs for Flyway migration
  ```
  Expected log: "Migrating schema `public` to version 5"
  ```
- [ ] Verify tables created:
  - job_postings
  - job_requirements
  - job_responsibilities
  - job_skills

### 2. Job Sync Service
- [ ] Check for initial sync log (within 5 seconds of start):
  ```
  Expected: "Starting job sync process..."
  Expected: "Job sync completed. Total jobs synced: X"
  ```
- [ ] If using API key:
  - [ ] Jobs fetched from external API
  - [ ] 40+ jobs synced
  
- [ ] If NO API key:
  - [ ] Fallback jobs created
  - [ ] 5+ jobs available

### 3. REST API Endpoints

Test each endpoint using curl or browser:

#### Get All Jobs
```bash
curl http://localhost:8080/api/jobs
```
- [ ] Returns JSON with job array
- [ ] Pagination info included
- [ ] Status: 200 OK

#### Get Jobs with Filters
```bash
curl "http://localhost:8080/api/jobs?jobType=Internship&locationType=Remote"
```
- [ ] Returns filtered results
- [ ] Only internships shown
- [ ] Only remote jobs shown

#### Search Jobs
```bash
curl "http://localhost:8080/api/jobs?query=software"
```
- [ ] Returns jobs matching "software"
- [ ] Search works in title, company, description

#### Get Job Stats
```bash
curl http://localhost:8080/api/jobs/stats
```
- [ ] Returns statistics object
- [ ] Contains: total, internships, fullTime, partTime, remote
- [ ] Numbers match database

#### Get Single Job
```bash
curl http://localhost:8080/api/jobs/{job-id}
```
- [ ] Returns single job object
- [ ] All fields populated
- [ ] Status: 200 OK

#### Manual Sync
```bash
curl -X POST http://localhost:8080/api/jobs/sync
```
- [ ] Returns success message
- [ ] New sync starts in backend
- [ ] Jobs updated in database

## Frontend Testing

### 1. Page Load
- [ ] Navigate to Jobs page
- [ ] No console errors
- [ ] Jobs display correctly
- [ ] Loading state shows initially

### 2. Statistics Dashboard
- [ ] Total jobs count displays
- [ ] Internships count correct
- [ ] Full-time count correct
- [ ] Part-time count correct
- [ ] Remote jobs count correct
- [ ] All numbers > 0

### 3. Job Cards
- [ ] Company logo displays (or fallback)
- [ ] Job title shown
- [ ] Company name shown
- [ ] Location displayed
- [ ] Job type badge (Internship/Full-time/etc)
- [ ] Location type badge (Remote/Hybrid/On-site)
- [ ] Skills tags visible
- [ ] Salary range shown (if available)

### 4. Filtering
- [ ] Job Type filter works:
  - [ ] Select "Internship" → shows only internships
  - [ ] Select "Full-time" → shows only full-time
  - [ ] Select "Part-time" → shows only part-time
  
- [ ] Location Type filter works:
  - [ ] Select "Remote" → shows only remote
  - [ ] Select "Hybrid" → shows only hybrid
  - [ ] Select "On-site" → shows only on-site

### 5. Search
- [ ] Enter "software" → filters results
- [ ] Enter company name → shows that company's jobs
- [ ] Clear search → shows all jobs
- [ ] Search works with filters combined

### 6. Pagination
- [ ] Multiple pages exist (if >12 jobs)
- [ ] Click next page → loads page 2
- [ ] Click previous → goes back
- [ ] Page scrolls to top on change
- [ ] Current page highlighted

### 7. Manual Sync Button
- [ ] "Sync Jobs" button visible
- [ ] Click button → shows "Syncing..."
- [ ] Spinner icon animates
- [ ] Toast notification appears
- [ ] After 3 seconds → jobs refresh
- [ ] Stats update
- [ ] Button re-enables

### 8. Job Application
- [ ] Click "Apply" on any job
- [ ] New tab opens with application URL
- [ ] Toast notification shows
- [ ] Original page stays open

## Database Verification

Connect to your PostgreSQL database and run:

### Check Jobs Table
```sql
SELECT COUNT(*) FROM job_postings;
```
- [ ] Count > 0 (should be 5+ minimum)

### Check Active Jobs
```sql
SELECT COUNT(*) FROM job_postings WHERE status = 'ACTIVE';
```
- [ ] Matches frontend total count

### Check Job Types Distribution
```sql
SELECT job_type, COUNT(*) FROM job_postings GROUP BY job_type;
```
- [ ] Shows internships, full-time, part-time
- [ ] Numbers match frontend stats

### Check Recent Sync
```sql
SELECT MAX(last_synced_at) FROM job_postings;
```
- [ ] Timestamp is recent (within last 6 hours)

### Check Requirements/Skills
```sql
SELECT COUNT(*) FROM job_requirements;
SELECT COUNT(*) FROM job_skills;
```
- [ ] Both tables have data
- [ ] Multiple entries per job

## Error Handling

### Test API Failure
Temporarily use wrong API key:
- [ ] Backend still starts
- [ ] Fallback jobs created
- [ ] No crash/exception
- [ ] Frontend still works

### Test Empty Results
Filter with impossible combination:
- [ ] No jobs shown
- [ ] Graceful "No jobs found" message
- [ ] No errors in console

### Test Network Error
Stop backend while using frontend:
- [ ] Error toast displays
- [ ] User-friendly message
- [ ] No crash

## Performance Testing

### Load Time
- [ ] Initial page load < 2 seconds
- [ ] Filter change < 500ms
- [ ] Search response < 500ms

### Scheduled Sync
Wait 6 hours (or modify interval for testing):
- [ ] Automatic sync triggers
- [ ] No manual intervention needed
- [ ] Jobs update automatically

## Production Readiness

### Configuration
- [ ] API key in application.properties (or using fallback)
- [ ] Sync enabled: `app.jobs.sync.enabled=true`
- [ ] Frontend API URL correct

### Logging
- [ ] Backend logs job sync activity
- [ ] No error spam
- [ ] Informative messages

### Security
- [ ] API key not exposed in frontend
- [ ] No sensitive data in logs
- [ ] CORS configured correctly

## Demo Preparation

Before showing to anyone:
- [ ] Backend running
- [ ] Frontend running
- [ ] At least 20+ jobs visible
- [ ] All filters working
- [ ] Search working
- [ ] Stats accurate
- [ ] "Sync Jobs" works
- [ ] No console errors
- [ ] Smooth performance

## Troubleshooting Quick Checks

If something doesn't work:

1. **No jobs appearing:**
   - [ ] Check backend logs for sync completion
   - [ ] Verify database connection
   - [ ] Check if tables exist
   - [ ] Try manual sync via POST /api/jobs/sync

2. **Jobs not updating:**
   - [ ] Check `last_synced_at` in database
   - [ ] Verify scheduled task is enabled
   - [ ] Check API key validity
   - [ ] Look for errors in logs

3. **Frontend errors:**
   - [ ] Check browser console
   - [ ] Verify backend is running
   - [ ] Check network tab for failed requests
   - [ ] Confirm API URL is correct

4. **API rate limits:**
   - [ ] Check RapidAPI dashboard
   - [ ] Verify free tier not exceeded
   - [ ] Reduce sync frequency if needed

## Success Criteria

Your system is working if:
✅ Backend starts without errors
✅ Jobs appear in database within 5 seconds
✅ Frontend displays jobs correctly
✅ Filtering and search work
✅ Manual sync button works
✅ Stats are accurate
✅ Application links work
✅ No console errors
✅ Performance is good

## Optional Enhancements to Test

If you've added custom features:
- [ ] Email notifications
- [ ] Saved jobs
- [ ] Application tracking
- [ ] Advanced filters
- [ ] Job recommendations
- [ ] Company reviews

---

## Quick Test Commands

Run these for fast verification:

```bash
# Backend health
curl http://localhost:8080/api/jobs/stats

# Job count
curl http://localhost:8080/api/jobs | grep -o '"totalElements":[0-9]*'

# Filter test
curl "http://localhost:8080/api/jobs?jobType=Internship" | grep -o '"content":\[.*\]' | wc -c

# Manual sync
curl -X POST http://localhost:8080/api/jobs/sync
```

---

**Testing Complete!** 🎉

Mark this checklist as you go. Once all items are checked, your automated job system is fully functional and demo-ready!

