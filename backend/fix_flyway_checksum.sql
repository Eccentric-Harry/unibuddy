-- Fix Flyway checksum mismatch for V4 migration
-- This updates the checksum in the flyway_schema_history table to match the current file

-- First, let's see what migrations are recorded
-- SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- Delete the failed V4 migration record so Flyway can re-run it
DELETE FROM flyway_schema_history WHERE version = '4';

-- If you want to update the checksum instead of deleting:
-- UPDATE flyway_schema_history SET checksum = 887855753 WHERE version = '4';

