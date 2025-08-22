-- Migration script to clear existing college data and prepare for comprehensive data initialization
-- This should be run before starting the application with the new CollegeDataService

-- Clear existing college data (this will also clear related user data due to foreign key constraints)
-- WARNING: This will delete all existing users and refresh tokens
DELETE FROM refresh_tokens;
DELETE FROM users;
DELETE FROM colleges;

-- Reset auto-increment counter
ALTER SEQUENCE colleges_id_seq RESTART WITH 1;

-- The application will automatically populate colleges on startup via CollegeDataService
