import RBACRepository from "../repositories/rbac.repository.js";
import ApiError from "../../../errors/ApiError.js";

class RBACService {
  async createRole(dto) {
    const existingRole = await RBACRepository.findRoleByName(dto.role_name);

    if (existingRole) {
      throw new ApiError(409, "Role already exists");
    }

    return await RBACRepository.createRole(dto);
  }

  async assignRoleToUser(userId, roleId) {
    const role = await RBACRepository.findRoleById(roleId);

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    const existingAssignment = await RBACRepository.findUserRoleMapping(userId, roleId);

    if (existingAssignment) {
      throw new ApiError(409, "Role is already assigned to the user");
    }

    return await RBACRepository.assignRoleToUser(userId, roleId);
  }

  async getUserRoles(userId) {
    return await RBACRepository.getUserRoles(userId);
  }

  async getAllRoles() {
    return await RBACRepository.getAllRoles();
  }

  async getRolePermissions(roleId) {
    const role = await RBACRepository.findRoleById(roleId);

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    return await RBACRepository.getRolePermissions(roleId);
  }

  async createPermission(dto) {
    const existingPermission = await RBACRepository.findPermissionByTypeAndModule(
      dto.permission_type,
      dto.module_id,
    );

    if (existingPermission) {
      throw new ApiError(409, "Permission already exists for this module");
    }

    return await RBACRepository.createPermission(dto);
  }

  async assignPermissionToRole(roleId, permissionId) {
    const [role, permission, existingAssignment] = await Promise.all([
      RBACRepository.findRoleById(roleId),
      RBACRepository.findPermissionById(permissionId),
      RBACRepository.findRolePermissionMapping(roleId, permissionId),
    ]);

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    if (!permission) {
      throw new ApiError(404, "Permission not found");
    }

    if (existingAssignment) {
      throw new ApiError(409, "Permission is already assigned to the role");
    }

    return await RBACRepository.assignPermissionToRole(roleId, permissionId);
  }

  async getAllPermissions() {
    return await RBACRepository.getAllPermissions();
  }

  async getUserPermissions(userId) {
    const roles = await this.getUserRoles(userId);
    const rolePermissions = await Promise.all(
      roles.map((role) => this.getRolePermissions(role.id)),
    );

    const uniquePermissions = new Map();

    rolePermissions.flat().forEach((permission) => {
      uniquePermissions.set(permission.id, permission);
    });

    return Array.from(uniquePermissions.values());
  }

  async checkUserPermission(userId, permission) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some((perm) => perm.permissionType === permission);
  }
}

export default new RBACService();
