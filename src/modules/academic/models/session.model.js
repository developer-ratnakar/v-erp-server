class Session {
  constructor({ id, name, start_date, end_date, is_current, is_active, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.start_date = start_date;
    this.end_date = end_date;
    this.is_current = is_current;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default Session;
