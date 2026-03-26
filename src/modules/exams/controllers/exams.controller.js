import examsService from "../services/exams.service.js";
import { getPagination } from "../../../utils/pagination.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createExam = async (req, res, next) => {
  try {
    const exam = await examsService.createExam(req.body);
    res.status(201).json(new ApiResponse(201, exam, "Exam created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllExams = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const exams = await examsService.getAllExams(pagination);
    res.status(200).json(new ApiResponse(200, {
      data: exams.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: exams.count,
      },
    }, "Exams retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const exam = await examsService.getExamById(req.params.examId);
    res.status(200).json(new ApiResponse(200, exam, "Exam retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await examsService.updateExam(req.params.examId, req.body);
    res.status(200).json(new ApiResponse(200, exam, "Exam updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    await examsService.deleteExam(req.params.examId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createExamResult = async (req, res, next) => {
  try {
    const result = await examsService.createExamResult(req.params.examId, req.body);
    res.status(201).json(new ApiResponse(201, result, "Exam result created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getExamResults = async (req, res, next) => {
  try {
    const results = await examsService.getExamResults(req.params.examId);
    res.status(200).json(new ApiResponse(200, results, "Exam results retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateExamResult = async (req, res, next) => {
  try {
    const result = await examsService.updateExamResult(req.params.resultId, req.body);
    res.status(200).json(new ApiResponse(200, result, "Exam result updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getExamResultById = async (req, res, next) => {
  try {
    const result = await examsService.getExamResultById(req.params.resultId);
    res.status(200).json(new ApiResponse(200, result, "Exam result retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteExamResult = async (req, res, next) => {
  try {
    await examsService.deleteExamResult(req.params.resultId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createExamMark = async (req, res, next) => {
  try {
    const mark = await examsService.createExamMark(req.params.examId, req.body);
    res.status(201).json(new ApiResponse(201, mark, "Exam mark created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getExamMarks = async (req, res, next) => {
  try {
    const marks = await examsService.getExamMarks(req.params.examId);
    res.status(200).json(new ApiResponse(200, marks, "Exam marks retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateExamMark = async (req, res, next) => {
  try {
    const mark = await examsService.updateExamMark(req.params.markId, req.body);
    res.status(200).json(new ApiResponse(200, mark, "Exam mark updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getExamMarkById = async (req, res, next) => {
  try {
    const mark = await examsService.getExamMarkById(req.params.markId);
    res.status(200).json(new ApiResponse(200, mark, "Exam mark retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteExamMark = async (req, res, next) => {
  try {
    await examsService.deleteExamMark(req.params.markId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const bulkCreateOrUpdateMarks = async (req, res, next) => {
  try {
    const marks = await examsService.bulkCreateOrUpdateMarks(req.params.examId, req.body);
    res.status(200).json(new ApiResponse(200, marks, "Marks upserted successfully"));
  } catch (error) {
    next(error);
  }
};

export const generateResults = async (req, res, next) => {
  try {
    const results = await examsService.generateResults(req.params.examId, req.query.batchId);
    res.status(200).json(new ApiResponse(200, results, "Results generated successfully"));
  } catch (error) {
    next(error);
  }
};

export const bulkUpsertResults = async (req, res, next) => {
  try {
    const results = await examsService.bulkUpsertResults(req.params.examId, req.body);
    res.status(200).json(new ApiResponse(200, results, "Results upserted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getStudentCGPA = async (req, res, next) => {
  try {
    const cgpa = await examsService.calculateCGPA(req.params.studentId);
    res.status(200).json(new ApiResponse(200, { cgpa }, "CGPA retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getGradeReport = async (req, res, next) => {
  try {
    const report = await examsService.getGradeReport(req.params.examId, req.params.studentId);
    res.status(200).json(new ApiResponse(200, report, "Grade report retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
