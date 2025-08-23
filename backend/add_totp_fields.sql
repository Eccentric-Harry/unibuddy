-- Add TOTP fields to users table for email verification
ALTER TABLE users 
ADD COLUMN totp_secret VARCHAR(255),
ADD COLUMN totp_created_at TIMESTAMP;
