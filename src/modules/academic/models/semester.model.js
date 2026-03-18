class Semester {
  constructor({ id, code, name, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Semester;
