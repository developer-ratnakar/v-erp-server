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

  async getAllAttendance(params) {
    const { from, to, student_id, subject_id, month, program_id, department_id, batch_id, semester_id } = params || { from: 0, to: 9 };
    let query = supabaseAdmin
      .from("operations_attendance")
      .select("*", { count: "exact" })
      .order("month", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (student_id) query = query.eq("student_id", student_id);
    if (subject_id) query = query.eq("subject_id", subject_id);
    if (month) query = query.eq("month", month);
    if (program_id) query = query.eq("program_id", program_id);
    if (department_id) query = query.eq("department_id", department_id);
    if (batch_id) query = query.eq("batch_id", batch_id);
    if (semester_id) query = query.eq("semester_id", semester_id);

    const { data, error, count } = await query;

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
