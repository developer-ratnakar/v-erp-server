class ExamResult {
  constructor({
    id,
    exam_id,
    student_id,
    total_marks,
    secured_marks,
    percentage,
    sgpa,
    cgpa,
    result_status,
    created_at,
    updated_at,
    student,
  }) {
    this.id = id;
    this.examId = exam_id;
    this.studentId = student_id;
    this.totalMarks = total_marks;
    this.securedMarks = secured_marks;
    this.percentage = percentage;
    this.sgpa = sgpa;
    this.cgpa = cgpa;
    this.resultStatus = result_status;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.student = student ? {
      id: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      registrationNumber: student.registration_number,
    } : null;
  }
}

export default ExamResult;
