import pool from "../config/database.js";

// Create a new doctor (user must exist first)
export const createDoctor = async (doctorData) => {
  const { id, doctor_number, specialization_id, hire_date } = doctorData;

  const result = await pool.query(
    `INSERT INTO doctors (id, doctor_number, specialization_id, hire_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, doctor_number, specialization_id, hire_date]
  );

  return result.rows[0];
};

// Get all doctors with user info and specialization
export const getAllDoctors = async () => {
  const result = await pool.query(
    `SELECT d.*, 
            u.username, u.email, u.first_name, u.last_name, u.phone_number, u.is_active as user_active,
            s.name as specialization_name
     FROM doctors d
     JOIN users u ON d.id = u.id
     LEFT JOIN specializations s ON d.specialization_id = s.id
     WHERE u.is_active = true
     ORDER BY u.first_name, u.last_name`
  );
  return result.rows;
};

// Get doctor by ID with full details
export const getDoctorById = async (id) => {
  const result = await pool.query(
    `SELECT d.*, 
            u.username, u.email, u.first_name, u.last_name, u.phone_number, u.is_active as user_active,
            s.name as specialization_name
     FROM doctors d
     JOIN users u ON d.id = u.id
     LEFT JOIN specializations s ON d.specialization_id = s.id
     WHERE d.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
  const { specialization_id, hire_date } = doctorData;

  const result = await pool.query(
    `UPDATE doctors 
     SET specialization_id = COALESCE($1, specialization_id),
         hire_date = COALESCE($2, hire_date),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [specialization_id, hire_date, id]
  );

  return result.rows[0];
};

// Get doctors by specialization
export const getDoctorsBySpecialization = async (specializationId) => {
  const result = await pool.query(
    `SELECT d.*, 
            u.first_name, u.last_name, u.email, u.phone_number
     FROM doctors d
     JOIN users u ON d.id = u.id
     WHERE d.specialization_id = $1 AND u.is_active = true
     ORDER BY u.first_name, u.last_name`,
    [specializationId]
  );
  return result.rows;
};

// Generate next doctor number
export const generateDoctorNumber = async () => {
  const result = await pool.query(
    `SELECT doctor_number FROM doctors 
     ORDER BY id DESC LIMIT 1`
  );

  if (result.rows.length === 0) {
    return "DR-001";
  }

  const lastNumber = result.rows[0].doctor_number;
  const numPart = parseInt(lastNumber.split("-")[1]) + 1;
  return `DR-${String(numPart).padStart(3, "0")}`;
};
