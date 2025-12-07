import * as Doctor from "../models/Doctor.js";

// Tüm doktorları listele
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAllDoctors();
    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Doktorlar getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Doktorlar alınırken hata oluştu",
      error: error.message,
    });
  }
};

// ID'ye göre doktor getir
export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doktor bulunamadı",
      });
    }
    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Doktor getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Doktor alınırken hata oluştu",
      error: error.message,
    });
  }
};

// Yeni doktor ekle
export const addDoctor = async (req, res) => {
  try {
    // user_id'yi id olarak map et
    if (req.body.user_id) {
      req.body.id = req.body.user_id;
      delete req.body.user_id;
    }

    // Generate doctor number if not provided
    if (!req.body.doctor_number) {
      req.body.doctor_number = await Doctor.generateDoctorNumber();
    }

    const doctor = await Doctor.createDoctor(req.body);
    res.status(201).json({
      success: true,
      message: "Doktor başarıyla eklendi",
      data: doctor,
    });
  } catch (error) {
    console.error("Doktor ekleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Doktor eklenirken hata oluştu",
      error: error.message,
    });
  }
};

// Doktor güncelle
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.updateDoctor(req.params.id, req.body);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doktor bulunamadı",
      });
    }
    res.json({
      success: true,
      message: "Doktor başarıyla güncellendi",
      data: doctor,
    });
  } catch (error) {
    console.error("Doktor güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Doktor güncellenirken hata oluştu",
      error: error.message,
    });
  }
};

// Uzmanlığa göre doktorları getir
export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const doctors = await Doctor.getDoctorsBySpecialization(
      req.params.specializationId
    );
    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Doktorlar getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Doktorlar alınırken hata oluştu",
      error: error.message,
    });
  }
};
