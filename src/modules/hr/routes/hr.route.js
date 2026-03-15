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
} from "../controllers/hr.controller.js";
import {
  createStaffSchema,
  staffIdParamSchema,
  updateStaffSchema,
} from "../validation/hr.validation.js";

const hrRouter = Router();
hrRouter.use(requireAuth);

hrRouter.post("/staff", requirePermission("hr.write"), validate(createStaffSchema), createStaff);
hrRouter.get("/staff", requirePermission("hr.read"), validate(paginationQuerySchema), getAllStaff);
hrRouter.get("/staff/:staffId", requirePermission("hr.read"), validate(staffIdParamSchema), getStaffById);
hrRouter.patch("/staff/:staffId", requirePermission("hr.write"), validate(updateStaffSchema), updateStaff);
hrRouter.delete("/staff/:staffId", requirePermission("hr.write"), validate(staffIdParamSchema), deleteStaff);

export default hrRouter;
