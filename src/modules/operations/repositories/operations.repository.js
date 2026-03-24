import { supabaseAdmin } from "../../../config/supabase.js";
import Subject from "../models/subject.model.js";
import TimetableEntry from "../models/timetable-entry.model.js";
import Timetable from "../models/timetable.model.js";

class OperationsRepository {
  async createSubject(subjectData) {
    const { data, error } = await supabaseAdmin
      .from("operations_subjects")
      .insert(subjectData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Subject(data);
  }

  async getAllSubjects(params) {
    const { from, to, search, department_id, program_id } = params || { from: 0, to: 9 };
    let query = supabaseAdmin
      .from("operations_subjects")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
    }

    if (department_id) {
      query = query.eq("department_id", department_id);
    }

    if (program_id) {
      query = query.eq("program_id", program_id);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Subject(item)) : [],
      count: count ?? 0,
    };
  }

  async findSubjectById(subjectId) {
    const { data, error } = await supabaseAdmin
      .from("operations_subjects")
      .select("*")
      .eq("id", subjectId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Subject(data) : null;
  }

  async findSubjectByCode(code) {
    const { data, error } = await supabaseAdmin
      .from("operations_subjects")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Subject(data) : null;
  }

  async updateSubject(subjectId, subjectData) {
    const { data, error } = await supabaseAdmin
      .from("operations_subjects")
      .update(subjectData)
      .eq("id", subjectId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Subject(data);
  }

  async deleteSubject(subjectId) {
    const { error } = await supabaseAdmin
      .from("operations_subjects")
      .delete()
      .eq("id", subjectId);

    if (error) throw new Error(error.message);
  }

  async createTimetable(timetableData) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetables")
      .insert(timetableData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Timetable(data);
  }

  async getAllTimetables(params) {
    const { from, to, search, program_id, department_id, batch_id, semester_id } = params || { from: 0, to: 9 };
    let query = supabaseAdmin
      .from("operations_timetables")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (program_id) query = query.eq("program_id", program_id);
    if (department_id) query = query.eq("department_id", department_id);
    if (batch_id) query = query.eq("batch_id", batch_id);
    if (semester_id) query = query.eq("semester_id", semester_id);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Timetable(item)) : [],
      count: count ?? 0,
    };
  }

  async findTimetableById(timetableId) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetables")
      .select("*")
      .eq("id", timetableId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Timetable(data) : null;
  }

  async updateTimetable(timetableId, timetableData) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetables")
      .update(timetableData)
      .eq("id", timetableId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Timetable(data);
  }

  async deleteTimetable(timetableId) {
    const { error } = await supabaseAdmin
      .from("operations_timetables")
      .delete()
      .eq("id", timetableId);

    if (error) throw new Error(error.message);
  }

  async createTimetableEntry(entryData) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetable_entries")
      .insert(entryData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new TimetableEntry(data);
  }

  async getTimetableEntries(timetableId) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetable_entries")
      .select("*")
      .eq("timetable_id", timetableId)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new TimetableEntry(item)) : [];
  }

  async findTimetableEntryById(entryId) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetable_entries")
      .select("*")
      .eq("id", entryId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new TimetableEntry(data) : null;
  }

  async updateTimetableEntry(entryId, entryData) {
    const { data, error } = await supabaseAdmin
      .from("operations_timetable_entries")
      .update(entryData)
      .eq("id", entryId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new TimetableEntry(data);
  }

  async deleteTimetableEntry(entryId) {
    const { error } = await supabaseAdmin
      .from("operations_timetable_entries")
      .delete()
      .eq("id", entryId);

    if (error) throw new Error(error.message);
  }

  async findStaffById(staffId) {
    const { data, error } = await supabaseAdmin
      .from("hr_staff")
      .select("id")
      .eq("id", staffId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ?? null;
  }
}

export default new OperationsRepository();
