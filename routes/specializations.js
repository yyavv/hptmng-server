import express from "express";
import * as specializationController from "../controllers/specializationController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { validateRequired } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/specializations - Tüm uzmanlıkları listele
router.get("/", specializationController.getSpecializations);

// GET /api/specializations/:id - ID'ye göre uzmanlık getir
router.get("/:id", specializationController.getSpecialization);

// POST /api/specializations - Yeni uzmanlık ekle (admin only)
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequired(["name"]),
  specializationController.addSpecialization
);

// PUT /api/specializations/:id - Uzmanlık güncelle (admin only)
router.put(
  "/:id",
  authorizeRoles("admin"),
  specializationController.updateSpecialization
);

export default router;
