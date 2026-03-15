class Batch {
  constructor({ id, name, program_id, start_year, end_year, is_active, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.programId = program_id;
    this.startYear = start_year;
    this.endYear = end_year;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Batch;
