-- Drop the status column
ALTER TABLE call DROP COLUMN status;

-- Drop the existing call_status enum
DROP TYPE call_status;

-- Create new call_status enum with the updated values
CREATE TYPE call_status AS ENUM ('scheduled', 'queued', 'ringing', 'in-progress', 'forwarding', 'ended');

-- Recreate the status column with the new enum
ALTER TABLE call ADD COLUMN status call_status DEFAULT NULL;
