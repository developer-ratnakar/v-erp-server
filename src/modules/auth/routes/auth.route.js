import express from "express";
import { login, createUser } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { validate } from "../../../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), createUser);

export default router;
