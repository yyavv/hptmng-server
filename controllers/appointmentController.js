import * as Appointment from "../models/Appointment.js";

// Tüm randevuları getir
export const getAppointments = async (req, res) => {
  try {
    const filters = {
      doctor_id: req.query.doctor_id,
      patient_id: req.query.patient_id,
      date: req.query.date,
      status: req.query.status,
    };

    const appointments = await Appointment.getAllAppointments(filters);
    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Randevular getirilirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevular getirilirken hata oluştu",
      error: error.message,
    });
  }
};

// Randevu detayı getir
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }
    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Randevu getirilirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevu getirilirken hata oluştu",
      error: error.message,
    });
  }
};

// Yeni randevu oluştur
export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      appointment_type,
      reason,
      notes,
    } = req.body;

    // Gerekli alanları kontrol et
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Hasta, doktor, tarih ve saat bilgileri gereklidir",
      });
    }

    // Zaman slotu müsait mi kontrol et
    const isAvailable = await Appointment.isTimeSlotAvailable(
      doctor_id,
      appointment_date,
      appointment_time
    );

    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: "Bu zaman dilimi için zaten bir randevu mevcut",
      });
    }

    // Randevu numarası oluştur
    const appointment_number = await Appointment.generateAppointmentNumber();

    const appointmentData = {
      appointment_number,
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes: duration_minutes || 30,
      appointment_type: appointment_type || "muayene",
      reason,
      notes,
      created_by: req.user.id,
    };

    const newAppointment = await Appointment.createAppointment(appointmentData);

    res.status(201).json({
      success: true,
      message: "Randevu başarıyla oluşturuldu",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Randevu oluşturulurken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevu oluşturulurken hata oluştu",
      error: error.message,
    });
  }
};

// Randevu güncelle
export const updateAppointment = async (req, res) => {
  try {
    // Body kontrolü
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Güncellenecek veri bulunamadı",
      });
    }

    // Güncellenebilir alanlar
    const allowedFields = [
      "patient_id",
      "doctor_id",
      "appointment_date",
      "appointment_time",
      "duration_minutes",
      "appointment_type",
      "reason",
      "notes",
      "status",
    ];

    // Sadece izin verilen alanları filtrele
    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Güncellenebilir alan bulunamadı",
        allowedFields: allowedFields,
      });
    }

    const { appointment_date, appointment_time, doctor_id } = updateData;

    // Eğer tarih, saat veya doktor değişiyorsa zaman slotunu kontrol et
    if (appointment_date || appointment_time || doctor_id) {
      const currentAppointment = await Appointment.getAppointmentById(
        req.params.id
      );

      if (!currentAppointment) {
        return res.status(404).json({
          success: false,
          message: "Randevu bulunamadı",
        });
      }

      const checkDoctorId = doctor_id || currentAppointment.doctor_id;
      const checkDate = appointment_date || currentAppointment.appointment_date;
      const checkTime = appointment_time || currentAppointment.appointment_time;

      const isAvailable = await Appointment.isTimeSlotAvailable(
        checkDoctorId,
        checkDate,
        checkTime,
        req.params.id
      );

      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          message: "Bu zaman dilimi için zaten bir randevu mevcut",
        });
      }
    }

    const appointment = await Appointment.updateAppointment(
      req.params.id,
      updateData
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Randevu başarıyla güncellendi",
      data: appointment,
    });
  } catch (error) {
    console.error("Randevu güncellenirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevu güncellenirken hata oluştu",
      error: error.message,
    });
  }
};

// Randevu durumu güncelle
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellation_reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Durum bilgisi gereklidir",
      });
    }

    const validStatuses = [
      "scheduled",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum değeri",
      });
    }

    const appointment = await Appointment.updateAppointmentStatus(
      req.params.id,
      status,
      req.user.id,
      cancellation_reason
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Randevu bulunamadı",
      });
    }

    res.json({
      success: true,
      message: "Randevu durumu başarıyla güncellendi",
      data: appointment,
    });
  } catch (error) {
    console.error("Randevu durumu güncellenirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevu durumu güncellenirken hata oluştu",
      error: error.message,
    });
  }
};

// Doktorun belirli tarihteki randevularını getir
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({
        success: false,
        message: "Doktor ID ve tarih gereklidir",
      });
    }

    const appointments = await Appointment.getDoctorAppointmentsByDate(
      doctor_id,
      date
    );

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Doktor randevuları getirilirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Doktor randevuları getirilirken hata oluştu",
      error: error.message,
    });
  }
};

// Hastanın randevu geçmişini getir
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getPatientAppointments(
      req.params.patient_id
    );

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Hasta randevuları getirilirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Hasta randevuları getirilirken hata oluştu",
      error: error.message,
    });
  }
};

// Tarih aralığına göre randevuları getir
export const getAppointmentsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, doctor_id } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Başlangıç ve bitiş tarihleri gereklidir",
      });
    }

    const filters = doctor_id ? { doctor_id } : {};
    const appointments = await Appointment.getAppointmentsByDateRange(
      start_date,
      end_date,
      filters
    );

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Randevular getirilirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Randevular getirilirken hata oluştu",
      error: error.message,
    });
  }
};
