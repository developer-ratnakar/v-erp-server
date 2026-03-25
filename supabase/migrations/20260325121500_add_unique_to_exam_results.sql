-- Add unique constraint to exam_results to prevent duplicate results for same student and exam
ALTER TABLE exam_results ADD CONSTRAINT uq_exam_student_result UNIQUE (exam_id, student_id);
