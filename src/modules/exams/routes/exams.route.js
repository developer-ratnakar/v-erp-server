import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createExam,
  createExamMark,
  createExamResult,
  deleteExam,
  deleteExamMark,
  deleteExamResult,
  getAllExams,
  getExamById,
  getExamMarkById,
  getExamMarks,
  getExamResultById,
  bulkCreateOrUpdateMarks,
  generateResults,
  bulkUpsertResults,
  getStudentCGPA,
  updateExam,
  getExamResults,
  updateExamResult,
  updateExamMark,
  getGradeReport
} from "../controllers/exams.controller.js";
import {
  createExamMarkSchema,
  createExamResultSchema,
  createExamSchema,
  updateExamMarkSchema,
  updateExamResultSchema,
  updateExamSchema,
  examIdParamSchema,
  markIdParamSchema,
  resultIdParamSchema,
  gradeReportParamSchema,
} from "../validation/exams.validation.js";

const examsRouter = Router();
examsRouter.use(requireAuth);

examsRouter.post("/", requirePermission("exams.write"), validate(createExamSchema), createExam);
examsRouter.get("/", requirePermission("exams.read"), validate(paginationQuerySchema), getAllExams);
examsRouter.get("/:examId", requirePermission("exams.read"), validate(examIdParamSchema), getExamById);
examsRouter.patch("/:examId", requirePermission("exams.write"), validate(updateExamSchema), updateExam);
examsRouter.delete("/:examId", requirePermission("exams.write"), validate(examIdParamSchema), deleteExam);

examsRouter.post("/:examId/results", requirePermission("exams.write"), validate(createExamResultSchema), createExamResult);
examsRouter.get("/:examId/results", requirePermission("exams.read"), validate(examIdParamSchema), getExamResults);
examsRouter.get("/results/:resultId", requirePermission("exams.read"), validate(resultIdParamSchema), getExamResultById);
examsRouter.patch("/results/:resultId", requirePermission("exams.write"), validate(updateExamResultSchema), updateExamResult);
examsRouter.delete("/results/:resultId", requirePermission("exams.write"), validate(resultIdParamSchema), deleteExamResult);

examsRouter.post("/:examId/marks", requirePermission("exams.write"), validate(createExamMarkSchema), createExamMark);
examsRouter.get("/:examId/marks", requirePermission("exams.read"), validate(examIdParamSchema), getExamMarks);
examsRouter.get("/marks/:markId", requirePermission("exams.read"), validate(markIdParamSchema), getExamMarkById);
examsRouter.patch("/marks/:markId", requirePermission("exams.write"), validate(updateExamMarkSchema), updateExamMark);
examsRouter.delete("/marks/:markId", requirePermission("exams.write"), validate(markIdParamSchema), deleteExamMark);

examsRouter.post("/:examId/marks/bulk", requirePermission("exams.write"), validate(examIdParamSchema), bulkCreateOrUpdateMarks);
examsRouter.post("/:examId/results/generate", requirePermission("exams.write"), validate(examIdParamSchema), generateResults);
examsRouter.post("/:examId/results/bulk", requirePermission("exams.write"), validate(examIdParamSchema), bulkUpsertResults);
examsRouter.get("/students/:studentId/cgpa", requirePermission("exams.read"), getStudentCGPA);
examsRouter.get("/:examId/students/:studentId/report", requirePermission("exams.read"), validate(gradeReportParamSchema), getGradeReport);

export default examsRouter;
