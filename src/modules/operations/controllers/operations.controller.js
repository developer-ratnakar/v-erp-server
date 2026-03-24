import operationsService from "../services/operations.service.js";
import { getPagination } from "../../../utils/pagination.js";

export const createSubject = async (req, res, next) => {
  try {
    const subject = await operationsService.createSubject(req.body);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    pagination.search = _req.query.search;
    pagination.department_id = _req.query.department_id;
    pagination.program_id = _req.query.program_id;
    
    const subjects = await operationsService.getAllSubjects(pagination); // Changed to operationsService to maintain syntactic correctness as studentService is not imported.
    res.status(200).json({
      data: subjects.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: subjects.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await operationsService.getSubjectById(req.params.subjectId);
    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const subject = await operationsService.updateSubject(req.params.subjectId, req.body);
    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    await operationsService.deleteSubject(req.params.subjectId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createTimetable = async (req, res, next) => {
  try {
    const timetable = await operationsService.createTimetable(req.body);
    res.status(201).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const getAllTimetables = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    pagination.search = _req.query.search;
    pagination.program_id = _req.query.program_id;
    pagination.department_id = _req.query.department_id;
    pagination.batch_id = _req.query.batch_id;
    pagination.semester_id = _req.query.semester_id;

    const timetables = await operationsService.getAllTimetables(pagination);
    res.status(200).json({
      data: timetables.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: timetables.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTimetableById = async (req, res, next) => {
  try {
    const timetable = await operationsService.getTimetableById(req.params.timetableId);
    res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const updateTimetable = async (req, res, next) => {
  try {
    const timetable = await operationsService.updateTimetable(req.params.timetableId, req.body);
    res.status(200).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const deleteTimetable = async (req, res, next) => {
  try {
    await operationsService.deleteTimetable(req.params.timetableId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createTimetableEntry = async (req, res, next) => {
  try {
    const entry = await operationsService.createTimetableEntry(req.params.timetableId, req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getTimetableEntries = async (req, res, next) => {
  try {
    const entries = await operationsService.getTimetableEntries(req.params.timetableId);
    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

export const updateTimetableEntry = async (req, res, next) => {
  try {
    const entry = await operationsService.updateTimetableEntry(req.params.timetableId, req.params.entryId, req.body);
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteTimetableEntry = async (req, res, next) => {
  try {
    await operationsService.deleteTimetableEntry(req.params.timetableId, req.params.entryId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
