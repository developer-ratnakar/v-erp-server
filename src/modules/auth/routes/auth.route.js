import express from "express";
import { login, createUser, getAllUsers, refreshToken, deleteUser, changeUserPassword } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { requireAuth } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), createUser);
router.post("/refresh", refreshToken);
router.get("/users", requireAuth, getAllUsers);
router.delete("/users/:userId", requireAuth, deleteUser);
router.patch("/users/:userId/password", requireAuth, changeUserPassword);

export default router;

