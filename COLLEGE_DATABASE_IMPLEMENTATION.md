# College Database Implementation

## Overview

The system has been updated to use a pre-populated database of Indian colleges and universities instead of dynamically creating college entries during user registration.

## Key Changes

### 1. College Data Service (`CollegeDataService.java`)
- **Purpose**: Automatically populates the database with 300+ Indian colleges and universities on application startup
- **Trigger**: Runs only if the colleges table is empty
- **Coverage**: Includes IITs, IIMs, NITs, IIITs, Central Universities, State Universities, and major private institutions

### 2. Authentication Service Updates (`AuthService.java`)
- **Before**: Created new college entries dynamically when users registered with unknown domains
- **After**: Only allows registration with email domains from pre-existing colleges
- **Error Handling**: Returns a clear error message when users try to register with unsupported domains

### 3. Enhanced College API (`CollegeController.java`)
New endpoints:
- `GET /api/colleges` - Paginated list of all colleges
- `GET /api/colleges/all` - Complete list (for dropdowns)
- `GET /api/colleges/search?query=<term>` - Search colleges by name or domain
- `GET /api/colleges/verified` - Only verified/official colleges
- `GET /api/colleges/count` - Total number of colleges
- `GET /api/colleges/validate-domain/{domain}` - Check if a domain is supported

### 4. Email Validation Service Updates (`EmailValidationService.java`)
- **Before**: Used hardcoded list of domains
- **After**: Queries the database to validate email domains
- **Fallback**: Still supports non-strict mode for development

### 5. Enhanced Repository (`CollegeRepository.java`)
Added methods for:
- Searching by name or domain
- Filtering by verification status
- Pagination support

## Database Migration

### Clearing Existing Data
```sql
-- Run this script to clear existing data before using the new system
-- WARNING: This will delete all existing users and colleges

DELETE FROM refresh_tokens;
DELETE FROM users;
DELETE FROM colleges;
ALTER SEQUENCE colleges_id_seq RESTART WITH 1;
```

### Automatic Population
The `CollegeDataService` will automatically populate the database with colleges when the application starts if the colleges table is empty.

## Included Institutions

### IITs (23 institutions)
All Indian Institutes of Technology including:
- IIT Bombay, Delhi, Kanpur, Kharagpur, Madras
- IIT Roorkee, Guwahati, Hyderabad, etc.

### IIMs (20 institutions) 
All Indian Institutes of Management including:
- IIM Ahmedabad, Bangalore, Calcutta, Lucknow
- IIM Kozhikode, Indore, etc.

### NITs (31 institutions)
All National Institutes of Technology including:
- NIT Trichy, Warangal, Surathkal, Calicut
- NIT Rourkela, Kurukshetra, etc.

### IIITs (24 institutions)
Indian Institutes of Information Technology including:
- IIIT Hyderabad, Allahabad, Bangalore
- IIIT Vadodara, Nagpur, etc.

### Central Universities (35+ institutions)
Major central universities including:
- JNU, Delhi University, BHU, AMU
- University of Hyderabad, etc.

### State Universities (100+ institutions)
Major state universities and private institutions including:
- Anna University, University of Mumbai
- VIT, SRM, Manipal, BITS Pilani
- And many more...

## Usage

### For Users
Users can now only register with email addresses from recognized educational institutions. If their institution is not listed, they will receive a clear error message.

### For Developers

#### Check if domain is supported:
```bash
curl http://localhost:8080/api/colleges/validate-domain/iitb.ac.in
# Returns: true
```

#### Search for colleges:
```bash
curl "http://localhost:8080/api/colleges/search?query=IIT&limit=5"
```

#### Get paginated college list:
```bash
curl "http://localhost:8080/api/colleges?page=0&size=10&sortBy=name&sortDir=asc"
```

## Configuration

### Email Validation
You can still disable strict email validation for development:
```properties
app.email.validation.strict-mode=false
```

### Adding New Colleges
To add new colleges, update the `getIndianCollegesData()` method in `CollegeDataService.java` and restart the application. The service will detect new entries and add them.

## Benefits

1. **Comprehensive Coverage**: 300+ institutions pre-loaded
2. **Better User Experience**: Clear feedback when domain not supported
3. **Data Consistency**: Standardized college names and domains
4. **Search Functionality**: Users can search and browse available institutions
5. **Verification Status**: Distinction between verified and unverified institutions
6. **Scalability**: Easy to add new institutions via configuration

## Future Enhancements

1. **Admin Panel**: Interface to add/edit colleges without code changes
2. **Import/Export**: Bulk import colleges from CSV files
3. **User Requests**: Allow users to request addition of missing institutions
4. **Regional Filtering**: Filter colleges by state or region
5. **Institution Types**: Categorize by engineering, medical, management, etc.
