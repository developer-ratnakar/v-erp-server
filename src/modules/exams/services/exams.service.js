import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import operationsRepository from "../../operations/repositories/operations.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import examsRepository from "../repositories/exams.repository.js";

class ExamsService {
  async createExam(dto) {
    await this.validateExamReferences(dto);
    return await examsRepository.createExam(dto);
  }

  async getAllExams(pagination) {
    return await examsRepository.getAllExams(pagination);
  }

  async getExamById(examId) {
    const exam = await examsRepository.findExamById(examId);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    return exam;
  }

  async updateExam(examId, dto) {
    await this.getExamById(examId);
    await this.validateExamReferences(dto);
    return await examsRepository.updateExam(examId, dto);
  }

  async deleteExam(examId) {
    await this.getExamById(examId);
    await examsRepository.deleteExam(examId);
  }

  async createExamResult(examId, dto) {
    await this.getExamById(examId);

    const student = await studentRepository.findStudentById(dto.student_id);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const existingResult = await examsRepository.findExamResultByExamAndStudent(examId, dto.student_id);
    if (existingResult) {
      throw new ApiError(409, "Exam result already exists for this student");
    }

    return await examsRepository.createExamResult({
      ...dto,
      exam_id: examId,
    });
  }

  async getExamResults(examId) {
    await this.getExamById(examId);
    const results = await examsRepository.getExamResults(examId);
    
    if (results.length === 0) return [];

    const studentIds = results.map(r => r.studentId);
    const allHistoricalResults = await examsRepository.getAllResultsForStudents(studentIds);

    const resultsByStudent = new Map();
    for (const r of allHistoricalResults) {
      if (!resultsByStudent.has(r.studentId)) {
        resultsByStudent.set(r.studentId, []);
      }
      resultsByStudent.get(r.studentId).push(r);
    }

    const resultsWithCGPA = results.map((r) => {
      const studentResults = resultsByStudent.get(r.studentId) || [];
      const totalSGPA = studentResults.reduce((sum, res) => sum + (res.sgpa || 0), 0);
      const count = studentResults.filter(res => res.sgpa !== null && res.sgpa !== undefined).length;
      const cgpa = count > 0 ? Number((totalSGPA / count).toFixed(2)) : 0;
      
      return { ...r, cgpa };
    });

    return resultsWithCGPA;
  }

  async updateExamResult(resultId, dto) {
    const result = await this.getExamResultById(resultId);

    if (dto.student_id && dto.student_id !== result.studentId) {
      const student = await studentRepository.findStudentById(dto.student_id);
      if (!student) throw new ApiError(404, "Student not found");

      const existingResult = await examsRepository.findExamResultByExamAndStudent(result.examId, dto.student_id);
      if (existingResult && existingResult.id !== Number(resultId)) {
        throw new ApiError(409, "Exam result already exists for this student");
      }
    }

    return await examsRepository.updateExamResult(resultId, dto);
  }

  async getExamResultById(resultId) {
    const result = await examsRepository.findExamResultById(resultId);

    if (!result) {
      throw new ApiError(404, "Exam result not found");
    }

    return result;
  }

  async deleteExamResult(resultId) {
    await this.getExamResultById(resultId);
    await examsRepository.deleteExamResult(resultId);
  }

  async createExamMark(examId, dto) {
    await this.getExamById(examId);

    const [student, subject] = await Promise.all([
      studentRepository.findStudentById(dto.student_id),
      operationsRepository.findSubjectById(dto.subject_id),
    ]);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    if (dto.result_id) {
      const result = await examsRepository.findExamResultById(dto.result_id);
      if (!result) {
        throw new ApiError(404, "Exam result not found");
      }
      if (result.examId !== Number(examId)) {
        throw new ApiError(400, "result_id does not belong to the given exam");
      }
    }

    return await examsRepository.createExamMark({
      ...dto,
      exam_id: examId,
    });
  }

  async getExamMarks(examId) {
    await this.getExamById(examId);
    return await examsRepository.getExamMarks(examId);
  }

