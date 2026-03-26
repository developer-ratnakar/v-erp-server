import dashboardService from "../services/dashboard.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json(new ApiResponse(200, stats, "Dashboard stats retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
