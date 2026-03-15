class Timetable {
  constructor({
    id,
    name,
    program_id,
    department_id,
    batch_id,
    session_id,
    semester_id,
    section,
    is_active,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.programId = program_id;
    this.departmentId = department_id;
    this.batchId = batch_id;
    this.sessionId = session_id;
    this.semesterId = semester_id;
    this.section = section;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Timetable;
