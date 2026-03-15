import { Router } from "express";
import { requireAuth, requirePermission } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../../common/validation/pagination.validation.js";
import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificatesByStudentId,
  updateCertificate,
} from "../controllers/clc.controller.js";
import {
  clcIdParamSchema,
  createCLCSchema,
  studentCLCParamSchema,
  updateCLCSchema,
} from "../validation/clc.validation.js";

const clcRouter = Router();
clcRouter.use(requireAuth);

clcRouter.post("/", requirePermission("clc.write"), validate(createCLCSchema), createCertificate);
clcRouter.get("/", requirePermission("clc.read"), validate(paginationQuerySchema), getAllCertificates);
clcRouter.get("/:certificateId", requirePermission("clc.read"), validate(clcIdParamSchema), getCertificateById);
clcRouter.patch("/:certificateId", requirePermission("clc.write"), validate(updateCLCSchema), updateCertificate);
clcRouter.delete("/:certificateId", requirePermission("clc.write"), validate(clcIdParamSchema), deleteCertificate);
clcRouter.get("/student/:studentId", requirePermission("clc.read"), validate(studentCLCParamSchema), getCertificatesByStudentId);

export default clcRouter;
