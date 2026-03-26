class Semester {
  constructor({ id, code, name, number, type, is_active, created_at, updated_at }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.number = number;
    this.type = type;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Semester;
