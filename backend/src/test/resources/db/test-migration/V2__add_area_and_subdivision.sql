-- =========================================
-- V2__add_role_and_area_to_resident_records
-- H2 + PostgreSQL compatible
-- =========================================

-- Add area column
ALTER TABLE resident_records
    ADD COLUMN IF NOT EXISTS area INTEGER NOT NULL DEFAULT 0;

-- Add subdivision column
ALTER TABLE resident_records
    ADD COLUMN IF NOT EXISTS subdivision VARCHAR(100) NOT NULL DEFAULT 'OTHER';

-- Add role column as VARCHAR (portable)
ALTER TABLE resident_records
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'RESIDENT';

-- Add CHECK constraint for allowed values
ALTER TABLE resident_records
    ADD CONSTRAINT IF NOT EXISTS chk_role_values
    CHECK (role IN ('RESIDENT', 'STAFF', 'NON_RESIDENT'));