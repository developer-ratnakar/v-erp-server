import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import hrRepository from "../../hr/repositories/hr.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import clcRepository from "../repositories/clc.repository.js";

class CLCService {
  async createCertificate(dto) {
    const student = await studentRepository.findStudentById(dto.student_id);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const [parent, addresses] = await Promise.all([
      studentRepository.getStudentParent(dto.student_id),
      studentRepository.getStudentAddresses(dto.student_id),
    ]);

    if (dto.issued_by_staff_id) {
      const staff = await hrRepository.findStaffById(dto.issued_by_staff_id);
      if (!staff) throw new ApiError(404, "Issued-by staff not found");
    }

    if (dto.verified_by_staff_id) {
      const staff = await hrRepository.findStaffById(dto.verified_by_staff_id);
      if (!staff) throw new ApiError(404, "Verified-by staff not found");
    }

    let branchName = dto.branch_name;
    if (!branchName && student.departmentId) {
      const department = await academicRepository.findDepartmentById(student.departmentId);
      branchName = department?.name ?? null;
    }

    if (!branchName) {
      throw new ApiError(400, "branch_name is required when it cannot be derived from the student");
    }

    const studentName = [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" ");

    const currentAddress = addresses.find((address) => address.addressType === "CURRENT") || addresses[0];
    const addressSnapshot = dto.address_snapshot || this.formatAddress(currentAddress);

    const registrationNumber = student.registrationNumber || `STUDENT-${student.id}`;
    const yearSuffix = new Date(dto.date_of_leaving).getFullYear().toString().slice(-2);
    const uniqueSuffix = Date.now().toString().slice(-6);

    const certificate = await clcRepository.createCertificate({
      student_id: dto.student_id,
      certificate_no: dto.certificate_no || `CLC-${uniqueSuffix}`,
      serial_no: dto.serial_no || `${registrationNumber}/${yearSuffix}`,
      institute_name: dto.institute_name || "Vikash Institute of Technology, Bargarh",
      institute_location: dto.institute_location || "Bargarh, Odisha",
      affiliating_body:
        dto.affiliating_body || "Biju Patnaik University of Technology (BPUT), Odisha",
      date_of_admission: dto.date_of_admission,
      date_of_leaving: dto.date_of_leaving,
      branch_name: branchName,
      status_at_leaving: dto.status_at_leaving,
      reason_for_leaving: dto.reason_for_leaving,
      conduct: dto.conduct || "GOOD",
      student_name_snapshot: studentName,
      father_guardian_name_snapshot:
        dto.father_guardian_name_snapshot || parent?.fatherName || parent?.guardianName || null,
      address_snapshot: addressSnapshot,
      dob_snapshot: student.dob,
      registration_number_snapshot: student.registrationNumber,
      photo_url_snapshot: student.photoUrl,
      barcode_value: dto.barcode_value || registrationNumber,
      issued_by_staff_id: dto.issued_by_staff_id,
      verified_by_staff_id: dto.verified_by_staff_id,
      remarks: dto.remarks,
    });
    return await this.enrichCertificate(certificate);
  }

  async enrichCertificate(cert) {
    if (!cert) return null;
    try {
      const student = await studentRepository.findStudentById(cert.studentId);
      if (student) {
        const [parent, program] = await Promise.all([
          studentRepository.getStudentParent(cert.studentId),
          student.programId ? academicRepository.findProgramById(student.programId) : null
        ]);
        cert.motherName = parent?.motherName || null;
        cert.courseName = program?.name || null;
      }
    } catch (err) {
      console.error("Error enriching CLC certificate:", err);
    }
    return cert;
  }

  async getAllCertificates(pagination) {
    const result = await clcRepository.getAllCertificates(pagination);
    if (result && result.data) {
      await Promise.all(result.data.map((cert) => this.enrichCertificate(cert)));
    }
    return result;
  }

  async getCertificateById(certificateId) {
    const certificate = await clcRepository.findCertificateById(certificateId);

    if (!certificate) {
      throw new ApiError(404, "CLC certificate not found");
    }

    return await this.enrichCertificate(certificate);
  }

  async updateCertificate(certificateId, dto) {
    await this.getCertificateById(certificateId);

    if (dto.issued_by_staff_id) {
      const staff = await hrRepository.findStaffById(dto.issued_by_staff_id);
      if (!staff) throw new ApiError(404, "Issued-by staff not found");
    }

    if (dto.verified_by_staff_id) {
      const staff = await hrRepository.findStaffById(dto.verified_by_staff_id);
      if (!staff) throw new ApiError(404, "Verified-by staff not found");
    }

    const updated = await clcRepository.updateCertificate(certificateId, dto);
    return await this.enrichCertificate(updated);
  }

  async deleteCertificate(certificateId) {
    await this.getCertificateById(certificateId);
    await clcRepository.deleteCertificate(certificateId);
  }

  async getCertificatesByStudentId(studentId) {
    const student = await studentRepository.findStudentById(studentId);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const certificates = await clcRepository.getCertificatesByStudentId(studentId);
    if (certificates) {
      await Promise.all(certificates.map((cert) => this.enrichCertificate(cert)));
    }
    return certificates;
  }

  formatAddress(address) {
    if (!address) {
      return null;
    }

    return [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.district,
      address.state,
      address.pincode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  }
}

export default new CLCService();
