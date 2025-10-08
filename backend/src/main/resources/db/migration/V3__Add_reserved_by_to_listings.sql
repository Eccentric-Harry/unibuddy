-- Add reserved_by column to listings table
ALTER TABLE listings ADD COLUMN reserved_by UUID NULL REFERENCES users(id);

-- Add reserved to the existing status options (if using enum type)
-- If using a VARCHAR for status, this isn't necessary as we'll handle it in the application code

-- Add index for reserved_by for better performance
CREATE INDEX idx_listings_reserved_by ON listings(reserved_by);

-- Update the status enum to include RESERVED
-- Note: We're not actually changing the type, just ensuring our application logic handles this value
COMMENT ON COLUMN listings.status IS 'Status values: ACTIVE, RESERVED, SOLD, INACTIVE';