const pool = require("../config/database");

const Appointment = {
  // Create new appointment
  create: async (appointmentData) => {
    const {
      branch_id,
      appointment_number,
      patient_id,
      doctor_id,
      room_id,
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
        branch_id, appointment_number, patient_id, doctor_id, room_id,
        appointment_date, appointment_time, duration_minutes,
        appointment_type, reason, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        branch_id,
        appointment_number,
        patient_id,
        doctor_id,
        room_id,
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
  },

  // Get all appointments with details
  getAll: async (filters = {}) => {
    let query = `
      SELECT a.*,
             p.first_name || ' ' || p.last_name as patient_name,
             p.phone as patient_phone,
             u.full_name as doctor_name,
             s.name_tr as doctor_specialization,
             b.branch_name,
             r.room_number
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.id = u.id
      LEFT JOIN specializations s ON d.specialization_id = s.id
      JOIN branches b ON a.branch_id = b.id
      LEFT JOIN rooms r ON a.room_id = r.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.branch_id) {
      query += ` AND a.branch_id = $${paramCount}`;
      values.push(filters.branch_id);
      paramCount++;
    }

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
  },

  // Get appointment by ID
  getById: async (id) => {
    const result = await pool.query(
      `SELECT a.*,
              p.first_name || ' ' || p.last_name as patient_name,
              p.phone as patient_phone,
              p.email as patient_email,
              u.full_name as doctor_name,
              s.name_tr as doctor_specialization,
              b.branch_name, b.branch_code,
              r.room_number
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       JOIN branches b ON a.branch_id = b.id
       LEFT JOIN rooms r ON a.room_id = r.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update appointment status
  updateStatus: async (id, status, userId, cancellationReason = null) => {
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
  },

  // Update appointment
  update: async (id, appointmentData) => {
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
  },

  // Check if time slot is available
  isTimeSlotAvailable: async (
    doctorId,
    branchId,
    date,
    time,
    excludeAppointmentId = null
  ) => {
    let query = `
      SELECT COUNT(*) as count
      FROM appointments
      WHERE doctor_id = $1 
        AND branch_id = $2
        AND appointment_date = $3 
        AND appointment_time = $4
        AND status NOT IN ('cancelled', 'no-show')
    `;

    const values = [doctorId, branchId, date, time];

    if (excludeAppointmentId) {
      query += ` AND id != $5`;
      values.push(excludeAppointmentId);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count) === 0;
  },

  // Generate appointment number
  generateAppointmentNumber: async (branchCode) => {
    const year = new Date().getFullYear();
    const result = await pool.query(
      `SELECT appointment_number FROM appointments 
       WHERE appointment_number LIKE $1
       ORDER BY id DESC LIMIT 1`,
      [`APT-${branchCode}-${year}-%`]
    );

    if (result.rows.length === 0) {
      return `APT-${branchCode}-${year}-00001`;
    }

    const lastNumber = result.rows[0].appointment_number;
    const numPart = parseInt(lastNumber.split("-").pop()) + 1;
    return `APT-${branchCode}-${year}-${String(numPart).padStart(5, "0")}`;
  },

  // Get appointments by date range
  getByDateRange: async (startDate, endDate, filters = {}) => {
    let query = `
      SELECT a.*,
             p.first_name || ' ' || p.last_name as patient_name,
             u.full_name as doctor_name,
             b.branch_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.id = u.id
      JOIN branches b ON a.branch_id = b.id
      WHERE a.appointment_date BETWEEN $1 AND $2
    `;

    const values = [startDate, endDate];
    let paramCount = 3;

    if (filters.branch_id) {
      query += ` AND a.branch_id = $${paramCount}`;
      values.push(filters.branch_id);
      paramCount++;
    }

    if (filters.doctor_id) {
      query += ` AND a.doctor_id = $${paramCount}`;
      values.push(filters.doctor_id);
      paramCount++;
    }

    query += ` ORDER BY a.appointment_date, a.appointment_time`;

    const result = await pool.query(query, values);
    return result.rows;
  },
};

module.exports = Appointment;
