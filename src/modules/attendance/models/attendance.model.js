class Attendance {
  constructor({
    id,
    student_id,
    subject_id,
    month,
    attendance_data,
    program_id,
    department_id,
    batch_id,
    semester_id,
    session_id,
    student,
  }) {
    this.id = id;
    this.studentId = student_id;
    this.subjectId = subject_id;
    this.month = month;
    this.attendanceData = attendance_data;
    this.programId = program_id;
    this.departmentId = department_id;
    this.batchId = batch_id;
    this.semesterId = semester_id;
    this.sessionId = session_id;
    this.student = student;
  }
}

export default Attendance;
