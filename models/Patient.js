import pool from "../config/database.js";

// Hastalar tablosunu oluştur
export const createPatientsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      tc_no VARCHAR(11) UNIQUE NOT NULL,
      birth_date DATE,
      phone VARCHAR(20),
      email VARCHAR(100),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Patients tablosu hazır");
  } catch (error) {
    console.error("❌ Patients tablosu oluşturma hatası:", error);
    throw error;
  }
};

// Tüm hastaları getir
export const getAllPatients = async () => {
  const result = await pool.query(
    "SELECT * FROM patients ORDER BY created_at DESC"
  );
  return result.rows;
};

// Hasta ekle
export const createPatient = async (patientData) => {
  const { first_name, last_name, tc_no, birth_date, phone, email, address } =
    patientData;

  const result = await pool.query(
    `INSERT INTO patients (first_name, last_name, tc_no, birth_date, phone, email, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [first_name, last_name, tc_no, birth_date, phone, email, address]
  );

  return result.rows[0];
};

// ID'ye göre hasta getir
export const getPatientById = async (id) => {
  const result = await pool.query("SELECT * FROM patients WHERE id = $1", [id]);
  return result.rows[0];
};

// Hasta güncelle
export const updatePatient = async (id, patientData) => {
  const { first_name, last_name, tc_no, birth_date, phone, email, address } =
    patientData;

  const result = await pool.query(
    `UPDATE patients 
     SET first_name = $1, last_name = $2, tc_no = $3, birth_date = $4, 
         phone = $5, email = $6, address = $7, updated_at = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING *`,
    [first_name, last_name, tc_no, birth_date, phone, email, address, id]
  );

  return result.rows[0];
};

// Hasta sil
export const deletePatient = async (id) => {
  await pool.query("DELETE FROM patients WHERE id = $1", [id]);
};
