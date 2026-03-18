-- Add missing fields to academic_programs
ALTER TABLE academic_programs ADD COLUMN IF NOT EXISTS duration_years INTEGER DEFAULT 4;
ALTER TABLE academic_programs ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing field to academic_departments
ALTER TABLE academic_departments ADD COLUMN IF NOT EXISTS description TEXT;

-- Add missing fields to academic_batches
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='academic_batches' AND column_name='department_id') THEN
        ALTER TABLE academic_batches ADD COLUMN department_id BIGINT REFERENCES academic_departments(id) ON DELETE CASCADE;
    END IF;
END $$;

ALTER TABLE academic_batches ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1;
