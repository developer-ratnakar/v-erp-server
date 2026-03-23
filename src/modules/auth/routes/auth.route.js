import express from "express";
import { login, createUser, getAllUsers, refreshToken } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { requireAuth } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), createUser);
router.post("/refresh", refreshToken);           // exchange refresh token for new pair
router.get("/users", requireAuth, getAllUsers);

export default router;
