#!/bin/bash

# College Database Migration Script
# This script helps migrate from the old dynamic college creation to the new pre-populated database

echo "College Database Migration Script"
echo "================================="

# Check if PostgreSQL is accessible
if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found. Please ensure PostgreSQL client is installed."
    exit 1
fi

# Database connection details (modify as needed)
DB_NAME="collegebuddy"
DB_USER="eccentricharry"
DB_HOST="localhost"
DB_PORT="5432"

echo "This script will:"
echo "1. Clear all existing college, user, and refresh token data"
echo "2. Reset the sequence counters"
echo "3. The application will automatically populate colleges on next startup"
echo ""
echo "WARNING: This will delete ALL existing user accounts and college data!"
echo ""

read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "Connecting to database..."

# Execute the migration script
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
-- Clear existing data
DELETE FROM refresh_tokens;
DELETE FROM users;
DELETE FROM colleges;

-- Reset sequences
ALTER SEQUENCE colleges_id_seq RESTART WITH 1;

-- Show results
SELECT 'Migration completed successfully' as status;
SELECT 'Colleges table cleared, count: ' || COUNT(*) as college_count FROM colleges;
SELECT 'Users table cleared, count: ' || COUNT(*) as user_count FROM users;

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start your Spring Boot application"
    echo "2. The CollegeDataService will automatically populate the database with 300+ colleges"
    echo "3. Check the logs to confirm successful initialization"
    echo "4. Test with: curl http://localhost:8080/api/colleges/count"
    echo ""
else
    echo ""
    echo "❌ Migration failed! Please check the error messages above."
    echo "Make sure:"
    echo "- PostgreSQL is running"
    echo "- Database connection details are correct"
    echo "- You have necessary permissions"
    exit 1
fi
