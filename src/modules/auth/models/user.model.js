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
    this.id = id
    this.firstName = firstName ?? first_name ?? null
    this.middleName = middleName ?? middle_name ?? null
    this.lastName = lastName ?? last_name ?? null
    this.email = email
    this.password = password
    this.createdAt = created_at
    this.createdBy = created_by
    this.updatedAt = updated_at
    this.updatedBy = updated_by
    this.deletedAt = deleted_at
    this.deletedBy = deleted_by
  }

  toPersistence() {
    return {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    }
  }
}

export default User
