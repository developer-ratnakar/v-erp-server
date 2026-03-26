class Program {
  constructor({ id, code, name, duration_years, total_semesters, description, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.duration_years = duration_years;
    this.total_semesters = total_semesters ?? 8;
    this.description = description;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Program;
