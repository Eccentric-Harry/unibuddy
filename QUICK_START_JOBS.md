# Quick Start: Get Your Free Job API Key

Follow these simple steps to get real job postings in your UniBuddy application:

## Option 1: Use JSearch API (Recommended - FREE)

### Step 1: Sign Up for RapidAPI
1. Go to https://rapidapi.com/
2. Click "Sign Up" (top right)
3. Create a free account using:
   - Email
   - Google account
   - GitHub account

### Step 2: Subscribe to JSearch API
1. Visit https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. Click on "Pricing" tab
3. Select **"Basic" plan** (FREE)
   - 2,500 requests/month
   - Perfect for a student project
4. Click "Subscribe to Test"
 
### Step 3: Get Your API Key
1. After subscribing, you'll see "Code Snippets" section
2. Look for **"X-RapidAPI-Key"** in the header
3. Copy the key (looks like: `abc123def456...`)

### Step 4: Configure UniBuddy Backend
1. Open `backend/src/main/resources/application.properties`
2. Find this line:
   ```properties
   app.jobs.api.key=
   ```
3. Paste your API key:
   ```properties
   app.jobs.api.key=your_actual_api_key_here
   ```
4. Save the file

### Step 5: Test It!
1. Start your backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
2. Watch the logs - you should see:
   ```
   Starting job sync process...
   Job sync completed. Total jobs synced: XX
   ```
3. Open your browser and go to the Jobs page
4. Click "Sync Jobs" button to manually fetch latest jobs

## Option 2: Use Without API Key (Fallback Mode)

If you don't want to set up the API (or for quick testing):

1. **Do nothing!** The system automatically uses fallback jobs
2. You'll get 5+ curated job postings from major tech companies
3. Perfect for demos and development
4. Jobs won't auto-update, but they'll look professional

The fallback jobs include positions from:
- Google (Software Engineering Intern)
- Meta (Frontend Developer)
- Amazon (Backend Developer Intern)
- Microsoft (Full Stack Developer)
- Netflix (Data Science Intern)

## Verification Checklist

✅ Backend starts without errors
✅ See "Job sync completed" in logs (if using API)
✅ Jobs appear on the Jobs page
✅ Statistics show correct counts
✅ "Sync Jobs" button works
✅ Filtering and search work properly

## Troubleshooting

### "Invalid API Key" Error
- Double-check you copied the entire key
- Make sure there are no spaces before/after the key
- Verify you subscribed to the correct API

### No Jobs Appearing
- Check if database tables were created (look for migration logs)
- Verify backend is running on port 8080
- Check browser console for API errors

### Rate Limit Exceeded
- Free tier: 2,500 requests/month
- You can sync manually less frequently
- Consider upgrading plan if needed (or use fallback mode)

## Cost Breakdown

**JSearch API Free Tier:**
- 2,500 requests/month = FREE
- Each sync uses ~10 requests
- Running 6-hour intervals = ~1,200 requests/month
- **You'll stay within the free tier!**

**Pro Plan (if needed):**
- $9.99/month
- 10,000 requests/month
- Only needed for very high-traffic sites

## Next Steps

Once your jobs are loading:
1. Customize job queries in `JobSyncService.java`
2. Adjust sync frequency if needed
3. Add more job categories
4. Customize the UI to match your brand

## Support

Need help?
- Check `JOB_POSTING_SYSTEM.md` for detailed documentation
- Review backend logs for specific errors
- Test with fallback mode first to isolate API issues

---

**Pro Tip**: Start with fallback mode to make sure everything works, then add the API key for real-time jobs!

