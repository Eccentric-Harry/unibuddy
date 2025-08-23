-- Migrate from TOTP fields to verification code fields
-- This script updates the database schema to use simple verification codes instead of TOTP

-- Add new verification code fields
ALTER TABLE users 
ADD COLUMN verification_code VARCHAR(6),
ADD COLUMN verification_code_created_at TIMESTAMP;

-- Migrate existing data (optional - you can also just clear existing verification attempts)
-- UPDATE users 
-- SET verification_code = NULL, 
--     verification_code_created_at = totp_created_at
-- WHERE totp_secret IS NOT NULL;

-- Drop old TOTP fields
ALTER TABLE users 
DROP COLUMN IF EXISTS totp_secret,
DROP COLUMN IF EXISTS totp_created_at;

-- Add index for performance (optional)
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);
CREATE INDEX IF NOT EXISTS idx_users_verification_code_created_at ON users(verification_code_created_at);
