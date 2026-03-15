import { supabaseAdmin } from "../../../config/supabase.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import RolePermissionMapping from "../models/role-permission-mapping.model.js";
import UserRoleMapping from "../models/user-role-mapping.model.js";

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
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? new Role(data) : null;
  }

  async findRoleById(roleId) {
    const { data, error } = await supabaseAdmin
      .from("roles")
      .select("*")
      .eq("id", roleId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

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

  async findPermissionByTypeAndModule(permissionType, moduleId) {
    const { data, error } = await supabaseAdmin
      .from("permissions")
      .select("*")
      .eq("permission_type", permissionType)
      .eq("module_id", moduleId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? new Permission(data) : null;
  }

  async findPermissionById(permissionId) {
    const { data, error } = await supabaseAdmin
      .from("permissions")
      .select("*")
      .eq("id", permissionId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? new Permission(data) : null;
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

  async findRolePermissionMapping(roleId, permissionId) {
    const { data, error } = await supabaseAdmin
      .from("role_permission_mapping")
      .select("*")
      .eq("role_id", roleId)
      .eq("permission_id", permissionId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? new RolePermissionMapping(data) : null;
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

  async findUserRoleMapping(userId, roleId) {
    const { data, error } = await supabaseAdmin
      .from("user_role_mapping")
      .select("*")
      .eq("user_id", userId)
      .eq("role_id", roleId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? new UserRoleMapping(data) : null;
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
        `,
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

  async getAllRoles() {
    const { data, error } = await supabaseAdmin
      .from("roles")
      .select("*")
      .order("role_name", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new Role(item)) : [];
  }

  async getAllPermissions() {
    const { data, error } = await supabaseAdmin
      .from("permissions")
      .select("*")
      .order("permission_type", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new Permission(item)) : [];
  }
}

export default new RBACRepository();
