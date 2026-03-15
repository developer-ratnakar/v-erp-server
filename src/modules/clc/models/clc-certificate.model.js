class CLCCertificate {
  constructor({
    id,
    student_id,
    certificate_no,
    serial_no,
    institute_name,
    institute_location,
    affiliating_body,
    issue_date,
    date_of_admission,
    date_of_leaving,
    branch_name,
    status_at_leaving,
    reason_for_leaving,
    conduct,
    student_name_snapshot,
    father_guardian_name_snapshot,
    address_snapshot,
    dob_snapshot,
    registration_number_snapshot,
    photo_url_snapshot,
    barcode_value,
    issued_by_staff_id,
    verified_by_staff_id,
    remarks,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.studentId = student_id;
    this.certificateNo = certificate_no;
    this.serialNo = serial_no;
    this.instituteName = institute_name;
    this.instituteLocation = institute_location;
    this.affiliatingBody = affiliating_body;
    this.issueDate = issue_date;
    this.dateOfAdmission = date_of_admission;
    this.dateOfLeaving = date_of_leaving;
    this.branchName = branch_name;
    this.statusAtLeaving = status_at_leaving;
    this.reasonForLeaving = reason_for_leaving;
    this.conduct = conduct;
    this.studentNameSnapshot = student_name_snapshot;
    this.fatherGuardianNameSnapshot = father_guardian_name_snapshot;
    this.addressSnapshot = address_snapshot;
    this.dobSnapshot = dob_snapshot;
    this.registrationNumberSnapshot = registration_number_snapshot;
    this.photoUrlSnapshot = photo_url_snapshot;
    this.barcodeValue = barcode_value;
    this.issuedByStaffId = issued_by_staff_id;
    this.verifiedByStaffId = verified_by_staff_id;
    this.remarks = remarks;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default CLCCertificate;
