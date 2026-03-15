class Semester {
  constructor({ id, code, name, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Semester;
