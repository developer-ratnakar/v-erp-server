import { Router } from "express";
import authRouter from "../modules/auth/routes/auth.route.js";
import rbacRouter from "../modules/rbac/routes/rbac.route.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/rbac", rbacRouter);

export default indexRouter;