#!/bin/bash
# Repair Flyway migration for Job Postings

echo "🔧 Repairing Flyway migration V5..."

# Database connection details from application.properties
DB_HOST="aws-1-ap-south-1.pooler.supabase.com"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres.fdeadgzxjuqevlohtvsl"
DB_PASSWORD="cabdik-cyjTe4-movcaw"

# Export password for psql
export PGPASSWORD="$DB_PASSWORD"

echo "Connecting to database..."

# Remove failed migration record
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "DELETE FROM flyway_schema_history WHERE version = '5';"

if [ $? -eq 0 ]; then
    echo "✅ Successfully removed failed migration record"
    echo "🚀 You can now restart the backend - the migration will run correctly"
else
    echo "❌ Failed to connect to database"
    echo "Please run this SQL manually in your database:"
    echo "DELETE FROM flyway_schema_history WHERE version = '5';"
fi

# Unset password
unset PGPASSWORD

