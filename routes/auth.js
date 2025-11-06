import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login - User login
router.post("/login", authController.login);

// POST /api/auth/register - User registration (admin only in production)
router.post("/register", authController.register);

// GET /api/auth/users - Get all users (admin only in production)
router.get("/users", authController.getUsers);

export default router;
