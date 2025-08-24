-- Create global_chats table
CREATE TABLE global_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create global_messages table
CREATE TABLE global_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    global_chat_id UUID NOT NULL REFERENCES global_chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_global_chats_college_id ON global_chats(college_id);
CREATE INDEX idx_global_chats_is_active ON global_chats(is_active);
CREATE INDEX idx_global_messages_global_chat_id ON global_messages(global_chat_id);
CREATE INDEX idx_global_messages_created_at ON global_messages(created_at);
CREATE INDEX idx_global_messages_sender_id ON global_messages(sender_id);

-- Insert default global chats for existing colleges
-- This will create a "General" chat for each college
INSERT INTO global_chats (college_id, name, description)
SELECT 
    id,
    'General',
    'General discussion for ' || name || ' students'
FROM colleges
WHERE EXISTS (SELECT 1 FROM colleges);

-- Insert additional common chat rooms for existing colleges
INSERT INTO global_chats (college_id, name, description)
SELECT 
    id,
    'Study Groups',
    'Find study partners and form study groups'
FROM colleges
WHERE EXISTS (SELECT 1 FROM colleges);

INSERT INTO global_chats (college_id, name, description)
SELECT 
    id,
    'Events & Activities',
    'Discuss campus events and activities'
FROM colleges
WHERE EXISTS (SELECT 1 FROM colleges);

INSERT INTO global_chats (college_id, name, description)
SELECT 
    id,
    'Off Topic',
    'Casual conversations and fun discussions'
FROM colleges
WHERE EXISTS (SELECT 1 FROM colleges);
