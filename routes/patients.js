import express from "express";
import * as patientController from "../controllers/patientController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { validateRequired } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/patients - Tüm hastaları listele (all roles can view)
router.get("/", patientController.getPatients);

// POST /api/patients - Yeni hasta ekle (staff and admin only)
router.post(
  "/",
  authorizeRoles("admin", "receptionist", "nurse"),
  validateRequired(["first_name", "last_name", "phone"]),
  patientController.addPatient
);

// GET /api/patients/:id - ID'ye göre hasta getir (all roles can view)
router.get("/:id", patientController.getPatient);

// PUT /api/patients/:id - Hasta güncelle (staff and admin only)
router.put(
  "/:id",
  authorizeRoles("admin", "receptionist", "nurse"),
  patientController.updatePatient
);

// DELETE /api/patients/:id - Hasta sil (admin only)
router.delete("/:id", authorizeRoles("admin"), patientController.deletePatient);

export default router;
