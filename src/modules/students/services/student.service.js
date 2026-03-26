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

    if (!address || address.studentId !== studentId) {
      throw new ApiError(404, "Student address not found");
    }

    return await studentRepository.updateStudentAddress(addressId, dto);
  }

  async deleteStudentAddress(studentId, addressId) {
    await this.getStudentById(studentId);
    const address = await studentRepository.findStudentAddressById(addressId);

    if (!address || address.studentId !== studentId) {
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

    if (!document || document.studentId !== studentId) {
      throw new ApiError(404, "Student document not found");
    }

    return await studentRepository.updateStudentDocument(documentId, dto);
  }

  async deleteStudentDocument(studentId, documentId) {
    await this.getStudentById(studentId);
    const document = await studentRepository.findStudentDocumentById(documentId);

    if (!document || document.studentId !== studentId) {
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

  async bulkCreateStudents(rawStudentsData) {
    const results = {
      success: [],
      errors: [],
    };

    // Normalize headers (handle potential truncations from Excel/Display and user-friendly names)
    const studentsData = rawStudentsData.map(row => {
      const normalized = { ...row };
      const mapping = {
        'father_na': 'father_name',
        'mother_n': 'mother_name',
        'guardian_': 'guardian_name',
        'address_li': 'address_line1',
        // User requested names
        'Gender': 'gender',
        'Category': 'category',
        'Student Contact': 'phone_number',
        'Father Contact': 'father_contact',
        'Student mail id': 'email',
        'SC/ST Scheme': 'sc_st_scheme',
        '10th Perc': 'tenth_percent',
        '10th Board': 'tenth_board',
        'Inter Perc': 'inter_percent',
        'Inter Board': 'inter_board',
        'Aadhar Number': 'aadhar_number',
        'Parents Email Id': 'parents_email',
        'Alt Contact': 'alt_contact',
      };
      
      Object.keys(row).forEach(key => {
        // Match mapping directly or case-insensitive
        const mappingKey = Object.keys(mapping).find(m => m.toLowerCase() === key.toLowerCase().trim());
        if (mappingKey) {
          normalized[mapping[mappingKey]] = row[key];
        }
      });

      // Cleanup: convert empty strings to undefined for optional fields
      Object.keys(normalized).forEach(key => {
        if (normalized[key] === '') {
          normalized[key] = undefined;
        }
      });

      return normalized;
    });

    // 1. Validation and existence checks (Bulk optimized)
    const registrationNumbers = studentsData.map(s => s.registration_number).filter(Boolean);
    const existingRegNumbersList = await studentRepository.findStudentsByRegistrationNumbers(registrationNumbers);
    const existingRegNumbers = new Set(existingRegNumbersList.map(s => s.registration_number));

    const refCache = {
      programs: new Map(),
      departments: new Map(),
      batches: new Map(),
      semesters: new Map()
    };

    const validateReferencesCached = async (dto) => {
      const checks = [];

      if (dto.program_id && !refCache.programs.has(dto.program_id)) {
        checks.push(academicRepository.findProgramById(dto.program_id).then(p => {
          if (!p) throw new ApiError(404, "Program not found");
          refCache.programs.set(dto.program_id, true);
        }));
      }

      if (dto.department_id && !refCache.departments.has(dto.department_id)) {
        checks.push(academicRepository.findDepartmentById(dto.department_id).then(d => {
          if (!d) throw new ApiError(404, "Department not found");
          refCache.departments.set(dto.department_id, true);
        }));
      }

      if (dto.batch_id && !refCache.batches.has(dto.batch_id)) {
        checks.push(academicRepository.findBatchById(dto.batch_id).then(b => {
          if (!b) throw new ApiError(404, "Batch not found");
          refCache.batches.set(dto.batch_id, true);
        }));
      }

      if (dto.semester_id && !refCache.semesters.has(dto.semester_id)) {
        checks.push(academicRepository.findSemesterById(dto.semester_id).then(s => {
          if (!s) throw new ApiError(404, "Semester not found");
          refCache.semesters.set(dto.semester_id, true);
        }));
      }

      await Promise.all(checks);
    };

    for (let i = 0; i < studentsData.length; i++) {
      const dto = studentsData[i];
      try {
        if (dto.registration_number && existingRegNumbers.has(dto.registration_number)) {
          throw new Error(`Registration number ${dto.registration_number} already exists`);
        }
        
        await validateReferencesCached(dto);
      } catch (error) {
        results.errors.push({ row: i + 1, message: error.message, data: dto });
      }
    }

    if (results.errors.length > 0) {
      throw new ApiError(400, "Validation failed for some rows", results.errors);
    }

    // 2. Insert Core Students
    const studentCoreFields = [
      "first_name", "middle_name", "last_name", "dob", "email", "phone_number", 
      "registration_number", "apaar_id", "blood_group", "admission_type", 
      "program_id", "department_id", "batch_id", "semester_id",
      "gender", "category", "sc_st_scheme", "tenth_percent", "tenth_board", "inter_percent", "inter_board", "aadhar_number", "alt_contact"
    ];

    const coreStudents = studentsData.map(data => {
      const core = {};
      studentCoreFields.forEach(field => {
        if (data[field] !== undefined) core[field] = data[field];
      });
      return core;
    });

    const createdStudents = await studentRepository.createStudentsBulk(coreStudents);

    // 3. Insert Linked Parents and Addresses
    const parentsToInsert = [];
    const addressesToInsert = [];

    createdStudents.forEach((student, index) => {
      const originalData = studentsData[index];
      
      // Parent Data
      if (originalData.father_name || originalData.mother_name || originalData.guardian_name || originalData.father_contact || originalData.parents_email) {
        parentsToInsert.push({
          student_id: student.id,
          father_name: originalData.father_name,
          mother_name: originalData.mother_name,
          guardian_name: originalData.guardian_name,
          father_contact: originalData.father_contact,
          parents_email: originalData.parents_email
        });
      }

      // Address Data
      if (originalData.country || originalData.state || originalData.address_line1) {
        addressesToInsert.push({
          student_id: student.id,
          address_type: "PERMANENT",
          country: originalData.country,
          state: originalData.state,
          district: originalData.district,
          city: originalData.city,
          pincode: originalData.pincode,
          address_line1: originalData.address_line1,
          address_line2: originalData.address_line2
        });
      }
    });

    if (parentsToInsert.length > 0) {
      await studentRepository.createParentsBulk(parentsToInsert);
    }

    if (addressesToInsert.length > 0) {
      await studentRepository.createAddressesBulk(addressesToInsert);
    }

    return createdStudents;
  }
}

export default new StudentService();
