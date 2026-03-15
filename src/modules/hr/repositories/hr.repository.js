import { supabaseAdmin } from "../../../config/supabase.js";
import Staff from "../models/staff.model.js";

class HRRepository {
  async createStaff(staffData) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .insert(staffData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Staff(data);
  }

  async getAllStaff() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("hr_staff")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Staff(item)) : [],
      count: count ?? 0,
    };
  }

  async findStaffById(staffId) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .select("*")
      .eq("id", staffId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Staff(data) : null;
  }

  async findStaffByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Staff(data) : null;
  }

  async updateStaff(staffId, staffData) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .update(staffData)
      .eq("id", staffId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Staff(data);
  }

  async deleteStaff(staffId) {
    const { error } = await supabaseAdmin
      .from("hr_staff")
      .delete()
      .eq("id", staffId);

    if (error) throw new Error(error.message);
  }
}

export default new HRRepository();
