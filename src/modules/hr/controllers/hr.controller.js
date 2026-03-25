import hrService from "../services/hr.service.js";
import { getPagination } from "../../../utils/pagination.js";
import ApiError from "../../../errors/ApiError.js";

export const createStaff = async (req, res, next) => {
  try {
    const staff = await hrService.createStaff(req.body);
    res.status(201).json(staff);
  } catch (error) {
    next(error);
  }
};

export const getAllStaff = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const staff = await hrService.getAllStaff(pagination);
    res.status(200).json({
      data: staff.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: staff.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req, res, next) => {
  try {
    const staff = await hrService.getStaffById(req.params.staffId);
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req, res, next) => {
  try {
    const staff = await hrService.updateStaff(req.params.staffId, req.body);
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req, res, next) => {
  try {
    await hrService.deleteStaff(req.params.staffId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Attendance
export const upsertAttendance = async (req, res, next) => {
  try {
    const attendance = await hrService.upsertAttendance(req.body);
    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const attendance = await hrService.getAttendance(req.query.date, req.query.departmentId);
    res.status(200).json(attendance);
  } catch (error) {
    next(error);
  }
};

// Leaves
export const applyLeave = async (req, res, next) => {
  try {
    let staffId = req.body.staff_id || req.params.staffId || req.user.staffId;
    
    if (!staffId && req.user?.id) {
      const staff = await hrService.getStaffByUserId(req.user.id);
      staffId = staff.id;
    }

    if (!staffId) {
      throw new ApiError(400, "staff_id is required");
    }
    const leave = await hrService.applyLeave(staffId, req.body);
    res.status(201).json(leave);
  } catch (error) {
    next(error);
  }
};

export const getLeaves = async (req, res, next) => {
  try {
    const leaves = await hrService.getLeaves(req.params.staffId || req.query.staffId);
    res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

export const updateLeaveStatus = async (req, res, next) => {
  try {
    let approverId = req.user.staffId;
    
    if (!approverId && req.user?.id) {
      try {
        const staff = await hrService.getStaffByUserId(req.user.id);
        approverId = staff.id;
      } catch (e) {
        console.warn("User has no staff profile linked, proceeding with null approverId");
      }
    }

    const leave = await hrService.updateLeaveStatus(req.params.leaveId, req.body.status, approverId);
    res.status(200).json(leave);
  } catch (error) {
    console.error("Error in updateLeaveStatus controller:", error);
    next(error);
  }
};

export const getStaffLoad = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const load = await hrService.getStaffLoad(req.params.staffId, start, end);
    res.status(200).json(load);
  } catch (error) {
    next(error);
  }
};
