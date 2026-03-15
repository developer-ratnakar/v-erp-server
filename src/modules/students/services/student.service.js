import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import studentRepository from "../repositories/student.repository.js";

class StudentService {
  async createStudent(dto) {
    if (dto.registration_number) {
      const existingStudent = await studentRepository.findStudentByRegistrationNumber(dto.registration_number);
      if (existingStudent) {
        throw new ApiError(409, "Registration number already exists");
      }
    }

    if (dto.apaar_id) {
      const existingStudent = await studentRepository.findStudentByApaarId(dto.apaar_id);
      if (existingStudent) {
        throw new ApiError(409, "APAAR ID already exists");
      }
    }

    await this.validateAcademicReferences(dto);

    return await studentRepository.createStudent(dto);
  }

  async getAllStudents(pagination) {
    return await studentRepository.getAllStudents(pagination);
  }

  async getStudentById(studentId) {
    const student = await studentRepository.findStudentById(studentId);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    return student;
  }

  async updateStudent(studentId, dto) {
    const student = await this.getStudentById(studentId);

    if (dto.registration_number && dto.registration_number !== student.registrationNumber) {
      const existingStudent = await studentRepository.findStudentByRegistrationNumber(dto.registration_number);
      if (existingStudent) {
        throw new ApiError(409, "Registration number already exists");
      }
    }

    if (dto.apaar_id && dto.apaar_id !== student.apaarId) {
      const existingStudent = await studentRepository.findStudentByApaarId(dto.apaar_id);
      if (existingStudent) {
        throw new ApiError(409, "APAAR ID already exists");
      }
    }

    await this.validateAcademicReferences(dto);

    return await studentRepository.updateStudent(studentId, dto);
  }

  async deleteStudent(studentId) {
    await this.getStudentById(studentId);
    await studentRepository.deleteStudent(studentId);
  }

  async saveStudentParent(studentId, dto) {
    await this.getStudentById(studentId);
    return await studentRepository.saveStudentParent({ ...dto, student_id: studentId });
  }

  async getStudentParent(studentId) {
    await this.getStudentById(studentId);

    const parent = await studentRepository.getStudentParent(studentId);

    if (!parent) {
      throw new ApiError(404, "Student parent details not found");
    }

    return parent;
  }

  async deleteStudentParent(studentId) {
    await this.getStudentById(studentId);
    await studentRepository.deleteStudentParent(studentId);
  }

  async createStudentAddress(studentId, dto) {
    await this.getStudentById(studentId);
    return await studentRepository.createStudentAddress({ ...dto, student_id: studentId });
  }

  async getStudentAddresses(studentId) {
    await this.getStudentById(studentId);
    return await studentRepository.getStudentAddresses(studentId);
  }

  async updateStudentAddress(studentId, addressId, dto) {
    await this.getStudentById(studentId);
    const address = await studentRepository.findStudentAddressById(addressId);

    if (!address || address.studentId !== Number(studentId)) {
      throw new ApiError(404, "Student address not found");
    }

    return await studentRepository.updateStudentAddress(addressId, dto);
  }

  async deleteStudentAddress(studentId, addressId) {
    await this.getStudentById(studentId);
    const address = await studentRepository.findStudentAddressById(addressId);

    if (!address || address.studentId !== Number(studentId)) {
      throw new ApiError(404, "Student address not found");
    }

    await studentRepository.deleteStudentAddress(addressId);
  }

  async createStudentDocument(studentId, dto) {
    await this.getStudentById(studentId);
    return await studentRepository.createStudentDocument({ ...dto, student_id: studentId });
  }

  async getStudentDocuments(studentId) {
    await this.getStudentById(studentId);
    return await studentRepository.getStudentDocuments(studentId);
  }

  async updateStudentDocument(studentId, documentId, dto) {
    await this.getStudentById(studentId);
    const document = await studentRepository.findStudentDocumentById(documentId);

    if (!document || document.studentId !== Number(studentId)) {
      throw new ApiError(404, "Student document not found");
    }

    return await studentRepository.updateStudentDocument(documentId, dto);
  }

  async deleteStudentDocument(studentId, documentId) {
    await this.getStudentById(studentId);
    const document = await studentRepository.findStudentDocumentById(documentId);

    if (!document || document.studentId !== Number(studentId)) {
      throw new ApiError(404, "Student document not found");
    }

    await studentRepository.deleteStudentDocument(documentId);
  }

  async changeStudentDepartment(studentId, dto) {
    const student = await this.getStudentById(studentId);

    await this.validateAcademicReferences({
      program_id: dto.to_program_id,
      department_id: dto.to_department_id,
      batch_id: dto.to_batch_id,
      semester_id: dto.to_semester_id,
    });

    const updatedStudent = await studentRepository.updateStudent(studentId, {
      program_id: dto.to_program_id ?? student.programId,
      department_id: dto.to_department_id ?? student.departmentId,
      batch_id: dto.to_batch_id ?? student.batchId,
      semester_id: dto.to_semester_id ?? student.semesterId,
    });

    const transfer = await studentRepository.createDepartmentTransfer({
      student_id: studentId,
      from_program_id: student.programId,
      from_department_id: student.departmentId,
      from_batch_id: student.batchId,
      from_semester_id: student.semesterId,
      to_program_id: dto.to_program_id ?? student.programId,
      to_department_id: dto.to_department_id ?? student.departmentId,
      to_batch_id: dto.to_batch_id ?? student.batchId,
      to_semester_id: dto.to_semester_id ?? student.semesterId,
      reason: dto.reason,
      effective_date: dto.effective_date,
    });

    return {
      student: updatedStudent,
      transfer,
    };
  }

  async getStudentDepartmentTransfers(studentId) {
    await this.getStudentById(studentId);
    return await studentRepository.getDepartmentTransfers(studentId);
  }

  async validateAcademicReferences(dto) {
    const referenceChecks = [];

    if (dto.program_id) {
      referenceChecks.push(
        academicRepository.findProgramById(dto.program_id).then((program) => {
          if (!program) throw new ApiError(404, "Program not found");
        }),
      );
    }

    if (dto.department_id) {
      referenceChecks.push(
        academicRepository.findDepartmentById(dto.department_id).then((department) => {
          if (!department) throw new ApiError(404, "Department not found");
        }),
      );
    }

    if (dto.batch_id) {
      referenceChecks.push(
        academicRepository.findBatchById(dto.batch_id).then((batch) => {
          if (!batch) throw new ApiError(404, "Batch not found");
        }),
      );
    }

    if (dto.semester_id) {
      referenceChecks.push(
        academicRepository.findSemesterById(dto.semester_id).then((semester) => {
          if (!semester) throw new ApiError(404, "Semester not found");
        }),
      );
    }

    await Promise.all(referenceChecks);
  }
}

export default new StudentService();
