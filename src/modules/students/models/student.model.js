class Student {
  constructor({
    id,
    registration_number,
    apaar_id,
    first_name,
    middle_name,
    last_name,
    dob,
    photo_url,
    email,
    phone_number,
    blood_group,
    admission_type,
    program_id,
    department_id,
    batch_id,
    semester_id,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.registrationNumber = registration_number;
    this.apaarId = apaar_id;
    this.firstName = first_name;
    this.middleName = middle_name;
    this.lastName = last_name;
    this.dob = dob;
    this.photoUrl = photo_url;
    this.email = email;
    this.phoneNumber = phone_number;
    this.bloodGroup = blood_group;
    this.admissionType = admission_type;
    this.programId = program_id;
    this.departmentId = department_id;
    this.batchId = batch_id;
    this.semesterId = semester_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Student;
