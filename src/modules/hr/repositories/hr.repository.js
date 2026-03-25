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

  async findStaffByUserId(userId) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .select("*")
      .eq("user_id", userId)
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

  // Attendance
  async upsertStaffAttendance(attendanceData) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff_attendance")
      .upsert(attendanceData, { onConflict: "staff_id,date" })
      .select("*");

    if (error) throw new Error(error.message);
    return data;
  }

  async getStaffAttendance(date, departmentId) {
    let query = supabaseAdmin
      .from("hr_staff_attendance")
      .select(`
        *,
        staff:hr_staff (
          id,
          name,
          designation,
          department_id
        )
      `)
      .eq("date", date);

    if (departmentId) {
      // Filter by staff department if provided
      // Note: This filter might need a more complex join if filtered on the server
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  // Leaves
  async createLeaveApplication(leaveData) {
    const { data, error } = await supabaseAdmin
      .from("hr_leave_applications")
      .insert(leaveData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getStaffLeaves(staffId) {
    let query = supabaseAdmin
      .from("hr_leave_applications")
      .select(`
        *,
        staff:hr_staff!staff_id (id, name, designation),
        approver:hr_staff!approved_by (id, name, designation)
      `)
      .order("created_at", { ascending: false });

    if (staffId) {
      query = query.eq("staff_id", staffId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async updateLeaveStatus(leaveId, statusData) {
    const { data, error } = await supabaseAdmin
      .from("hr_leave_applications")
      .update(statusData)
      .eq("id", leaveId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

export default new HRRepository();
