-- Add condition, year, and registration_no columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition VARCHAR(50);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS year SMALLINT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS registration_no VARCHAR(100);

-- Add registration_no column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS registration_no VARCHAR(100);

