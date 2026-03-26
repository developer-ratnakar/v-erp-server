import { supabaseAdmin } from "../../../config/supabase.js";
import ExamMark from "../models/exam-mark.model.js";
import ExamResult from "../models/exam-result.model.js";
import Exam from "../models/exam.model.js";

class ExamsRepository {
  async createExam(examData) {
    const { data, error } = await supabaseAdmin
      .from("academic_exams")
      .insert(examData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Exam(data);
  }

  async getAllExams() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("academic_exams")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Exam(item)) : [],
      count: count ?? 0,
    };
  }

  async findExamById(examId) {
    const { data, error } = await supabaseAdmin
      .from("academic_exams")
      .select("*")
      .eq("id", examId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Exam(data) : null;
  }

  async updateExam(examId, examData) {
    const { data, error } = await supabaseAdmin
      .from("academic_exams")
      .update(examData)
      .eq("id", examId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Exam(data);
  }

  async deleteExam(examId) {
    const { error } = await supabaseAdmin
      .from("academic_exams")
      .delete()
      .eq("id", examId);

    if (error) throw new Error(error.message);
  }

  async createExamResult(resultData) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .insert(resultData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new ExamResult(data);
  }

  async getExamResults(examId) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .select(`
        *,
        student:students (
          id,
          first_name,
          last_name,
          registration_number
        )
      `)
      .eq("exam_id", examId)
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new ExamResult(item)) : [];
  }

  async findExamResultById(resultId) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .select("*")
      .eq("id", resultId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new ExamResult(data) : null;
  }

  async findExamResultByExamAndStudent(examId, studentId) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .select("*")
      .eq("exam_id", examId)
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new ExamResult(data) : null;
  }

  async updateExamResult(resultId, resultData) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .update(resultData)
      .eq("id", resultId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new ExamResult(data);
  }

  async deleteExamResult(resultId) {
    const { error } = await supabaseAdmin
      .from("exam_results")
      .delete()
      .eq("id", resultId);

    if (error) throw new Error(error.message);
  }

  async createExamMark(markData) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .insert(markData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new ExamMark(data);
  }

  async getExamMarks(examId) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .select("*")
      .eq("exam_id", examId)
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new ExamMark(item)) : [];
  }

  async findExamMarkById(markId) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .select("*")
      .eq("id", markId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new ExamMark(data) : null;
  }

  async updateExamMark(markId, markData) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .update(markData)
      .eq("id", markId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new ExamMark(data);
  }

  async deleteExamMark(markId) {
    const { error } = await supabaseAdmin
      .from("exam_marks")
      .delete()
      .eq("id", markId);

    if (error) throw new Error(error.message);
  }

  async upsertExamMarks(marksData) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .upsert(marksData, { onConflict: "exam_id,student_id,subject_id" })
      .select("*");

    if (error) throw new Error(error.message);

    return data.map((item) => new ExamMark(item));
  }

  async getMarksWithStudentInfo(examId, subjectId) {
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .select(`
        *,
        student:students (
          id,
          first_name,
          last_name,
          registration_number
        )
      `)
      .eq("exam_id", examId)
      .eq("subject_id", subjectId);

    if (error) throw new Error(error.message);

    return data;
  }

  async upsertExamResults(resultsData) {
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .upsert(resultsData, { onConflict: "exam_id,student_id" })
      .select("*");

    if (error) throw new Error(error.message);

    return data.map((item) => new ExamResult(item));
  }

  async getAllStudentResults(studentId) {
    if (!studentId || studentId === 'undefined') return [];
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((item) => new ExamResult(item));
  }

  async getAllResultsForStudents(studentIds) {
    if (!studentIds || studentIds.length === 0) return [];
    const { data, error } = await supabaseAdmin
      .from("exam_results")
      .select("*")
      .in("student_id", studentIds);

    if (error) throw new Error(error.message);

    return data.map((item) => new ExamResult(item));
  }

  async getStudentMarksByExam(examId, studentId) {
    if (!studentId || studentId === 'undefined') return [];
    const { data, error } = await supabaseAdmin
      .from("exam_marks")
      .select(`
        *,
        subject:operations_subjects (id, name, code)
      `)
      .eq("exam_id", examId)
      .eq("student_id", studentId);

    if (error) throw new Error(error.message);

    return data;
  }
}

export default new ExamsRepository();
