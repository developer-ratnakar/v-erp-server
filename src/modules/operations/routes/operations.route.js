import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createSubject,
  createTimetable,
  createTimetableEntry,
  deleteSubject,
  deleteTimetable,
  deleteTimetableEntry,
  getAllSubjects,
  getAllTimetables,
  getSubjectById,
  getTimetableById,
  getTimetableEntries,
  updateSubject,
  updateTimetable,
  updateTimetableEntry,
} from "../controllers/operations.controller.js";
import {
  createSubjectSchema,
  createTimetableEntrySchema,
  createTimetableSchema,
  entryIdParamSchema,
  subjectIdParamSchema,
  timetableIdParamSchema,
  updateSubjectSchema,
  updateTimetableEntrySchema,
  updateTimetableSchema,
} from "../validation/operations.validation.js";

const operationsRouter = Router();
operationsRouter.use(requireAuth);

operationsRouter.post("/subjects", requirePermission("operations.write"), validate(createSubjectSchema), createSubject);
operationsRouter.get("/subjects", requirePermission("operations.read"), validate(paginationQuerySchema), getAllSubjects);
operationsRouter.get("/subjects/:subjectId", requirePermission("operations.read"), validate(subjectIdParamSchema), getSubjectById);
operationsRouter.patch("/subjects/:subjectId", requirePermission("operations.write"), validate(updateSubjectSchema), updateSubject);
operationsRouter.delete("/subjects/:subjectId", requirePermission("operations.write"), validate(subjectIdParamSchema), deleteSubject);

operationsRouter.post("/timetables", requirePermission("operations.write"), validate(createTimetableSchema), createTimetable);
operationsRouter.get("/timetables", requirePermission("operations.read"), validate(paginationQuerySchema), getAllTimetables);
operationsRouter.get("/timetables/:timetableId", requirePermission("operations.read"), validate(timetableIdParamSchema), getTimetableById);
operationsRouter.patch("/timetables/:timetableId", requirePermission("operations.write"), validate(updateTimetableSchema), updateTimetable);
operationsRouter.delete("/timetables/:timetableId", requirePermission("operations.write"), validate(timetableIdParamSchema), deleteTimetable);
operationsRouter.post("/timetables/:timetableId/entries", requirePermission("operations.write"), validate(createTimetableEntrySchema), createTimetableEntry);
operationsRouter.get("/timetables/:timetableId/entries", requirePermission("operations.read"), validate(timetableIdParamSchema), getTimetableEntries);
operationsRouter.patch("/timetables/:timetableId/entries/:entryId", requirePermission("operations.write"), validate(updateTimetableEntrySchema), updateTimetableEntry);
operationsRouter.delete("/timetables/:timetableId/entries/:entryId", requirePermission("operations.write"), validate(entryIdParamSchema), deleteTimetableEntry);

export default operationsRouter;
