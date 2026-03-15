import attendanceService from "../services/attendance.service.js";
import { getPagination } from "../../../utils/pagination.js";

export const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const attendance = await attendanceService.getAllAttendance(pagination);
    res.status(200).json({
      data: attendance.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: attendance.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.attendanceId);
    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.updateAttendance(req.params.attendanceId, req.body);
    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    await attendanceService.deleteAttendance(req.params.attendanceId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
