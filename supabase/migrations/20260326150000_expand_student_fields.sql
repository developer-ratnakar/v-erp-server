-- Create enum types if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
    CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_category') THEN
    CREATE TYPE student_category AS ENUM ('GENERAL', 'OBC', 'SC', 'ST');
  END IF;
END $$;

-- Add columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS gender gender,
ADD COLUMN IF NOT EXISTS category student_category,
ADD COLUMN IF NOT EXISTS sc_st_scheme BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tenth_percent DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS tenth_board VARCHAR(100),
ADD COLUMN IF NOT EXISTS inter_percent DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS inter_board VARCHAR(100),
ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS alt_contact VARCHAR(20);

-- Add columns to student_parents table
ALTER TABLE student_parents
ADD COLUMN IF NOT EXISTS father_contact VARCHAR(20),
ADD COLUMN IF NOT EXISTS parents_email VARCHAR(255);
