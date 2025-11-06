import express from "express";
import * as patientController from "../controllers/patientController.js";

const router = express.Router();

// GET /api/patients - Tüm hastaları listele
router.get("/", patientController.getPatients);

// POST /api/patients - Yeni hasta ekle
router.post("/", patientController.addPatient);

// GET /api/patients/:id - ID'ye göre hasta getir
router.get("/:id", patientController.getPatient);

// PUT /api/patients/:id - Hasta güncelle
router.put("/:id", patientController.updatePatient);

// DELETE /api/patients/:id - Hasta sil
router.delete("/:id", patientController.deletePatient);

export default router;
