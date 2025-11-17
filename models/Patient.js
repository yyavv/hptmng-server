import pool from "../config/database.js";

// Create patients table
export const createPatientsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      patient_number VARCHAR(20) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      tc_no VARCHAR(11) UNIQUE,
      passport_no VARCHAR(20),
      birth_date DATE,
      gender VARCHAR(10),
      blood_type VARCHAR(5),
      phone VARCHAR(20),
      email VARCHAR(100),
      address TEXT,
      city VARCHAR(50),
      country VARCHAR(50) DEFAULT 'Turkey',
      emergency_contact_name VARCHAR(100),
      emergency_contact_phone VARCHAR(20),
      emergency_contact_relation VARCHAR(50),
      allergies TEXT,
      chronic_diseases TEXT,
      insurance_company VARCHAR(100),
      insurance_number VARCHAR(50),
      notes TEXT,
      is_active BOOLEAN DEFAULT true,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_patients_tc ON patients(tc_no);
    CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
    CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(is_active);
  `;

  try {
    await pool.query(query);
    console.log("✅ Patients table ready");
  } catch (error) {
    console.error("❌ Error creating patients table:", error);
    throw error;
  }
};

// Get all patients
export const getAllPatients = async () => {
  const result = await pool.query(
    `SELECT p.*,
            u.full_name as created_by_name
     FROM patients p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.is_active = true
     ORDER BY p.created_at DESC`
  );
  return result.rows;
};

// Get patient by ID
export const getPatientById = async (id) => {
  const result = await pool.query(
    `SELECT p.*,
            u.full_name as created_by_name
     FROM patients p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Create patient
export const createPatient = async (patientData) => {
  const {
    patient_number,
    first_name,
    last_name,
    tc_no,
    passport_no,
    birth_date,
    gender,
    blood_type,
    phone,
    email,
    address,
    city,
    country = "Turkey",
    emergency_contact_name,
    emergency_contact_phone,
    emergency_contact_relation,
    allergies,
    chronic_diseases,
    insurance_company,
    insurance_number,
    notes,
    created_by,
  } = patientData;

  const result = await pool.query(
    `INSERT INTO patients (
      patient_number, first_name, last_name, tc_no, passport_no,
      birth_date, gender, blood_type, phone, email, address, city, country,
      emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
      allergies, chronic_diseases, insurance_company, insurance_number,
      notes, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    RETURNING *`,
    [
      patient_number,
      first_name,
      last_name,
      tc_no,
      passport_no,
      birth_date,
      gender,
      blood_type,
      phone,
      email,
      address,
      city,
      country,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
      allergies,
      chronic_diseases,
      insurance_company,
      insurance_number,
      notes,
      created_by,
    ]
  );

  return result.rows[0];
};

// Search patients
export const searchPatients = async (searchTerm) => {
  const result = await pool.query(
    `SELECT * FROM patients 
     WHERE is_active = true
     AND (
       first_name ILIKE $1 OR 
       last_name ILIKE $1 OR 
       phone ILIKE $1 OR 
       tc_no ILIKE $1 OR
       patient_number ILIKE $1
     )
     ORDER BY first_name, last_name
     LIMIT 50`,
    [`%${searchTerm}%`]
  );
  return result.rows;
};

// Update patient
export const updatePatient = async (id, patientData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(patientData).forEach((key) => {
    if (patientData[key] !== undefined && key !== "id") {
      fields.push(`${key} = $${paramCount}`);
      values.push(patientData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await pool.query(
    `UPDATE patients SET ${fields.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

// Soft delete patient
export const deletePatient = async (id) => {
  const result = await pool.query(
    `UPDATE patients SET is_active = false, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// Generate patient number
export const generatePatientNumber = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query(
    `SELECT patient_number FROM patients 
     WHERE patient_number LIKE $1
     ORDER BY id DESC LIMIT 1`,
    [`HKD-${year}-%`]
  );

  if (result.rows.length === 0) {
    return `HKD-${year}-00001`;
  }

  const lastNumber = result.rows[0].patient_number;
  const numPart = parseInt(lastNumber.split("-").pop()) + 1;
  return `HKD-${year}-${String(numPart).padStart(5, "0")}`;
};
