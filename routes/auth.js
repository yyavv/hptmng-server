import express from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login - User login
router.post("/login", authController.login);

// POST /api/auth/register - User registration (admin only)
router.post(
  "/register",
  authenticateToken,
  authorizeRoles("admin"),
  authController.register
);

// GET /api/auth/users - Get all users (admin only)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"),
  authController.getUsers
);

// GET /api/auth/users/:id - Get user by ID (admin only)
router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  authController.getUserById
);

// PUT /api/auth/users/:id - Update user (admin only)
router.put(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  authController.updateUser
);

// DELETE /api/auth/users/:id - Soft delete user (admin only)
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  authController.deleteUser
);

export default router;
