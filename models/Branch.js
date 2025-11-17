const pool = require("../config/database");

const Branch = {
  // Create a new branch
  create: async (branchData) => {
    const {
      branch_code,
      branch_name,
      branch_type = "branch",
      address,
      city,
      district,
      postal_code,
      phone,
      email,
      manager_name,
      opening_hours,
    } = branchData;

    const result = await pool.query(
      `INSERT INTO branches (
        branch_code, branch_name, branch_type, address, city, district,
        postal_code, phone, email, manager_name, opening_hours
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        branch_code,
        branch_name,
        branch_type,
        address,
        city,
        district,
        postal_code,
        phone,
        email,
        manager_name,
        opening_hours,
      ]
    );

    return result.rows[0];
  },

  // Get all branches
  getAll: async () => {
    const result = await pool.query(
      `SELECT b.*, 
              u.full_name as chief_doctor_name,
              d.specialization_id
       FROM branches b
       LEFT JOIN doctors d ON b.chief_doctor_id = d.id
       LEFT JOIN users u ON d.id = u.id
       WHERE b.is_active = true
       ORDER BY b.branch_type DESC, b.branch_name`
    );
    return result.rows;
  },

  // Get branch by ID
  getById: async (id) => {
    const result = await pool.query(
      `SELECT b.*,
              u.full_name as chief_doctor_name,
              d.specialization_id
       FROM branches b
       LEFT JOIN doctors d ON b.chief_doctor_id = d.id
       LEFT JOIN users u ON d.id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update branch
  update: async (id, branchData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(branchData).forEach((key) => {
      if (branchData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(branchData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE branches SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Set chief doctor for branch
  setChiefDoctor: async (branchId, doctorId) => {
    const result = await pool.query(
      `UPDATE branches SET chief_doctor_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [doctorId, branchId]
    );
    return result.rows[0];
  },

  // Soft delete
  delete: async (id) => {
    const result = await pool.query(
      `UPDATE branches SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};

module.exports = Branch;
