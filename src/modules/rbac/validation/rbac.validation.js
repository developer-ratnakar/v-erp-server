import { z } from "zod";

const idParamSchema = z.object({
  userId: z.string().uuid().optional(),
  roleId: z.string().uuid().optional(),
  permissionId: z.string().uuid().optional(),
  permission: z.string().trim().min(1).optional(),
});

export const createRoleSchema = {
  body: z.object({
    role_name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(255).optional(),
    created_by: z.string().uuid().optional(),
    updated_by: z.string().uuid().optional(),
    deleted_by: z.string().uuid().optional(),
  }),
};

export const createPermissionSchema = {
  body: z.object({
    permission_type: z.string().trim().min(2).max(100),
    module_id: z.string().trim().min(1).max(100),
    created_by: z.string().uuid().optional(),
    updated_by: z.string().uuid().optional(),
    deleted_by: z.string().uuid().optional(),
  }),
};

export const assignRoleToUserSchema = {
  params: idParamSchema.extend({
    userId: z.string().uuid(),
    roleId: z.string().uuid(),
  }),
};

export const assignPermissionToRoleSchema = {
  params: idParamSchema.extend({
    roleId: z.string().uuid(),
    permissionId: z.string().uuid(),
  }),
};

export const getUserRolesSchema = {
  params: idParamSchema.extend({
    userId: z.string().uuid(),
  }),
};

export const getRolePermissionsSchema = {
  params: idParamSchema.extend({
    roleId: z.string().uuid(),
  }),
};

export const getUserPermissionsSchema = {
  params: idParamSchema.extend({
    userId: z.string().uuid(),
  }),
};

export const checkUserPermissionSchema = {
  params: idParamSchema.extend({
    userId: z.string().uuid(),
    permission: z.string().trim().min(1),
  }),
};
