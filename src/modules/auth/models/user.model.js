class User {
  constructor({ id, firstName, middleName, lastName, email, password, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by }) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = created_at;
    this.createdBy = created_by;
    this.updatedAt = updated_at;
    this.updatedBy = updated_by;
    this.deletedAt = deleted_at;
    this.deletedBy = deleted_by;
  }
}

export default User;
