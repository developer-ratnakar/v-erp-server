-- Add unique constraint to exam_marks to support upsert
ALTER TABLE exam_marks 
ADD CONSTRAINT uq_exam_student_subject UNIQUE (exam_id, student_id, subject_id);
