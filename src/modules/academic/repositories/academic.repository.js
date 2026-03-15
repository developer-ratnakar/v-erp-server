import { supabaseAdmin } from "../../../config/supabase.js";
import Batch from "../models/batch.model.js";
import Department from "../models/department.model.js";
import Program from "../models/program.model.js";
import Session from "../models/session.model.js";
import Semester from "../models/semester.model.js";

class AcademicRepository {
  async createProgram(programData) {
    const { data, error } = await supabaseAdmin
      .from("academic_programs")
      .insert(programData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Program(data);
  }

  async getAllPrograms() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_programs")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Program(item)) : [],
      count: count ?? 0,
    };
  }

  async findProgramById(id) {
    const { data, error } = await supabaseAdmin
      .from("academic_programs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Program(data) : null;
  }

  async findProgramByCode(code) {
    const { data, error } = await supabaseAdmin
      .from("academic_programs")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Program(data) : null;
  }

  async updateProgram(id, programData) {
    const { data, error } = await supabaseAdmin
      .from("academic_programs")
      .update(programData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Program(data);
  }

  async deleteProgram(id) {
    const { error } = await supabaseAdmin
      .from("academic_programs")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async createDepartment(departmentData) {
    const { data, error } = await supabaseAdmin
      .from("academic_departments")
      .insert(departmentData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Department(data);
  }

  async getAllDepartments() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_departments")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Department(item)) : [],
      count: count ?? 0,
    };
  }

  async findDepartmentById(id) {
    const { data, error } = await supabaseAdmin
      .from("academic_departments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Department(data) : null;
  }

  async findDepartmentByCode(code) {
    const { data, error } = await supabaseAdmin
      .from("academic_departments")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Department(data) : null;
  }

  async updateDepartment(id, departmentData) {
    const { data, error } = await supabaseAdmin
      .from("academic_departments")
      .update(departmentData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Department(data);
  }

  async deleteDepartment(id) {
    const { error } = await supabaseAdmin
      .from("academic_departments")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async createBatch(batchData) {
    const { data, error } = await supabaseAdmin
      .from("academic_batches")
      .insert(batchData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Batch(data);
  }

  async getAllBatches() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_batches")
      .select("*", { count: "exact" })
      .order("start_year", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Batch(item)) : [],
      count: count ?? 0,
    };
  }

  async findBatchById(id) {
    const { data, error } = await supabaseAdmin
      .from("academic_batches")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Batch(data) : null;
  }

  async updateBatch(id, batchData) {
    const { data, error } = await supabaseAdmin
      .from("academic_batches")
      .update(batchData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Batch(data);
  }

  async deleteBatch(id) {
    const { error } = await supabaseAdmin
      .from("academic_batches")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async createSemester(semesterData) {
    const { data, error } = await supabaseAdmin
      .from("academic_semesters")
      .insert(semesterData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Semester(data);
  }

  async getAllSemesters() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_semesters")
      .select("*", { count: "exact" })
      .order("name", { ascending: true })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Semester(item)) : [],
      count: count ?? 0,
    };
  }

  async findSemesterById(id) {
    const { data, error } = await supabaseAdmin
      .from("academic_semesters")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Semester(data) : null;
  }

  async findSemesterByCode(code) {
    const { data, error } = await supabaseAdmin
      .from("academic_semesters")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Semester(data) : null;
  }

  async updateSemester(id, semesterData) {
    const { data, error } = await supabaseAdmin
      .from("academic_semesters")
      .update(semesterData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Semester(data);
  }

  async deleteSemester(id) {
    const { error } = await supabaseAdmin
      .from("academic_semesters")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async createSession(sessionData) {
    const { data, error } = await supabaseAdmin
      .from("academic_sessions")
      .insert(sessionData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Session(data);
  }

  async getAllSessions() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_sessions")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Session(item)) : [],
      count: count ?? 0,
    };
  }

  async findSessionById(id) {
    const { data, error } = await supabaseAdmin
      .from("academic_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Session(data) : null;
  }

  async findSessionByName(name) {
    const { data, error } = await supabaseAdmin
      .from("academic_sessions")
      .select("*")
      .eq("name", name)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Session(data) : null;
  }

  async updateSession(id, sessionData) {
    const { data, error } = await supabaseAdmin
      .from("academic_sessions")
      .update(sessionData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Session(data);
  }

  async deleteSession(id) {
    const { error } = await supabaseAdmin
      .from("academic_sessions")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

export default new AcademicRepository();
