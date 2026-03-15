class Session {
  constructor({ id, name, start_date, end_date, is_current, is_active, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.startDate = start_date;
    this.endDate = end_date;
    this.isCurrent = is_current;
    this.isActive = is_active;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Session;
