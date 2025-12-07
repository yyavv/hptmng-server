import pool from "../config/database.js";

export const getAllSpecializations = async () => {
  const result = await pool.query(
    `SELECT * FROM specializations 
     WHERE is_active = true 
     ORDER BY name`
  );
  return result.rows;
};

export const getSpecializationById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM specializations WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createSpecialization = async (data) => {
  const { name, description } = data;
  const result = await pool.query(
    `INSERT INTO specializations (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
  return result.rows[0];
};

export const updateSpecialization = async (id, data) => {
  const { name, description, is_active } = data;
  const result = await pool.query(
    `UPDATE specializations 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         is_active = COALESCE($3, is_active),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [name, description, is_active, id]
  );
  return result.rows[0];
};
