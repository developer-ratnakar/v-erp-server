class StudentParent {
  constructor({
    id,
    student_id,
    father_name,
    mother_name,
    guardian_name,
    father_photo_url,
    mother_photo_url,
    guardian_photo_url,
    income_certificate_url,
    caste_certificate_url,
    residence_certificate_url,
  }) {
    this.id = id;
    this.studentId = student_id;
    this.fatherName = father_name;
    this.motherName = mother_name;
    this.guardianName = guardian_name;
    this.fatherPhotoUrl = father_photo_url;
    this.motherPhotoUrl = mother_photo_url;
    this.guardianPhotoUrl = guardian_photo_url;
    this.incomeCertificateUrl = income_certificate_url;
    this.casteCertificateUrl = caste_certificate_url;
    this.residenceCertificateUrl = residence_certificate_url;
  }
}

export default StudentParent;
