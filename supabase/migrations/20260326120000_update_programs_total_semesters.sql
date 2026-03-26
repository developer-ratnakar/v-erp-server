-- Update academic_programs to include total_semesters
ALTER TABLE academic_programs ADD COLUMN IF NOT EXISTS total_semesters INTEGER DEFAULT 8;

-- Add comment to clarify
COMMENT ON COLUMN academic_programs.total_semesters IS 'Total number of semesters in the program (e.g., 8 for BTECH, 4 for MBA)';

-- Ensure academic_sessions has is_current properly
-- (Already exists in initial migration, but we might want a constraint or index)
CREATE INDEX IF NOT EXISTS idx_academic_sessions_is_current ON academic_sessions(is_current) WHERE is_current = TRUE;

-- Add total_semesters to existing programs if any
UPDATE academic_programs SET total_semesters = 8 WHERE code ILIKE '%BTECH%';
UPDATE academic_programs SET total_semesters = 4 WHERE code ILIKE '%MBA%' OR code ILIKE '%MSC%';
UPDATE academic_programs SET total_semesters = 6 WHERE code ILIKE '%DIPLOMA%' OR code ILIKE '%BCA%' OR code ILIKE '%BBA%';
