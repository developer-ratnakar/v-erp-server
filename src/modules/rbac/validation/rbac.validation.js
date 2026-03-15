import { z } from "zod";

const idParamSchema = z.object({
  userId: z.uuid().optional(),
  roleId: z.uuid().optional(),
  permissionId: z.uuid().optional(),
  permission: z.string().trim().min(1).optional(),
});

export const createRoleSchema = {
  body: z.object({
    role_name: z.string().trim().min(2).max(100),
    created_by: z.uuid().optional(),
    updated_by: z.uuid().optional(),
    deleted_by: z.uuid().optional(),
  }),
};

export const createPermissionSchema = {
  body: z.object({
    permission_type: z.string().trim().min(2).max(100),
    module_id: z.string().trim().min(1).max(100),
    created_by: z.uuid().optional(),
    updated_by: z.uuid().optional(),
    deleted_by: z.uuid().optional(),
  }),
};

export const assignRoleToUserSchema = {
  params: idParamSchema.extend({
    userId: z.uuid(),
    roleId: z.uuid(),
  }),
};

export const assignPermissionToRoleSchema = {
  params: idParamSchema.extend({
    roleId: z.uuid(),
    permissionId: z.uuid(),
  }),
};

export const getUserRolesSchema = {
  params: idParamSchema.extend({
    userId: z.uuid(),
  }),
};

export const getRolePermissionsSchema = {
  params: idParamSchema.extend({
    roleId: z.uuid(),
  }),
};

export const getUserPermissionsSchema = {
  params: idParamSchema.extend({
    userId: z.uuid(),
  }),
};

export const checkUserPermissionSchema = {
  params: idParamSchema.extend({
    userId: z.uuid(),
    permission: z.string().trim().min(1),
  }),
};
