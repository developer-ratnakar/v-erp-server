import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../repositories/academic.repository.js";

class AcademicService {
  handleDeleteConflict(error, entityName) {
    if (error.message?.includes("violates foreign key constraint") || error.message?.includes("update or delete on table")) {
      throw new ApiError(409, `Cannot delete ${entityName} because it is in use`);
    }

    throw error;
  }
  async createProgram(dto) {
    const existingProgram = await academicRepository.findProgramByCode(dto.code);

    if (existingProgram) {
      throw new ApiError(409, "Program code already exists");
    }

    return await academicRepository.createProgram(dto);
  }

  async getAllPrograms(pagination) {
    return await academicRepository.getAllPrograms(pagination);
  }

  async getProgramById(id) {
    const program = await academicRepository.findProgramById(id);

    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    return program;
  }

  async updateProgram(id, dto) {
    await this.getProgramById(id);

    if (dto.code) {
      const existingProgram = await academicRepository.findProgramByCode(dto.code);
      if (existingProgram && existingProgram.id !== Number(id)) {
        throw new ApiError(409, "Program code already exists");
      }
    }

    return await academicRepository.updateProgram(id, dto);
  }

  async deleteProgram(id) {
    await this.getProgramById(id);
    try {
      await academicRepository.deleteProgram(id);
    } catch (error) {
      this.handleDeleteConflict(error, "program");
    }
  }

  async createDepartment(dto) {
    const [existingDepartment, program] = await Promise.all([
      academicRepository.findDepartmentByCode(dto.code),
      academicRepository.findProgramById(dto.program_id),
    ]);

    if (existingDepartment) {
      throw new ApiError(409, "Department code already exists");
    }

    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    return await academicRepository.createDepartment(dto);
  }

  async getAllDepartments(pagination) {
    return await academicRepository.getAllDepartments(pagination);
  }

  async getDepartmentById(id) {
    const department = await academicRepository.findDepartmentById(id);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    return department;
  }

  async updateDepartment(id, dto) {
    await this.getDepartmentById(id);

    if (dto.code) {
      const existingDepartment = await academicRepository.findDepartmentByCode(dto.code);
      if (existingDepartment && existingDepartment.id !== Number(id)) {
        throw new ApiError(409, "Department code already exists");
      }
    }

    if (dto.program_id) {
      const program = await academicRepository.findProgramById(dto.program_id);
      if (!program) {
        throw new ApiError(404, "Program not found");
      }
    }

    return await academicRepository.updateDepartment(id, dto);
  }

  async deleteDepartment(id) {
    await this.getDepartmentById(id);
    try {
      await academicRepository.deleteDepartment(id);
    } catch (error) {
      this.handleDeleteConflict(error, "department");
    }
  }

  async createBatch(dto) {
    const program = await academicRepository.findProgramById(dto.program_id);

    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    return await academicRepository.createBatch(dto);
  }

  async getAllBatches(pagination) {
    return await academicRepository.getAllBatches(pagination);
  }

  async getBatchById(id) {
    const batch = await academicRepository.findBatchById(id);

    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    return batch;
  }

  async updateBatch(id, dto) {
    await this.getBatchById(id);

    if (dto.program_id) {
      const program = await academicRepository.findProgramById(dto.program_id);
      if (!program) {
        throw new ApiError(404, "Program not found");
      }
    }

    return await academicRepository.updateBatch(id, dto);
  }

  async deleteBatch(id) {
    await this.getBatchById(id);
    try {
      await academicRepository.deleteBatch(id);
    } catch (error) {
      this.handleDeleteConflict(error, "batch");
    }
  }

  async createSemester(dto) {
    const existingSemester = await academicRepository.findSemesterByCode(dto.code);

    if (existingSemester) {
      throw new ApiError(409, "Semester code already exists");
    }

    return await academicRepository.createSemester(dto);
  }

  async getAllSemesters(pagination) {
    return await academicRepository.getAllSemesters(pagination);
  }

  async getSemesterById(id) {
    const semester = await academicRepository.findSemesterById(id);

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    return semester;
  }

  async updateSemester(id, dto) {
    await this.getSemesterById(id);

    if (dto.code) {
      const existingSemester = await academicRepository.findSemesterByCode(dto.code);
      if (existingSemester && existingSemester.id !== Number(id)) {
        throw new ApiError(409, "Semester code already exists");
      }
    }

    return await academicRepository.updateSemester(id, dto);
  }

  async deleteSemester(id) {
    await this.getSemesterById(id);
    try {
      await academicRepository.deleteSemester(id);
    } catch (error) {
      this.handleDeleteConflict(error, "semester");
    }
  }

  async createSession(dto) {
    const existingSession = await academicRepository.findSessionByName(dto.name);

    if (existingSession) {
      throw new ApiError(409, "Session already exists");
    }

    return await academicRepository.createSession(dto);
  }

  async getAllSessions(pagination) {
    return await academicRepository.getAllSessions(pagination);
  }

  async getSessionById(id) {
    const session = await academicRepository.findSessionById(id);

    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    return session;
  }

  async updateSession(id, dto) {
    await this.getSessionById(id);

    if (dto.name) {
      const existingSession = await academicRepository.findSessionByName(dto.name);
      if (existingSession && existingSession.id !== Number(id)) {
        throw new ApiError(409, "Session already exists");
      }
    }

    return await academicRepository.updateSession(id, dto);
  }

  async deleteSession(id) {
    await this.getSessionById(id);
    try {
      await academicRepository.deleteSession(id);
    } catch (error) {
      this.handleDeleteConflict(error, "session");
    }
  }
}

export default new AcademicService();
