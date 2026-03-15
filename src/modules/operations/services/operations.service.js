import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import operationsRepository from "../repositories/operations.repository.js";

class OperationsService {
  async createSubject(dto) {
    const [existingSubject, department] = await Promise.all([
      operationsRepository.findSubjectByCode(dto.code),
      academicRepository.findDepartmentById(dto.department_id),
    ]);

    if (existingSubject) {
      throw new ApiError(409, "Subject code already exists");
    }

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    await this.validateAcademicReferences(dto);

    return await operationsRepository.createSubject(dto);
  }

  async getAllSubjects(pagination) {
    return await operationsRepository.getAllSubjects(pagination);
  }

  async getSubjectById(subjectId) {
    const subject = await operationsRepository.findSubjectById(subjectId);

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    return subject;
  }

  async updateSubject(subjectId, dto) {
    await this.getSubjectById(subjectId);

    if (dto.code) {
      const existingSubject = await operationsRepository.findSubjectByCode(dto.code);
      if (existingSubject && existingSubject.id !== Number(subjectId)) {
        throw new ApiError(409, "Subject code already exists");
      }
    }

    if (dto.department_id) {
      const department = await academicRepository.findDepartmentById(dto.department_id);
      if (!department) throw new ApiError(404, "Department not found");
    }

    await this.validateAcademicReferences(dto);
    return await operationsRepository.updateSubject(subjectId, dto);
  }

  async deleteSubject(subjectId) {
    await this.getSubjectById(subjectId);
    await operationsRepository.deleteSubject(subjectId);
  }

  async createTimetable(dto) {
    await this.validateRequiredTimetableReferences(dto);
    return await operationsRepository.createTimetable(dto);
  }

  async getAllTimetables(pagination) {
    return await operationsRepository.getAllTimetables(pagination);
  }

  async getTimetableById(timetableId) {
    const timetable = await operationsRepository.findTimetableById(timetableId);

    if (!timetable) {
      throw new ApiError(404, "Timetable not found");
    }

    return timetable;
  }

  async updateTimetable(timetableId, dto) {
    await this.getTimetableById(timetableId);
    await this.validateRequiredTimetableReferences({
      program_id: dto.program_id,
      department_id: dto.department_id,
      batch_id: dto.batch_id,
      session_id: dto.session_id,
      semester_id: dto.semester_id,
    });
    return await operationsRepository.updateTimetable(timetableId, dto);
  }

  async deleteTimetable(timetableId) {
    await this.getTimetableById(timetableId);
    await operationsRepository.deleteTimetable(timetableId);
  }

  async createTimetableEntry(timetableId, dto) {
    await this.getTimetableById(timetableId);

    if (!dto.is_break && !dto.subject_id) {
      throw new ApiError(400, "subject_id is required for non-break entries");
    }

    if (dto.subject_id) {
      const subject = await operationsRepository.findSubjectById(dto.subject_id);
      if (!subject) {
        throw new ApiError(404, "Subject not found");
      }
    }

    if (dto.faculty_id) {
      const staff = await operationsRepository.findStaffById(dto.faculty_id);
      if (!staff) {
        throw new ApiError(404, "Faculty not found");
      }
    }

    return await operationsRepository.createTimetableEntry({
      ...dto,
      timetable_id: timetableId,
    });
  }

  async getTimetableEntries(timetableId) {
    await this.getTimetableById(timetableId);
    return await operationsRepository.getTimetableEntries(timetableId);
  }

  async updateTimetableEntry(timetableId, entryId, dto) {
    await this.getTimetableById(timetableId);
    const entry = await operationsRepository.findTimetableEntryById(entryId);

    if (!entry || entry.timetableId !== Number(timetableId)) {
      throw new ApiError(404, "Timetable entry not found");
    }

    if (dto.subject_id) {
      const subject = await operationsRepository.findSubjectById(dto.subject_id);
      if (!subject) throw new ApiError(404, "Subject not found");
    }

    if (dto.faculty_id) {
      const staff = await operationsRepository.findStaffById(dto.faculty_id);
      if (!staff) throw new ApiError(404, "Faculty not found");
    }

    if (dto.is_break === false && dto.subject_id === null) {
      throw new ApiError(400, "subject_id is required for non-break entries");
    }

    return await operationsRepository.updateTimetableEntry(entryId, dto);
  }

  async deleteTimetableEntry(timetableId, entryId) {
    await this.getTimetableById(timetableId);
    const entry = await operationsRepository.findTimetableEntryById(entryId);

    if (!entry || entry.timetableId !== Number(timetableId)) {
      throw new ApiError(404, "Timetable entry not found");
    }

    await operationsRepository.deleteTimetableEntry(entryId);
  }

  async validateAcademicReferences(dto) {
    const checks = [];

    if (dto.program_id) {
      checks.push(
        academicRepository.findProgramById(dto.program_id).then((program) => {
          if (!program) throw new ApiError(404, "Program not found");
        }),
      );
    }

    if (dto.semester_id) {
      checks.push(
        academicRepository.findSemesterById(dto.semester_id).then((semester) => {
          if (!semester) throw new ApiError(404, "Semester not found");
        }),
      );
    }

    await Promise.all(checks);
  }

  async validateRequiredTimetableReferences(dto) {
    const [program, department, batch, session, semester] = await Promise.all([
      dto.program_id ? academicRepository.findProgramById(dto.program_id) : Promise.resolve(true),
      dto.department_id ? academicRepository.findDepartmentById(dto.department_id) : Promise.resolve(true),
      dto.batch_id ? academicRepository.findBatchById(dto.batch_id) : Promise.resolve(true),
      dto.session_id ? academicRepository.findSessionById(dto.session_id) : Promise.resolve(true),
      dto.semester_id ? academicRepository.findSemesterById(dto.semester_id) : Promise.resolve(true),
    ]);

    if (dto.program_id && !program) throw new ApiError(404, "Program not found");
    if (dto.department_id && !department) throw new ApiError(404, "Department not found");
    if (dto.batch_id && !batch) throw new ApiError(404, "Batch not found");
    if (dto.session_id && !session) throw new ApiError(404, "Session not found");
    if (dto.semester_id && !semester) throw new ApiError(404, "Semester not found");
  }
}

export default new OperationsService();
