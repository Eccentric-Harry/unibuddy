-- Add type column to conversations table to distinguish between marketplace and tutoring conversations
ALTER TABLE conversations
ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'MARKETPLACE';

-- Add index for better query performance
CREATE INDEX idx_conversations_type ON conversations(type);

-- Update existing conversations to have MARKETPLACE type (already set by default)
-- Future tutoring conversations will be set to TUTORING type programmatically

