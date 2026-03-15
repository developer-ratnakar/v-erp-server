import academicService from "../services/academic.service.js";
import { getPagination } from "../../../utils/pagination.js";

export const createProgram = async (req, res, next) => {
  try {
    const program = await academicService.createProgram(req.body);
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
};

export const getAllPrograms = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const programs = await academicService.getAllPrograms(pagination);
    res.status(200).json({
      data: programs.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: programs.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (req, res, next) => {
  try {
    const program = await academicService.getProgramById(req.params.programId);
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const updateProgram = async (req, res, next) => {
  try {
    const program = await academicService.updateProgram(req.params.programId, req.body);
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const deleteProgram = async (req, res, next) => {
  try {
    await academicService.deleteProgram(req.params.programId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await academicService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

export const getAllDepartments = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const departments = await academicService.getAllDepartments(pagination);
    res.status(200).json({
      data: departments.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: departments.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await academicService.getDepartmentById(req.params.departmentId);
    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await academicService.updateDepartment(req.params.departmentId, req.body);
    res.status(200).json(department);
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    await academicService.deleteDepartment(req.params.departmentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createBatch = async (req, res, next) => {
  try {
    const batch = await academicService.createBatch(req.body);
    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
};

export const getAllBatches = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const batches = await academicService.getAllBatches(pagination);
    res.status(200).json({
      data: batches.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: batches.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBatchById = async (req, res, next) => {
  try {
    const batch = await academicService.getBatchById(req.params.batchId);
    res.status(200).json(batch);
  } catch (error) {
    next(error);
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const batch = await academicService.updateBatch(req.params.batchId, req.body);
    res.status(200).json(batch);
  } catch (error) {
    next(error);
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    await academicService.deleteBatch(req.params.batchId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createSemester = async (req, res, next) => {
  try {
    const semester = await academicService.createSemester(req.body);
    res.status(201).json(semester);
  } catch (error) {
    next(error);
  }
};

export const getAllSemesters = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const semesters = await academicService.getAllSemesters(pagination);
    res.status(200).json({
      data: semesters.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: semesters.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSemesterById = async (req, res, next) => {
  try {
    const semester = await academicService.getSemesterById(req.params.semesterId);
    res.status(200).json(semester);
  } catch (error) {
    next(error);
  }
};

export const updateSemester = async (req, res, next) => {
  try {
    const semester = await academicService.updateSemester(req.params.semesterId, req.body);
    res.status(200).json(semester);
  } catch (error) {
    next(error);
  }
};

export const deleteSemester = async (req, res, next) => {
  try {
    await academicService.deleteSemester(req.params.semesterId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await academicService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getAllSessions = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const sessions = await academicService.getAllSessions(pagination);
    res.status(200).json({
      data: sessions.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: sessions.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await academicService.getSessionById(req.params.sessionId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await academicService.updateSession(req.params.sessionId, req.body);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    await academicService.deleteSession(req.params.sessionId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
