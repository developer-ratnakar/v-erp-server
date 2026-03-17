import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", dashboardController.getDashboardStats);

export default dashboardRouter;
