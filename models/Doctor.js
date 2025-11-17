const pool = require("../config/database");

const Doctor = {
  // Create a new doctor (user must exist first)
  create: async (doctorData) => {
    const {
      id, // user_id
      doctor_number,
      specialization_id,
      license_number,
      consultation_fee,
      qualification,
      experience_years,
      bio,
    } = doctorData;

    const result = await pool.query(
      `INSERT INTO doctors (
        id, doctor_number, specialization_id, license_number,
        consultation_fee, qualification, experience_years, bio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        id,
        doctor_number,
        specialization_id,
        license_number,
        consultation_fee,
        qualification,
        experience_years,
        bio,
      ]
    );

    return result.rows[0];
  },

  // Get all doctors with user info and specialization
  getAll: async () => {
    const result = await pool.query(
      `SELECT d.*, 
              u.username, u.email, u.full_name, u.is_active as user_active,
              s.name_tr as specialization_name, s.code as specialization_code
       FROM doctors d
       JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       WHERE u.is_active = true
       ORDER BY u.full_name`
    );
    return result.rows;
  },

  // Get doctor by ID with full details
  getById: async (id) => {
    const result = await pool.query(
      `SELECT d.*, 
              u.username, u.email, u.full_name, u.phone, u.is_active as user_active,
              s.name_tr as specialization_name, s.name_en as specialization_name_en, s.code as specialization_code
       FROM doctors d
       JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       WHERE d.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get doctor's branches
  getBranches: async (doctorId) => {
    const result = await pool.query(
      `SELECT db.*, b.branch_code, b.branch_name, b.city
       FROM doctor_branches db
       JOIN branches b ON db.branch_id = b.id
       WHERE db.doctor_id = $1 AND db.is_active = true
       ORDER BY db.is_primary DESC, b.branch_name`,
      [doctorId]
    );
    return result.rows;
  },

  // Assign doctor to branch
  assignToBranch: async (assignmentData) => {
    const {
      doctor_id,
      branch_id,
      is_primary = false,
      working_days,
      working_hours_start,
      working_hours_end,
    } = assignmentData;

    const result = await pool.query(
      `INSERT INTO doctor_branches (
        doctor_id, branch_id, is_primary, working_days,
        working_hours_start, working_hours_end
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (doctor_id, branch_id) 
      DO UPDATE SET
        is_primary = EXCLUDED.is_primary,
        working_days = EXCLUDED.working_days,
        working_hours_start = EXCLUDED.working_hours_start,
        working_hours_end = EXCLUDED.working_hours_end,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        doctor_id,
        branch_id,
        is_primary,
        working_days,
        working_hours_start,
        working_hours_end,
      ]
    );

    return result.rows[0];
  },

  // Remove doctor from branch
  removeFromBranch: async (doctorId, branchId) => {
    const result = await pool.query(
      `UPDATE doctor_branches 
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE doctor_id = $1 AND branch_id = $2
       RETURNING *`,
      [doctorId, branchId]
    );
    return result.rows[0];
  },

  // Get doctors by branch
  getByBranch: async (branchId) => {
    const result = await pool.query(
      `SELECT d.*, 
              u.full_name, u.email,
              s.name_tr as specialization_name,
              db.working_days, db.working_hours_start, db.working_hours_end, db.is_primary
       FROM doctors d
       JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       JOIN doctor_branches db ON d.id = db.doctor_id
       WHERE db.branch_id = $1 AND db.is_active = true AND u.is_active = true
       ORDER BY db.is_primary DESC, u.full_name`,
      [branchId]
    );
    return result.rows;
  },

  // Update doctor
  update: async (id, doctorData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(doctorData).forEach((key) => {
      if (doctorData[key] !== undefined && key !== "id") {
        fields.push(`${key} = $${paramCount}`);
        values.push(doctorData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE doctors SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Toggle availability
  setAvailability: async (id, isAvailable) => {
    const result = await pool.query(
      `UPDATE doctors SET is_available = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [isAvailable, id]
    );
    return result.rows[0];
  },

  // Generate next doctor number
  generateDoctorNumber: async () => {
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
  },
};

module.exports = Doctor;
