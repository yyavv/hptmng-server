import * as Patient from "../models/Patient.js";

// Tüm hastaları listele
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.getAllPatients();
    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error("Hastalar getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Hastalar alınırken hata oluştu",
      error: error.message,
    });
  }
};

// Yeni hasta ekle
export const addPatient = async (req, res) => {
  try {
    // Generate patient number if not provided
    if (!req.body.patient_number) {
      req.body.patient_number = await Patient.generatePatientNumber();
    }

    // Set created_by from authenticated user
    req.body.created_by = req.user.id;

    const patient = await Patient.createPatient(req.body);
    res.status(201).json({
      success: true,
      message: "Hasta başarıyla eklendi",
      data: patient,
    });
  } catch (error) {
    console.error("Hasta ekleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Hasta eklenirken hata oluştu",
      error: error.message,
    });
  }
};

// ID'ye göre hasta getir
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Hasta bulunamadı",
      });
    }
    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Hasta getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Hasta alınırken hata oluştu",
      error: error.message,
    });
  }
};

// Hasta güncelle
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.updatePatient(req.params.id, req.body);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Hasta bulunamadı",
      });
    }
    res.json({
      success: true,
      message: "Hasta başarıyla güncellendi",
      data: patient,
    });
  } catch (error) {
    console.error("Hasta güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Hasta güncellenirken hata oluştu",
      error: error.message,
    });
  }
};

// Hasta sil
export const deletePatient = async (req, res) => {
  try {
    await Patient.deletePatient(req.params.id);
    res.json({
      success: true,
      message: "Hasta başarıyla silindi",
    });
  } catch (error) {
    console.error("Hasta silme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Hasta silinirken hata oluştu",
      error: error.message,
    });
  }
};
