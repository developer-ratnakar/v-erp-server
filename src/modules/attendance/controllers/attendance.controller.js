import attendanceService from "../services/attendance.service.js";
import { getPagination } from "../../../utils/pagination.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.createAttendance(req.body);
    res.status(201).json(new ApiResponse(201, attendance, "Attendance created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllAttendance = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    pagination.student_id = _req.query.student_id;
    pagination.subject_id = _req.query.subject_id;
    pagination.month = _req.query.month;
    pagination.program_id = _req.query.program_id;
    pagination.department_id = _req.query.department_id;
    pagination.batch_id = _req.query.batch_id;
    pagination.semester_id = _req.query.semester_id;
    
    const attendance = await attendanceService.getAllAttendance(pagination);
    res.status(200).json(new ApiResponse(200, {
      data: attendance.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: attendance.count,
      },
    }, "Attendance retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.attendanceId);
    res.status(200).json(new ApiResponse(200, attendance, "Attendance retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.updateAttendance(req.params.attendanceId, req.body);
    res.status(200).json(new ApiResponse(200, attendance, "Attendance updated successfully"));
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
export const markDailyAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.markDailyAttendance(req.body, req.user);
    res.status(200).json(new ApiResponse(200, attendance, "Daily attendance marked successfully"));
  } catch (error) {
    next(error);
  }
};

export const getFacultyAssignments = async (req, res, next) => {
  try {
    const assignments = await attendanceService.getFacultyAssignments(req.user.email);
    res.status(200).json(new ApiResponse(200, assignments, "Faculty assignments retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
