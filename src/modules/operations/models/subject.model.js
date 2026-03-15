class Subject {
  constructor({
    id,
    name,
    code,
    department_id,
    program_id,
    semester_id,
    credits,
    is_active,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.departmentId = department_id;
    this.programId = program_id;
    this.semesterId = semester_id;
    this.credits = credits;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Subject;
