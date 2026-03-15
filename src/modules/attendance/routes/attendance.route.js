import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createAttendance,
  deleteAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
} from "../controllers/attendance.controller.js";
import {
  attendanceIdParamSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from "../validation/attendance.validation.js";

const attendanceRouter = Router();
attendanceRouter.use(requireAuth);

attendanceRouter.post("/", requirePermission("attendance.write"), validate(createAttendanceSchema), createAttendance);
attendanceRouter.get("/", requirePermission("attendance.read"), validate(paginationQuerySchema), getAllAttendance);
attendanceRouter.get("/:attendanceId", requirePermission("attendance.read"), validate(attendanceIdParamSchema), getAttendanceById);
attendanceRouter.patch("/:attendanceId", requirePermission("attendance.write"), validate(updateAttendanceSchema), updateAttendance);
attendanceRouter.delete("/:attendanceId", requirePermission("attendance.write"), validate(attendanceIdParamSchema), deleteAttendance);

export default attendanceRouter;
