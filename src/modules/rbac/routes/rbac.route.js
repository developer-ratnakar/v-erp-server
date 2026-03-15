import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  assignPermissionToRole,
  assignRoleToUser,
  checkUserPermission,
  createPermission,
  createRole,
  getAllPermissions,
  getAllRoles,
  getRolePermissions,
  getUserPermissions,
  getUserRoles,
} from "../controllers/rbac.controller.js";
import {
  assignPermissionToRoleSchema,
  assignRoleToUserSchema,
  checkUserPermissionSchema,
  createPermissionSchema,
  createRoleSchema,
  getRolePermissionsSchema,
  getUserPermissionsSchema,
  getUserRolesSchema,
} from "../validation/rbac.validation.js";

const rbacRouter = Router();
rbacRouter.use(requireAuth);

rbacRouter.post("/roles", validate(createRoleSchema), createRole);
rbacRouter.get("/roles", getAllRoles);
rbacRouter.get("/roles/:roleId/permissions", validate(getRolePermissionsSchema), getRolePermissions);
rbacRouter.post(
  "/roles/:roleId/permissions/:permissionId",
  validate(assignPermissionToRoleSchema),
  assignPermissionToRole,
);

rbacRouter.post("/permissions", validate(createPermissionSchema), createPermission);
rbacRouter.get("/permissions", getAllPermissions);

rbacRouter.get("/users/:userId/roles", validate(getUserRolesSchema), getUserRoles);
rbacRouter.post("/users/:userId/roles/:roleId", validate(assignRoleToUserSchema), assignRoleToUser);
rbacRouter.get("/users/:userId/permissions", validate(getUserPermissionsSchema), getUserPermissions);
rbacRouter.get(
  "/users/:userId/permissions/:permission",
  validate(checkUserPermissionSchema),
  checkUserPermission,
);

export default rbacRouter;
