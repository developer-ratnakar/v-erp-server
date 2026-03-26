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
    gender,
    category,
    sc_st_scheme,
    tenth_percent,
    tenth_board,
    inter_percent,
    inter_board,
    aadhar_number,
    alt_contact,
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
    this.gender = gender;
    this.category = category;
    this.scStScheme = sc_st_scheme;
    this.tenthPercent = tenth_percent;
    this.tenthBoard = tenth_board;
    this.interPercent = inter_percent;
    this.interBoard = inter_board;
    this.aadharNumber = aadhar_number;
    this.altContact = alt_contact;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Student;
