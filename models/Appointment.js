import pool from "../config/database.js";

// Create new appointment
export const createAppointment = async (appointmentData) => {
  const {
    appointment_number,
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    duration_minutes = 30,
    appointment_type,
    reason,
    notes,
    created_by,
  } = appointmentData;

  const result = await pool.query(
    `INSERT INTO appointments (
      appointment_number, patient_id, doctor_id,
      appointment_date, appointment_time, duration_minutes,
      appointment_type, reason, notes, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      appointment_number,
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      appointment_type,
      reason,
      notes,
      created_by,
    ]
  );

  return result.rows[0];
};

// Get all appointments with details
export const getAllAppointments = async (filters = {}) => {
  let query = `
    SELECT a.*,
           p.first_name || ' ' || p.last_name as patient_name,
           p.phone as patient_phone,
           u.first_name || ' ' || u.last_name as doctor_name,
           s.name as doctor_specialization
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u ON d.id = u.id
    LEFT JOIN specializations s ON d.specialization_id = s.id
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 1;

  if (filters.doctor_id) {
    query += ` AND a.doctor_id = $${paramCount}`;
    values.push(filters.doctor_id);
    paramCount++;
  }

  if (filters.patient_id) {
    query += ` AND a.patient_id = $${paramCount}`;
    values.push(filters.patient_id);
    paramCount++;
  }

  if (filters.date) {
    query += ` AND a.appointment_date = $${paramCount}`;
    values.push(filters.date);
    paramCount++;
  }

  if (filters.status) {
    query += ` AND a.status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  const result = await pool.query(
    `SELECT a.*,
            p.first_name || ' ' || p.last_name as patient_name,
            p.phone as patient_phone,
            p.email as patient_email,
            u.first_name || ' ' || u.last_name as doctor_name,
            s.name as doctor_specialization
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     JOIN doctors d ON a.doctor_id = d.id
     JOIN users u ON d.id = u.id
     LEFT JOIN specializations s ON d.specialization_id = s.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update appointment status
export const updateAppointmentStatus = async (
  id,
  status,
  userId,
  cancellationReason = null
) => {
  const result = await pool.query(
    `UPDATE appointments 
     SET status = $1,
         cancelled_by = CASE WHEN $1 = 'cancelled' THEN $2 ELSE cancelled_by END,
         cancellation_reason = CASE WHEN $1 = 'cancelled' THEN $3 ELSE cancellation_reason END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [status, userId, cancellationReason, id]
  );
  return result.rows[0];
};

// Update appointment
export const updateAppointment = async (id, appointmentData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(appointmentData).forEach((key) => {
    if (appointmentData[key] !== undefined && key !== "id") {
      fields.push(`${key} = $${paramCount}`);
      values.push(appointmentData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await pool.query(
    `UPDATE appointments SET ${fields.join(
      ", "
    )} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  return result.rows[0];
};

// Check if time slot is available
export const isTimeSlotAvailable = async (
  doctorId,
  date,
  time,
  excludeAppointmentId = null
) => {
  let query = `
    SELECT COUNT(*) as count
    FROM appointments
    WHERE doctor_id = $1 
      AND appointment_date = $2 
      AND appointment_time = $3
      AND status NOT IN ('cancelled', 'no-show')
  `;

  const values = [doctorId, date, time];

  if (excludeAppointmentId) {
    query += ` AND id != $4`;
    values.push(excludeAppointmentId);
  }

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count) === 0;
};

// Generate appointment number
export const generateAppointmentNumber = async () => {
  const result = await pool.query(
    `SELECT appointment_number FROM appointments 
     ORDER BY id DESC LIMIT 1`
  );

  if (result.rows.length === 0) {
    return "APT-00001";
  }

  const lastNumber = result.rows[0].appointment_number;
  const numPart = parseInt(lastNumber.split("-")[1]) + 1;
  return `APT-${String(numPart).padStart(5, "0")}`;
};

// Get appointments by date range
export const getAppointmentsByDateRange = async (
  startDate,
  endDate,
  filters = {}
) => {
  let query = `
    SELECT a.*,
           p.first_name || ' ' || p.last_name as patient_name,
           u.first_name || ' ' || u.last_name as doctor_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u ON d.id = u.id
    WHERE a.appointment_date BETWEEN $1 AND $2
  `;

  const values = [startDate, endDate];
  let paramCount = 3;

  if (filters.doctor_id) {
    query += ` AND a.doctor_id = $${paramCount}`;
    values.push(filters.doctor_id);
    paramCount++;
  }

  query += ` ORDER BY a.appointment_date, a.appointment_time`;

  const result = await pool.query(query, values);
  return result.rows;
};

// Get doctor's appointments for a specific date
export const getDoctorAppointmentsByDate = async (doctorId, date) => {
  const result = await pool.query(
    `SELECT a.*,
            p.first_name || ' ' || p.last_name as patient_name,
            p.phone as patient_phone
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     WHERE a.doctor_id = $1 
       AND a.appointment_date = $2
       AND a.status NOT IN ('cancelled', 'no-show')
     ORDER BY a.appointment_time`,
    [doctorId, date]
  );
  return result.rows;
};

// Get patient's appointment history
export const getPatientAppointments = async (patientId) => {
  const result = await pool.query(
    `SELECT a.*,
            u.first_name || ' ' || u.last_name as doctor_name,
            s.name as doctor_specialization
     FROM appointments a
     JOIN doctors d ON a.doctor_id = d.id
     JOIN users u ON d.id = u.id
     LEFT JOIN specializations s ON d.specialization_id = s.id
     WHERE a.patient_id = $1
     ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
    [patientId]
  );
  return result.rows;
};
