import { supabaseAdmin } from "../../../config/supabase.js";
import User from "../models/user.model.js";
import LoginSession from "../models/login-session.model.js";
import Role from "../../rbac/models/role.model.js";
import Permission from "../../rbac/models/permission.model.js";
import UserRoleMapping from "../../rbac/models/user-role-mapping.model.js";

class AuthRepository {
  async findUserByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data ? new User(data) : null;
  }

  async findUserById(userId) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data ? new User(data) : null;
  }

  async createUser(userData) {
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("users")
      .insert(userData.toPersistence())
      .select("id")
      .single();

    if (insertError) {
      console.error("Error during user insertion:", insertError);
      throw new Error(insertError.message);
    }

    if (!insertData || !insertData.id) {
      throw new Error("Failed to create user or retrieve user ID.");
    }

    const newUser = await this.findUserById(insertData.id);

    if (!newUser) {
      throw new Error("Failed to retrieve newly created user.");
    }

    return newUser;
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
        `,
      )
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    
    return data ? data.filter(item => item.roles).map((item) => new Role(item.roles)) : [];
  }

  async getRolePermissions(roleId) {
    const { data, error } = await supabaseAdmin
      .from("role_permission_mapping")
      .select(`permission_id, permissions (id, permission_type, module_id)`)
      .eq("role_id", roleId);

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new Permission(item.permissions)) : [];
  }

  async createLoginSession(sessionData) {
    const { data, error } = await supabaseAdmin
      .from("login_session")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new LoginSession(data);
  }

  // Find a session by its refresh token value
  async findSessionByRefreshToken(refreshToken) {
    const { data, error } = await supabaseAdmin
      .from("login_session")
      .select("*")
      .eq("refresh_token", refreshToken)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    return data ? new LoginSession(data) : null;
  }

  // Rotate: replace refresh_token and extend expires_at in the existing session row
  async updateSessionRefreshToken(sessionId, newRefreshToken, newExpiresAt) {
    const { data, error } = await supabaseAdmin
      .from("login_session")
      .update({
        refresh_token: newRefreshToken,
        expires_at: newExpiresAt,
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new LoginSession(data);
  }

  async getAllUsers() {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .is("deleted_at", null);

    if (error) throw new Error(error.message);

    return data ? data.filter(u => u).map((u) => new User(u)) : [];
  }

  async deleteUser(userId) {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) throw new Error(error.message);
    return true;
  }

  async changeUserPassword(userId, hashedPassword) {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", userId);

    if (error) throw new Error(error.message);
    return true;
  }
}

export default new AuthRepository();
