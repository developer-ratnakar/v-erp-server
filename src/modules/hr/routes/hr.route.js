import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  upsertAttendance,
  getAttendance,
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  getStaffLoad,
} from "../controllers/hr.controller.js";
import {
  createStaffSchema,
  staffIdParamSchema,
  updateStaffSchema,
  upsertAttendanceSchema,
  applyLeaveSchema,
  leaveIdParamSchema,
  updateLeaveStatusSchema,
} from "../validation/hr.validation.js";

const hrRouter = Router();
hrRouter.use(requireAuth);

hrRouter.post("/staff", requirePermission("hr.write"), validate(createStaffSchema), createStaff);
hrRouter.get("/staff", requirePermission("hr.read"), validate(paginationQuerySchema), getAllStaff);
hrRouter.get("/staff/:staffId", requirePermission("hr.read"), validate(staffIdParamSchema), getStaffById);
hrRouter.patch("/staff/:staffId", requirePermission("hr.write"), validate(updateStaffSchema), updateStaff);
hrRouter.delete("/staff/:staffId", requirePermission("hr.write"), validate(staffIdParamSchema), deleteStaff);

// Attendance
hrRouter.post("/attendance/bulk", requirePermission("hr.write"), validate(upsertAttendanceSchema), upsertAttendance);
hrRouter.get("/attendance", requirePermission("hr.read"), getAttendance);

// Leaves
hrRouter.post("/leaves", requirePermission("hr.write"), validate(applyLeaveSchema), applyLeave);
hrRouter.get("/leaves", requirePermission("hr.read"), getLeaves);
hrRouter.get("/staff/:staffId/leaves", requirePermission("hr.read"), validate(staffIdParamSchema), getLeaves);
hrRouter.get("/staff/:staffId/load", requirePermission("hr.read"), validate(staffIdParamSchema), getStaffLoad);
hrRouter.patch("/leaves/:leaveId/status", requirePermission("hr.write"), validate(updateLeaveStatusSchema), updateLeaveStatus);

export default hrRouter;
