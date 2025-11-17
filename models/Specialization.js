const pool = require("../config/database");

const Specialization = {
  // Get all specializations
  getAll: async () => {
    const result = await pool.query(
      `SELECT * FROM specializations 
       WHERE is_active = true 
       ORDER BY name_tr`
    );
    return result.rows;
  },

  // Get by ID
  getById: async (id) => {
    const result = await pool.query(
      `SELECT * FROM specializations WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get by code
  getByCode: async (code) => {
    const result = await pool.query(
      `SELECT * FROM specializations WHERE code = $1`,
      [code]
    );
    return result.rows[0];
  },

  // Create specialization
  create: async (data) => {
    const { code, name_en, name_tr, description } = data;
    const result = await pool.query(
      `INSERT INTO specializations (code, name_en, name_tr, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [code, name_en, name_tr, description]
    );
    return result.rows[0];
  },
};

module.exports = Specialization;
