import examsService from "../services/exams.service.js";
import { getPagination } from "../../../utils/pagination.js";

export const createExam = async (req, res, next) => {
  try {
    const exam = await examsService.createExam(req.body);
    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

export const getAllExams = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const exams = await examsService.getAllExams(pagination);
    res.status(200).json({
      data: exams.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: exams.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const exam = await examsService.getExamById(req.params.examId);
    res.status(200).json(exam);
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await examsService.updateExam(req.params.examId, req.body);
    res.status(200).json(exam);
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
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getExamResults = async (req, res, next) => {
  try {
    const results = await examsService.getExamResults(req.params.examId);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const updateExamResult = async (req, res, next) => {
  try {
    const result = await examsService.updateExamResult(req.params.resultId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getExamResultById = async (req, res, next) => {
  try {
    const result = await examsService.getExamResultById(req.params.resultId);
    res.status(200).json(result);
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
    res.status(201).json(mark);
  } catch (error) {
    next(error);
  }
};

export const getExamMarks = async (req, res, next) => {
  try {
    const marks = await examsService.getExamMarks(req.params.examId);
    res.status(200).json(marks);
  } catch (error) {
    next(error);
  }
};

export const updateExamMark = async (req, res, next) => {
  try {
    const mark = await examsService.updateExamMark(req.params.markId, req.body);
    res.status(200).json(mark);
  } catch (error) {
    next(error);
  }
};

export const getExamMarkById = async (req, res, next) => {
  try {
    const mark = await examsService.getExamMarkById(req.params.markId);
    res.status(200).json(mark);
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
