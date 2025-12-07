import * as Specialization from "../models/Specialization.js";

// Tüm uzmanlıkları listele
export const getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.getAllSpecializations();
    res.json({
      success: true,
      data: specializations,
    });
  } catch (error) {
    console.error("Uzmanlıklar getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Uzmanlıklar alınırken hata oluştu",
      error: error.message,
    });
  }
};

// ID'ye göre uzmanlık getir
export const getSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.getSpecializationById(
      req.params.id
    );
    if (!specialization) {
      return res.status(404).json({
        success: false,
        message: "Uzmanlık bulunamadı",
      });
    }
    res.json({
      success: true,
      data: specialization,
    });
  } catch (error) {
    console.error("Uzmanlık getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Uzmanlık alınırken hata oluştu",
      error: error.message,
    });
  }
};

// Yeni uzmanlık ekle
export const addSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.createSpecialization(req.body);
    res.status(201).json({
      success: true,
      message: "Uzmanlık başarıyla eklendi",
      data: specialization,
    });
  } catch (error) {
    console.error("Uzmanlık ekleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Uzmanlık eklenirken hata oluştu",
      error: error.message,
    });
  }
};

// Uzmanlık güncelle
export const updateSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.updateSpecialization(
      req.params.id,
      req.body
    );
    if (!specialization) {
      return res.status(404).json({
        success: false,
        message: "Uzmanlık bulunamadı",
      });
    }
    res.json({
      success: true,
      message: "Uzmanlık başarıyla güncellendi",
      data: specialization,
    });
  } catch (error) {
    console.error("Uzmanlık güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Uzmanlık güncellenirken hata oluştu",
      error: error.message,
    });
  }
};
