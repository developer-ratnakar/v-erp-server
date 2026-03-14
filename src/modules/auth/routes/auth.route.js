import express from "express";
import { login } from "../controllers/auth.controller.js";
import { loginSchema } from "../validation/auth.validation.js";
import { validate } from "../../../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);

export default router
