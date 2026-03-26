class User {
  constructor({
    id,
    firstName,
    first_name,
    middleName,
    middle_name,
    lastName,
    last_name,
    email,
    password,
    created_at,
    created_by,
    updated_at,
    updated_by,
    deleted_at,
    deleted_by,
  }) {
    this.id = id || null
    this.firstName = firstName ?? first_name ?? null
    this.middleName = middleName ?? middle_name ?? null
    this.lastName = lastName ?? last_name ?? null
    this.email = email || null
    this.password = password || null
    this.createdAt = created_at || null
    this.createdBy = created_by || null
    this.updatedAt = updated_at || null
    this.updatedBy = updated_by || null
    this.deletedAt = deleted_at || null
    this.deletedBy = deleted_by || null
  }

  toPersistence() {
    return {
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
    }
  }
}

export default User
