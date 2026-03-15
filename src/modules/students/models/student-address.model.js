class StudentAddress {
  constructor({
    id,
    student_id,
    address_type,
    country,
    state,
    district,
    city,
    pincode,
    address_line1,
    address_line2,
  }) {
    this.id = id;
    this.studentId = student_id;
    this.addressType = address_type;
    this.country = country;
    this.state = state;
    this.district = district;
    this.city = city;
    this.pincode = pincode;
    this.addressLine1 = address_line1;
    this.addressLine2 = address_line2;
  }
}

export default StudentAddress;
