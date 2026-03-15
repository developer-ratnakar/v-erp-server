class ExamMark {
  constructor({
    id,
    exam_id,
    student_id,
    subject_id,
    result_id,
    marks_obtained,
    total_marks,
    grade,
    grade_point,
    is_absent,
    remarks,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.examId = exam_id;
    this.studentId = student_id;
    this.subjectId = subject_id;
    this.resultId = result_id;
    this.marksObtained = marks_obtained;
    this.totalMarks = total_marks;
    this.grade = grade;
    this.gradePoint = grade_point;
    this.isAbsent = is_absent;
    this.remarks = remarks;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default ExamMark;