  async updateExamMark(markId, dto) {
    const mark = await this.getExamMarkById(markId);

    if (dto.student_id) {
      const student = await studentRepository.findStudentById(dto.student_id);
      if (!student) throw new ApiError(404, "Student not found");
    }

    if (dto.subject_id) {
      const subject = await operationsRepository.findSubjectById(dto.subject_id);
      if (!subject) throw new ApiError(404, "Subject not found");
    }

    if (dto.result_id) {
      const result = await examsRepository.findExamResultById(dto.result_id);
      if (!result) throw new ApiError(404, "Exam result not found");
      if (result.examId !== mark.examId) {
        throw new ApiError(400, "result_id does not belong to the given exam");
      }
    }

    return await examsRepository.updateExamMark(markId, dto);
  }

  async getExamMarkById(markId) {
    const mark = await examsRepository.findExamMarkById(markId);

    if (!mark) {
      throw new ApiError(404, "Exam mark not found");
    }

    return mark;
  }

  async deleteExamMark(markId) {
    await this.getExamMarkById(markId);
    await examsRepository.deleteExamMark(markId);
  }

  async bulkCreateOrUpdateMarks(examId, marksData) {
    await this.getExamById(examId);
    
    // Enforce constraints and add exam_id
    const marksToUpsert = marksData.map(m => ({
      ...m,
      exam_id: Number(examId)
    }));

    return await examsRepository.upsertExamMarks(marksToUpsert);
  }

  async bulkUpsertResults(examId, resultsData) {
    await this.getExamById(examId);
    
    const resultsToUpsert = resultsData.map(r => ({
      ...r,
      exam_id: Number(examId)
    }));

    return await examsRepository.upsertExamResults(resultsToUpsert);
  }

  async calculateCGPA(studentId) {
    if (!studentId || studentId === 'undefined') return 0;
    const results = await examsRepository.getAllStudentResults(studentId);
    if (results.length === 0) return 0;

    const totalSGPA = results.reduce((sum, r) => sum + (r.sgpa || 0), 0);
    const count = results.filter(r => r.sgpa !== null && r.sgpa !== undefined).length;
    
    return count > 0 ? Number((totalSGPA / count).toFixed(2)) : 0;
  }

  async generateResults(examId, batchId) {
    await this.getExamById(examId);
    
    // Fetch all students for the batch
    const studentsRes = await studentRepository.getAllStudents({ batch_id: batchId, limit: 1000 });
    const students = studentsRes.data || [];

    if (students.length === 0) {
      throw new ApiError(404, "No students found in the selected batch");
    }

    const resultsData = students.map(s => ({
      exam_id: Number(examId),
      student_id: s.id,
      result_status: 'PASS' // Default placeholder status
    }));

    await examsRepository.upsertExamResults(resultsData);
    return await this.getExamResults(examId);
  }

  async getGradeReport(examId, studentId) {
    const [exam, student, marks, results] = await Promise.all([
      this.getExamById(examId),
      studentRepository.findStudentById(studentId),
      examsRepository.getStudentMarksByExam(examId, studentId),
      examsRepository.getAllStudentResults(studentId)
    ]);

    if (!student) throw new ApiError(404, "Student not found");

    const currentResult = results.find(r => r.examId === Number(examId));
    const cgpa = await this.calculateCGPA(studentId);

    return {
      student,
      exam,
      marks: marks.map(m => ({
        subjectName: m.subject?.name,
        subjectCode: m.subject?.code,
        grade: m.grade,
        gradePoint: m.gradePoint
      })),
      result: {
        sgpa: currentResult?.sgpa || 0,
        cgpa: cgpa,
        status: currentResult?.resultStatus || 'N/A'
      }
    };
  }

  async validateExamReferences(dto) {
    const [session, semester] = await Promise.all([
      dto.session_id ? academicRepository.findSessionById(dto.session_id) : Promise.resolve(true),
      dto.semester_id ? academicRepository.findSemesterById(dto.semester_id) : Promise.resolve(true),
    ]);

    if (dto.session_id && !session) {
      throw new ApiError(404, "Session not found");
    }

    if (dto.semester_id && !semester) {
      throw new ApiError(404, "Semester not found");
    }

    const checks = [];

    if (dto.program_id) {
      checks.push(
        academicRepository.findProgramById(dto.program_id).then((program) => {
          if (!program) throw new ApiError(404, "Program not found");
        }),
      );
    }

    if (dto.batch_id) {
      checks.push(
        academicRepository.findBatchById(dto.batch_id).then((batch) => {
          if (!batch) throw new ApiError(404, "Batch not found");
        }),
      );
    }

    await Promise.all(checks);
  }
}

export default new ExamsService();
