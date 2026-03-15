import hrService from "../services/hr.service.js";
import { getPagination } from "../../../utils/pagination.js";

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
