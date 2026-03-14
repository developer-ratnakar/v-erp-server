import supabase from "../../../config/supabase.js";

class AuthRepository {
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async findUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async createUser(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async assignRoleToUser(userId, roleId) {
    const { data, error } = await supabase
      .from("user_role_mapping")
      .insert({
        uesr_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getUserRoles(userId) {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from("role_permission_mapping")
      .select(`permission_id, permissions (id, permission_type, module_id)`)
      .eq("role_id", roleId);

    if (error) throw new Error(error.message);

    return data;
  }

  async createLoginSession(sessionData) {
    const { data, error } = await supabase
      .from("login_session")
      .insert(sessionData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }
}

export default new AuthRepository();
