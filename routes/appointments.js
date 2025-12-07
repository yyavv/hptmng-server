import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Tüm routelar authentication gerektirir
router.use(authenticateToken);

// GET /api/appointments - Tüm randevuları getir (query params ile filtreleme)
router.get("/", appointmentController.getAppointments);

// GET /api/appointments/date-range - Tarih aralığına göre randevular
router.get("/date-range", appointmentController.getAppointmentsByDateRange);

// GET /api/appointments/doctor - Doktorun randevuları
router.get("/doctor", appointmentController.getDoctorAppointments);

// GET /api/appointments/patient/:patient_id - Hastanın randevuları
router.get(
  "/patient/:patient_id",
  appointmentController.getPatientAppointments
);

// GET /api/appointments/:id - Randevu detayı
router.get("/:id", appointmentController.getAppointment);

// POST /api/appointments - Yeni randevu oluştur
router.post("/", appointmentController.createAppointment);

// PUT /api/appointments/:id - Randevu güncelle
router.put("/:id", appointmentController.updateAppointment);

// PATCH /api/appointments/:id/status - Randevu durumu güncelle
router.patch("/:id/status", appointmentController.updateAppointmentStatus);

export default router;
