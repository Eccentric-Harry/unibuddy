# Listing Fields Update - Registration Number, Year, and Condition

## Summary
Added the following fields to marketplace listings:
- **Condition**: Item condition field that users can fill during listing creation
- **Registration Number**: User's registration number displayed in seller information
- **Year**: User's academic year (already existed, now captured during registration)

## Changes Made

### Backend Changes

#### 1. Database Schema (`V4__Add_condition_and_registration_no.sql`)
- Added `condition` column to `listings` table (VARCHAR(50))
- Added `registration_no` column to `users` table (VARCHAR(100))

#### 2. Entity Updates
- **Listing.java**: Added `condition` field
- **User.java**: Added `registrationNo` field

#### 3. DTO Updates
- **ListingCreateRequest.java**: Added `condition` field
- **ListingResponse.java**: 
  - Added `condition` field to main response
  - Added `email`, `registrationNo`, and `hostel` fields to SellerInfo
- **RegisterRequest.java**: Added `registrationNo` field

#### 4. Service Updates
- **ListingService.java**: 
  - Updated `createListing()` to save condition
  - Updated `mapToResponse()` to include condition and registrationNo
- **AuthService.java**: Updated user creation to save registrationNo

### Frontend Changes

#### 1. Type Updates
- **marketplace.ts**:
  - Added `condition` to `ListingCreateRequest`
  - Added `condition` to `ListingResponse`
  - Added `email` to `SellerInfo`
- **index.ts**: Added `year` and `registrationNo` to `RegisterRequest`

#### 2. Component Updates
- **CreateListingModal.tsx**:
  - Added `CONDITIONS` array with options: Brand New, Like New, Excellent, Good, Fair, Poor
  - Added condition state variable
  - Added condition dropdown field in the form
  - Included condition in listing submission
  - Reset condition field on form submission

- **RegisterForm.tsx**:
  - Added `year` and `registrationNo` fields to registration schema
  - Added input fields for Year (optional, 1-6) and Registration Number (optional)
  - Updated form submission to convert year to number

#### 3. Display Updates
- **ListingDetailPage.tsx**: Already displays condition and registrationNo fields (no changes needed)

## Field Details

### Condition Field
- **Type**: String (optional)
- **Location**: Listing entity/creation form
- **Options**: Brand New, Like New, Excellent, Good, Fair, Poor
- **Display**: Shows in listing detail page under "Condition"

### Registration Number Field
- **Type**: String (optional, max 100 characters)
- **Location**: User entity/registration form
- **Input**: Text field during registration
- **Display**: Shows in seller information section of listing detail page

### Year Field
- **Type**: Number (optional, 1-6)
- **Location**: User entity/registration form
- **Input**: Number field during registration
- **Display**: Shows in seller information section of listing detail page

## Database Migration
Run the migration to add the new columns:
```bash
cd backend
./mvnw flyway:migrate
```

Or the migration will run automatically on application startup if Flyway is configured.

## Testing Checklist
- [ ] Registration form accepts year and registration number
- [ ] New users can register with optional year and registration number
- [ ] Listing creation form shows condition dropdown
- [ ] New listings save with condition value
- [ ] Listing detail page displays condition correctly
- [ ] Listing detail page displays seller's registration number
- [ ] Existing listings without condition display gracefully
- [ ] Existing users without registration number display gracefully

## Notes
- All new fields are optional to maintain backward compatibility
- The condition field is specific to each listing
- The registration number and year are user profile fields
- ListingDetailPage.tsx already had UI for these fields, so no changes needed there

