class Department {
  constructor({ id, code, name, program_id, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.programId = program_id;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Department;
