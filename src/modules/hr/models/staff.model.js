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
    joining_date,
    qualification,
    date_of_birth,
    address,
    blood_group,
    emergency_contact,
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
    this.joiningDate = joining_date;
    this.qualification = qualification;
    this.dateOfBirth = date_of_birth;
    this.address = address;
    this.bloodGroup = blood_group;
    this.emergencyContact = emergency_contact;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Staff;
