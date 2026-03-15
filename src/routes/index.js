import { Router } from "express";
import academicRouter from "../modules/academic/routes/academic.route.js";
import attendanceRouter from "../modules/attendance/routes/attendance.route.js";
import authRouter from "../modules/auth/routes/auth.route.js";
import clcRouter from "../modules/clc/routes/clc.route.js";
import examsRouter from "../modules/exams/routes/exams.route.js";
import hrRouter from "../modules/hr/routes/hr.route.js";
import operationsRouter from "../modules/operations/routes/operations.route.js";
import rbacRouter from "../modules/rbac/routes/rbac.route.js";
import studentRouter from "../modules/students/routes/student.route.js";

const indexRouter = Router();

indexRouter.use("/academic", academicRouter);
indexRouter.use("/attendance", attendanceRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/clc", clcRouter);
indexRouter.use("/exams", examsRouter);
indexRouter.use("/hr", hrRouter);
indexRouter.use("/operations", operationsRouter);
indexRouter.use("/rbac", rbacRouter);
indexRouter.use("/students", studentRouter);

export default indexRouter;
