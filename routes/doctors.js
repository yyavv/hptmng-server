import express from "express";
import * as doctorController from "../controllers/doctorController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { validateRequired } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/doctors - Tüm doktorları listele
router.get("/", doctorController.getDoctors);

// GET /api/doctors/specialization/:specializationId - Uzmanlığa göre doktorlar
router.get(
  "/specialization/:specializationId",
  doctorController.getDoctorsBySpecialization
);

// GET /api/doctors/:id - ID'ye göre doktor getir
router.get("/:id", doctorController.getDoctor);

// POST /api/doctors - Yeni doktor ekle (admin only)
router.post(
  "/",
  authorizeRoles("admin"),
  validateRequired(["user_id", "specialization_id"]),
  doctorController.addDoctor
);

// PUT /api/doctors/:id - Doktor güncelle (admin only)
router.put("/:id", authorizeRoles("admin"), doctorController.updateDoctor);

export default router;
