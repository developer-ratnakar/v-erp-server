import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  changeStudentDepartment,
  createStudent,
  createStudentAddress,
  createStudentDocument,
  deleteStudent,
  deleteStudentAddress,
  deleteStudentDocument,
  deleteStudentParent,
  getAllStudents,
  getStudentAddresses,
  getStudentById,
  getStudentDepartmentTransfers,
  getStudentDocuments,
  getStudentParent,
  saveStudentParent,
  updateStudent,
  updateStudentAddress,
  updateStudentDocument,
} from "../controllers/student.controller.js";
import {
  addressIdParamSchema,
  changeStudentDepartmentSchema,
  createStudentAddressSchema,
  createStudentDocumentSchema,
  createStudentSchema,
  documentIdParamSchema,
  saveStudentParentSchema,
  studentIdParamSchema,
  updateStudentAddressSchema,
  updateStudentDocumentSchema,
  updateStudentSchema,
} from "../validation/student.validation.js";

const studentRouter = Router();
studentRouter.use(requireAuth);

studentRouter.post("/", requirePermission("students.write"), validate(createStudentSchema), createStudent);
studentRouter.get("/", requirePermission("students.read"), validate(paginationQuerySchema), getAllStudents);
studentRouter.get("/:studentId", requirePermission("students.read"), validate(studentIdParamSchema), getStudentById);
studentRouter.patch("/:studentId", requirePermission("students.write"), validate(updateStudentSchema), updateStudent);
studentRouter.delete("/:studentId", requirePermission("students.write"), validate(studentIdParamSchema), deleteStudent);

studentRouter.put("/:studentId/parent", requirePermission("students.write"), validate(saveStudentParentSchema), saveStudentParent);
studentRouter.get("/:studentId/parent", requirePermission("students.read"), validate(studentIdParamSchema), getStudentParent);
studentRouter.delete("/:studentId/parent", requirePermission("students.write"), validate(studentIdParamSchema), deleteStudentParent);

studentRouter.post("/:studentId/addresses", requirePermission("students.write"), validate(createStudentAddressSchema), createStudentAddress);
studentRouter.get("/:studentId/addresses", requirePermission("students.read"), validate(studentIdParamSchema), getStudentAddresses);
studentRouter.patch("/:studentId/addresses/:addressId", requirePermission("students.write"), validate(updateStudentAddressSchema), updateStudentAddress);
studentRouter.delete("/:studentId/addresses/:addressId", requirePermission("students.write"), validate(addressIdParamSchema), deleteStudentAddress);

studentRouter.post("/:studentId/documents", requirePermission("students.write"), validate(createStudentDocumentSchema), createStudentDocument);
studentRouter.get("/:studentId/documents", requirePermission("students.read"), validate(studentIdParamSchema), getStudentDocuments);
studentRouter.patch("/:studentId/documents/:documentId", requirePermission("students.write"), validate(updateStudentDocumentSchema), updateStudentDocument);
studentRouter.delete("/:studentId/documents/:documentId", requirePermission("students.write"), validate(documentIdParamSchema), deleteStudentDocument);
studentRouter.patch("/:studentId/department", requirePermission("students.write"), validate(changeStudentDepartmentSchema), changeStudentDepartment);
studentRouter.get("/:studentId/department-transfers", requirePermission("students.read"), validate(studentIdParamSchema), getStudentDepartmentTransfers);

export default studentRouter;
