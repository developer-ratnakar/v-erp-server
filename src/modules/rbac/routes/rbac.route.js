import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  assignPermissionToRole,
  removePermissionFromRole,
  assignRoleToUser,
  removeRoleFromUser,
  checkUserPermission,
  createPermission,
  createRole,
  getAllPermissions,
  getAllRoles,
  getRolePermissions,
  getUserPermissions,
  getUserRoles,
  bootstrapAdmin,
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

rbacRouter.post("/bootstrap-admin", bootstrapAdmin);

rbacRouter.use(requireAuth);

rbacRouter.post("/roles", validate(createRoleSchema), createRole);
rbacRouter.get("/roles", getAllRoles);
rbacRouter.get("/roles/:roleId/permissions", validate(getRolePermissionsSchema), getRolePermissions);
rbacRouter.post(
  "/roles/:roleId/permissions/:permissionId",
  validate(assignPermissionToRoleSchema),
  assignPermissionToRole,
);
rbacRouter.delete(
  "/roles/:roleId/permissions/:permissionId",
  validate(assignPermissionToRoleSchema),
  removePermissionFromRole,
);

rbacRouter.post("/permissions", validate(createPermissionSchema), createPermission);
rbacRouter.get("/permissions", getAllPermissions);

rbacRouter.get("/users/:userId/roles", validate(getUserRolesSchema), getUserRoles);
rbacRouter.post("/users/:userId/roles/:roleId", validate(assignRoleToUserSchema), assignRoleToUser);
rbacRouter.delete("/users/:userId/roles/:roleId", validate(assignRoleToUserSchema), removeRoleFromUser);
rbacRouter.get("/users/:userId/permissions", validate(getUserPermissionsSchema), getUserPermissions);
rbacRouter.get(
  "/users/:userId/permissions/:permission",
  validate(checkUserPermissionSchema),
  checkUserPermission,
);

export default rbacRouter;
