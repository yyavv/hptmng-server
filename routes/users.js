import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles("admin"));

// GET /api/users - Get all users
router.get("/", userController.getUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", userController.getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", userController.updateUser);

// DELETE /api/users/:id - Soft delete user
router.delete("/:id", userController.deleteUser);

export default router;
