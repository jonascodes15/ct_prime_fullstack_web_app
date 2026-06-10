-- Add missing verification columns to users table
-- Run this on freesqldatabase if these columns don't exist

ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS code_expires_at TIMESTAMP DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) NOT NULL DEFAULT 0;

-- For existing migrated users, mark them as verified so they can login
-- Adjust this as needed
UPDATE users SET is_verified = 1 WHERE is_verified = 0;
