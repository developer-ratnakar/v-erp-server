class StudentDepartmentTransfer {
  constructor({
    id,
    student_id,
    from_program_id,
    from_department_id,
    from_batch_id,
    from_semester_id,
    to_program_id,
    to_department_id,
    to_batch_id,
    to_semester_id,
    reason,
    effective_date,
    created_at,
  }) {
    this.id = id;
    this.studentId = student_id;
    this.fromProgramId = from_program_id;
    this.fromDepartmentId = from_department_id;
    this.fromBatchId = from_batch_id;
    this.fromSemesterId = from_semester_id;
    this.toProgramId = to_program_id;
    this.toDepartmentId = to_department_id;
    this.toBatchId = to_batch_id;
    this.toSemesterId = to_semester_id;
    this.reason = reason;
    this.effectiveDate = effective_date;
    this.createdAt = created_at;
  }
}

export default StudentDepartmentTransfer;
