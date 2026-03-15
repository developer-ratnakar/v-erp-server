class Staff {
  constructor({
    id,
    name,
    designation,
    department_id,
    contact_number,
    email,
    role,
    user_id,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.designation = designation;
    this.departmentId = department_id;
    this.contactNumber = contact_number;
    this.email = email;
    this.role = role;
    this.userId = user_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Staff;
