import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login - User login
router.post("/login", authController.login);

// POST /api/auth/logout - User logout (requires auth)
router.post("/logout", authenticateToken, authController.logout);

// POST /api/auth/register - User registration (admin only)
router.post(
  "/register",
  authenticateToken,
  authorizeRoles("admin"),
  authController.register
);

// GET /api/auth/users - Get all users (DEPRECATED - use /api/users)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  authController.getUsers
);

export default router;
