# Quick Start Guide - Tutoring System

## Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173` (or your configured port)
- PostgreSQL database configured and running
- User registered and email verified

## Step 1: Run Database Migration

The migration will automatically run when you start the backend. The file `V6__Create_tutoring_listings_table.sql` creates the necessary table and indexes.

```bash
cd backend
./mvnw spring-boot:run
```

## Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

## Step 3: Create Your First Tutoring Listing

1. **Login**: Navigate to the app and login with a verified account
2. **Go to Tutoring Page**: Click on "Tutoring" in the navigation or go to `/tutoring`
3. **Click "Offer Tutoring"**: This opens the modal form
4. **Fill in the Form**:

   ```
   Title: Python Programming & Data Structures
   
   Description: Expert Python tutor with experience in teaching data structures 
   and algorithms. I can help you ace your CS courses!
   
   Subjects: 
   - Python
   - Data Structures
   
   Hourly Rate: 250
   
   Syllabus:
   - Python Basics & Syntax
   - Object-Oriented Programming
   - Data Structures (Lists, Dictionaries, Sets)
   
   Availability:
   - Monday: 2 PM - 6 PM
   - Wednesday: 3 PM - 7 PM
   - Saturday: 10 AM - 4 PM
   ```

5. **Submit**: Click "Create Listing"

## Step 4: View Your Listing

Your listing should appear immediately on the tutoring page with:
- Auto-generated subject icons
- Your profile information (from User entity)
- All the details you entered
- Status showing as "ACTIVE"

## Step 5: Test Filtering

Try filtering by:
- **Subject**: Select a subject from the filter dropdown
- **Price Range**: Set min/max price filters
- **Search**: Use the search box to find listings by keywords

## API Endpoints Reference

### Get All Listings
```bash
curl http://localhost:8080/api/tutoring?page=0&size=12&sort=createdAt,desc
```

### Get Listings with Filters
```bash
curl "http://localhost:8080/api/tutoring?subject=python&minPrice=200&maxPrice=500"
```

### Create a Listing (Authenticated)
```bash
curl -X POST http://localhost:8080/api/tutoring \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Java Programming",
    "description": "Learn Java from basics to advanced",
    "hourlyRate": 300,
    "subjects": ["Java", "OOP"],
    "syllabus": ["Java Basics", "OOP Concepts", "Collections"],
    "availability": ["Mon: 2-5 PM", "Wed: 3-6 PM", "Fri: 4-7 PM"]
  }'
```

### Get Your Listings (Authenticated)
```bash
curl http://localhost:8080/api/tutoring/my-listings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Listing (Authenticated)
```bash
curl -X PUT http://localhost:8080/api/tutoring/{id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "hourlyRate": 350,
    "subjects": ["Updated Subject"],
    "syllabus": ["Topic 1", "Topic 2", "Topic 3"],
    "availability": ["Updated availability"]
  }'
```

### Update Status (Authenticated)
```bash
curl -X PATCH "http://localhost:8080/api/tutoring/{id}/status?status=BOOKED" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete a Listing (Authenticated)
```bash
curl -X DELETE http://localhost:8080/api/tutoring/{id} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Issue: "Email must be verified to create tutoring listings"
**Solution**: Verify your email through the verification flow in the app

### Issue: Listing not showing up
**Solution**: Check the console for errors and ensure:
- Backend is running
- Database migration completed successfully
- You're logged in
- The API endpoint returns data (check browser network tab)

### Issue: Subjects not showing icons
**Solution**: The system auto-assigns icons based on subject names. Common subjects (Python, Java, React, Math, etc.) have predefined icons. Others get a default icon.

### Issue: Can't update someone else's listing
**Solution**: This is expected behavior. Users can only update/delete their own listings.

## Sample Data

Here are some sample tutoring listings you can create to test:

### Example 1: Math Tutoring
```json
{
  "title": "Calculus & Linear Algebra",
  "description": "Mathematics major offering comprehensive tutoring in Calculus I, II, and Linear Algebra.",
  "hourlyRate": 300,
  "subjects": ["Calculus", "Linear Algebra"],
  "syllabus": [
    "Limits and Continuity",
    "Derivatives and Applications",
    "Vector Spaces"
  ],
  "availability": [
    "Tuesday: 1 PM - 5 PM",
    "Thursday: 2 PM - 6 PM",
    "Friday: 10 AM - 2 PM"
  ]
}
```

### Example 2: Web Development
```json
{
  "title": "Web Development (React & Node.js)",
  "description": "Full-stack developer offering tutoring in modern web development.",
  "hourlyRate": 350,
  "subjects": ["React", "Node.js"],
  "syllabus": [
    "React Fundamentals",
    "State Management",
    "RESTful APIs"
  ],
  "availability": [
    "Tuesday: 4 PM - 8 PM",
    "Thursday: 4 PM - 8 PM",
    "Saturday: 1 PM - 5 PM"
  ]
}
```

### Example 3: Chemistry
```json
{
  "title": "Chemistry & Organic Chemistry",
  "description": "Experienced chemistry tutor helping students understand complex concepts.",
  "hourlyRate": 280,
  "subjects": ["Chemistry", "Organic Chemistry"],
  "syllabus": [
    "Chemical Bonding",
    "Stoichiometry",
    "Reaction Mechanisms"
  ],
  "availability": [
    "Monday: 9 AM - 1 PM",
    "Wednesday: 2 PM - 6 PM",
    "Thursday: 3 PM - 7 PM"
  ]
}
```

## Next Steps

1. **Test the complete flow**: Create, view, filter, update listings
2. **Add more listings**: Populate the system with various subjects
3. **Test edge cases**: Try filtering with no results, very high/low prices
4. **Review the code**: Check `TUTORING_SYSTEM_IMPLEMENTATION.md` for detailed documentation
5. **Consider enhancements**: Review the "Future Enhancements" section in the implementation doc

## Success Indicators

✅ You can create a tutoring listing
✅ Listings appear on the tutoring page
✅ Subjects show appropriate icons
✅ Filtering works correctly
✅ Your profile information displays correctly
✅ Only you can edit/delete your listings
✅ Email verification is enforced

Happy tutoring! 🎓

