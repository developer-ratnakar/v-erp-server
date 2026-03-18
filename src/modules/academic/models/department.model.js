class Department {
  constructor({ id, code, name, program_id, description, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.program_id = program_id;
    this.description = description;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Department;
