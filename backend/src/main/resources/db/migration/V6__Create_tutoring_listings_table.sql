-- Create tutoring_listings table
CREATE TABLE IF NOT EXISTS tutoring_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    subjects JSONB,
    syllabus JSONB,
    availability JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    tutor_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tutoring_tutor FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_tutoring_tutor_id ON tutoring_listings(tutor_id);
CREATE INDEX idx_tutoring_status ON tutoring_listings(status);
CREATE INDEX idx_tutoring_created_at ON tutoring_listings(created_at DESC);
CREATE INDEX idx_tutoring_hourly_rate ON tutoring_listings(hourly_rate);

-- Create GIN index for JSONB subjects column for efficient querying
CREATE INDEX idx_tutoring_subjects ON tutoring_listings USING GIN (subjects);

-- Create full-text search index
CREATE INDEX idx_tutoring_search ON tutoring_listings USING GIN (to_tsvector('english', title || ' ' || description));

