class Batch {
  constructor({ id, name, program_id, department_id, start_year, end_year, current_semester, current_session_id, is_active, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.program_id = program_id;
    this.department_id = department_id;
    this.start_year = start_year;
    this.end_year = end_year;
    this.current_semester = current_semester;
    this.current_session_id = current_session_id;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Batch;
