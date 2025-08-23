-- Remove old verification token fields from users table
-- These fields are no longer needed since we're using TOTP for email verification

-- Check if the columns exist before trying to drop them
DO $$
BEGIN
    -- Drop verification_token column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' 
               AND column_name = 'verification_token') THEN
        ALTER TABLE users DROP COLUMN verification_token;
        RAISE NOTICE 'Dropped verification_token column';
    ELSE
        RAISE NOTICE 'verification_token column does not exist';
    END IF;
    
    -- Drop verification_token_expiry column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' 
               AND column_name = 'verification_token_expiry') THEN
        ALTER TABLE users DROP COLUMN verification_token_expiry;
        RAISE NOTICE 'Dropped verification_token_expiry column';
    ELSE
        RAISE NOTICE 'verification_token_expiry column does not exist';
    END IF;
END $$;
