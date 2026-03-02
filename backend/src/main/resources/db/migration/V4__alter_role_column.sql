-- 1. Change the column type to VARCHAR(20)
ALTER TABLE resident_records
ALTER COLUMN role TYPE VARCHAR(20);

-- 2. Set NOT NULL and default value
ALTER TABLE resident_records
ALTER COLUMN role SET NOT NULL,
ALTER COLUMN role SET DEFAULT 'RESIDENT';

-- 3. Add a CHECK constraint to allow only specific values
ALTER TABLE resident_records
ADD CONSTRAINT chk_role_values
CHECK (role IN ('RESIDENT', 'STAFF', 'NON_RESIDENT'));