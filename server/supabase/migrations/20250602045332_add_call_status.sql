-- Create enum for call status
CREATE TYPE call_status AS ENUM ('IN_PROGRESS', 'FORWARDING', 'ENDED');

-- Add status column to call table
ALTER TABLE call ADD COLUMN status call_status DEFAULT NULL;
