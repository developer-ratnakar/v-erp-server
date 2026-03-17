import RBACRepository from "../repositories/rbac.repository.js";
import authRepository from "../../auth/repositories/auth.repository.js";
import ApiError from "../../../errors/ApiError.js";

const DEVELOPER_ROLE = "developer";

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
    const roles = await this.getUserRoles(userId);

    if (roles.some((role) => role.roleName === DEVELOPER_ROLE)) {
      return true;
    }

    const permissions = await this.getUserPermissions(userId);
    return permissions.some((perm) => perm.permissionType === permission);
  }

  async bootstrapAdmin(email) {
    const modules = ['academic', 'students', 'operations', 'hr', 'exams', 'clc', 'dashboard', 'settings', 'staff', 'attendance', 'timetable', 'exam-results'];
    const permissionTypes = ['read', 'write', 'delete'];
    
    // 1. Ensure Admin Role
    let role = await RBACRepository.findRoleByName('admin');
    if (!role) {
      role = await RBACRepository.createRole({ role_name: 'admin', description: 'System Administrator' });
    }

    // 2. Sync Permissions
    const permissions = [];
    for (const mod of modules) {
      for (const typeSuffix of permissionTypes) {
        const type = `${mod}.${typeSuffix}`;
        let perm = await RBACRepository.findPermissionByTypeAndModule(type, mod);
        if (!perm) {
          perm = await RBACRepository.createPermission({ permission_type: type, module_id: mod });
        }
        permissions.push(perm);
      }
    }

    // 3. Assign Permissions to Role
    const mappings = permissions.map(p => ({
      role_id: role.id,
      permission_id: p.id
    }));

    // Batch assignment if possible, or loop (mapping handles individual inserts)
    for (const m of mappings) {
      try {
        await RBACRepository.assignPermissionToRole(m.role_id, m.permission_id);
      } catch (e) {
        // Ignore duplicates
      }
    }

    // 4. Assign Role to User
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found. Please register on the production site first.");
    }

    try {
      await RBACRepository.assignRoleToUser(user.id, role.id);
    } catch (e) {
      // Role might already be assigned
    }

    return { 
      message: "Bootstrap successful", 
      user: email, 
      role: "admin",
      permissionsCount: permissions.length,
      modules: modules
    };
  }
}

export default new RBACService();
