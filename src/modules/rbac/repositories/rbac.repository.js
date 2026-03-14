import { supabaseAdmin } from "../../../config/supabase";
import Role from "../models/role.model";
import Permission from "../models/permission.model";
import RolePermissionMapping from "../models/role-permission-mapping.model";
import UserRoleMapping from "../models/user-role-mapping.model";

class RBACRepository {
  async createRole(roleData) {
    const { data, error } = await supabaseAdmin
      .from("roles")
      .insert(roleData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Role(data);
  }

  async findRoleByName(roleName) {
    const { data, error } = await supabaseAdmin
      .from("roles")
      .select("*")
      .eq("role_name", roleName)
      .single();

    if (error) throw new Error(error.message);

    return data ? new Role(data) : null;
  }

  async createPermission(permissionData) {
    const { data, error } = await supabaseAdmin
      .from("permissions")
      .insert(permissionData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new Permission(data);
  }

  async assignPermissionToRole(roleId, permissionId) {
    const { data, error } = await supabaseAdmin
      .from("role_permission_mapping")
      .insert({ role_id: roleId, permission_id: permissionId })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new RolePermissionMapping(data);
  }

  async assignRoleToUser(userId, roleId) {
    const { data, error } = await supabaseAdmin
      .from("user_role_mapping")
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new UserRoleMapping(data);
  }

  async getUserRoles(userId) {
    const { data, error } = await supabaseAdmin
      .from("user_role_mapping")
      .select(
        `
        role_id,
        roles (
        id,
        role_name
        )
        `
      )
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return data ? data.map((item) => new Role(item.roles)) : [];
  }

  async getRolePermissions(roleId) {
    const { data, error } = await supabaseAdmin
      .from("role_permission_mapping")
      .select(`permission_id, permissions (id, permission_type, module_id)`)
      .eq("role_id", roleId);
    if (error) throw new Error(error.message);
    return data ? data.map((item) => new Permission(item.permissions)) : [];
  }
}

export default new RBACRepository();
