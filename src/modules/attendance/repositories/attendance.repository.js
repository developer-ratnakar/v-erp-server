import { supabaseAdmin } from "../../../config/supabase.js";
import Attendance from "../models/attendance.model.js";

class AttendanceRepository {
  async createAttendance(attendanceData) {
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .insert(attendanceData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Attendance(data);
  }

  async getAllAttendance() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("operations_attendance")
      .select("*", { count: "exact" })
      .order("month", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Attendance(item)) : [],
      count: count ?? 0,
    };
  }

  async findAttendanceById(attendanceId) {
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .select("*")
      .eq("id", attendanceId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Attendance(data) : null;
  }

  async findAttendanceByUniqueKey(studentId, subjectId, month) {
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", subjectId)
      .eq("month", month)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Attendance(data) : null;
  }

  async updateAttendance(attendanceId, attendanceData) {
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .update(attendanceData)
      .eq("id", attendanceId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Attendance(data);
  }

  async deleteAttendance(attendanceId) {
    const { error } = await supabaseAdmin
      .from("operations_attendance")
      .delete()
      .eq("id", attendanceId);

    if (error) throw new Error(error.message);
  }
}

export default new AttendanceRepository();
