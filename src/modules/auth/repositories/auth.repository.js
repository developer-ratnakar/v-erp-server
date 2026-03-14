import { supabaseAdmin } from "../../../config/supabase.js";

class AuthRepository {
  async findUserByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      // Don't throw an error if the user is simply not found
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
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

    return data;
  }

  async createUser(userData) {
    // Step 1: Insert the user and select only the ID.
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("users")
      .insert(userData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Error during user insertion:", insertError);
      throw new Error(insertError.message);
    }

    if (!insertData || !insertData.id) {
        throw new Error("Failed to create user or retrieve user ID.");
    }

    // Step 2: Fetch the full user object using the returned ID.
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

    return data;
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

    return data;
  }

  async getRolePermissions(roleId) {
    const { data, error } = await supabaseAdmin
      .from("role_permission_mapping")
      .select(`permission_id, permissions (id, permission_type, module_id)`)
      .eq("role_id", roleId);

    if (error) throw new Error(error.message);

    return data;
  }

  async createLoginSession(sessionData) {
    const { data, error } = await supabaseAdmin
      .from("login_session")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }
}

export default new AuthRepository();
