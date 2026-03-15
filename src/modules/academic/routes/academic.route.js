import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createBatch,
  createDepartment,
  createProgram,
  createSemester,
  createSession,
  deleteBatch,
  deleteDepartment,
  deleteProgram,
  deleteSemester,
  deleteSession,
  getAllBatches,
  getAllDepartments,
  getAllPrograms,
  getAllSemesters,
  getAllSessions,
  getBatchById,
  getDepartmentById,
  getProgramById,
  getSemesterById,
  getSessionById,
  updateBatch,
  updateDepartment,
  updateProgram,
  updateSemester,
  updateSession,
} from "../controllers/academic.controller.js";
import {
  batchIdParamSchema,
  createBatchSchema,
  createDepartmentSchema,
  createProgramSchema,
  createSemesterSchema,
  createSessionSchema,
  departmentIdParamSchema,
  programIdParamSchema,
  semesterIdParamSchema,
  sessionIdParamSchema,
  updateBatchSchema,
  updateDepartmentSchema,
  updateProgramSchema,
  updateSemesterSchema,
  updateSessionSchema,
} from "../validation/academic.validation.js";

const academicRouter = Router();
academicRouter.use(requireAuth);

academicRouter.post("/programs", requirePermission("academic.write"), validate(createProgramSchema), createProgram);
academicRouter.get("/programs", requirePermission("academic.read"), validate(paginationQuerySchema), getAllPrograms);
academicRouter.get("/programs/:programId", requirePermission("academic.read"), validate(programIdParamSchema), getProgramById);
academicRouter.patch("/programs/:programId", requirePermission("academic.write"), validate(updateProgramSchema), updateProgram);
academicRouter.delete("/programs/:programId", requirePermission("academic.write"), validate(programIdParamSchema), deleteProgram);

academicRouter.post("/departments", requirePermission("academic.write"), validate(createDepartmentSchema), createDepartment);
academicRouter.get("/departments", requirePermission("academic.read"), validate(paginationQuerySchema), getAllDepartments);
academicRouter.get("/departments/:departmentId", requirePermission("academic.read"), validate(departmentIdParamSchema), getDepartmentById);
academicRouter.patch("/departments/:departmentId", requirePermission("academic.write"), validate(updateDepartmentSchema), updateDepartment);
academicRouter.delete("/departments/:departmentId", requirePermission("academic.write"), validate(departmentIdParamSchema), deleteDepartment);

academicRouter.post("/batches", requirePermission("academic.write"), validate(createBatchSchema), createBatch);
academicRouter.get("/batches", requirePermission("academic.read"), validate(paginationQuerySchema), getAllBatches);
academicRouter.get("/batches/:batchId", requirePermission("academic.read"), validate(batchIdParamSchema), getBatchById);
academicRouter.patch("/batches/:batchId", requirePermission("academic.write"), validate(updateBatchSchema), updateBatch);
academicRouter.delete("/batches/:batchId", requirePermission("academic.write"), validate(batchIdParamSchema), deleteBatch);

academicRouter.post("/semesters", requirePermission("academic.write"), validate(createSemesterSchema), createSemester);
academicRouter.get("/semesters", requirePermission("academic.read"), validate(paginationQuerySchema), getAllSemesters);
academicRouter.get("/semesters/:semesterId", requirePermission("academic.read"), validate(semesterIdParamSchema), getSemesterById);
academicRouter.patch("/semesters/:semesterId", requirePermission("academic.write"), validate(updateSemesterSchema), updateSemester);
academicRouter.delete("/semesters/:semesterId", requirePermission("academic.write"), validate(semesterIdParamSchema), deleteSemester);

academicRouter.post("/sessions", requirePermission("academic.write"), validate(createSessionSchema), createSession);
academicRouter.get("/sessions", requirePermission("academic.read"), validate(paginationQuerySchema), getAllSessions);
academicRouter.get("/sessions/:sessionId", requirePermission("academic.read"), validate(sessionIdParamSchema), getSessionById);
academicRouter.patch("/sessions/:sessionId", requirePermission("academic.write"), validate(updateSessionSchema), updateSession);
academicRouter.delete("/sessions/:sessionId", requirePermission("academic.write"), validate(sessionIdParamSchema), deleteSession);

export default academicRouter;
