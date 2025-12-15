-- Create job postings and related tables
CREATE TABLE IF NOT EXISTS job_postings (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo VARCHAR(1000),
    company_website VARCHAR(1000),
    location VARCHAR(255) NOT NULL,
    location_type VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    description TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10),
    salary_period VARCHAR(20),
    application_deadline TIMESTAMP,
    application_url VARCHAR(1000),
    status VARCHAR(50) NOT NULL,
    external_job_id VARCHAR(255),
    external_source VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_synced_at TIMESTAMP,
    CONSTRAINT chk_location_type CHECK (location_type IN ('ON_SITE', 'REMOTE', 'HYBRID')),
    CONSTRAINT chk_job_type CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT')),
    CONSTRAINT chk_salary_period CHECK (salary_period IN ('HOURLY', 'MONTHLY', 'YEARLY')),
    CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'CLOSED', 'DRAFT'))
);

CREATE TABLE IF NOT EXISTS job_requirements (
    id BIGSERIAL PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    requirement VARCHAR(1000),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_responsibilities (
    id BIGSERIAL PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    responsibility VARCHAR(1000),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_skills (
    id BIGSERIAL PRIMARY KEY,
    job_id VARCHAR(255) NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_job_status ON job_postings(status);
CREATE INDEX idx_job_type ON job_postings(job_type);
CREATE INDEX idx_job_location_type ON job_postings(location_type);
CREATE INDEX idx_external_job_id ON job_postings(external_job_id);
CREATE INDEX idx_external_source ON job_postings(external_source);
CREATE INDEX idx_created_at ON job_postings(created_at);
CREATE INDEX idx_last_synced_at ON job_postings(last_synced_at);

