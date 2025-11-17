// Branch routes
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all branches
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, 
              u.full_name as chief_doctor_name,
              s.name_tr as chief_doctor_specialization
       FROM branches b
       LEFT JOIN doctors d ON b.chief_doctor_id = d.id
       LEFT JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       WHERE b.is_active = true
       ORDER BY b.branch_type DESC, b.branch_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

// Get branch by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*,
              u.full_name as chief_doctor_name
       FROM branches b
       LEFT JOIN doctors d ON b.chief_doctor_id = d.id
       LEFT JOIN users u ON d.id = u.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ error: "Failed to fetch branch" });
  }
});

// Create new branch
router.post("/", async (req, res) => {
  try {
    const {
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
    } = req.body;

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

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ error: "Failed to create branch" });
  }
});

// Update branch
router.put("/:id", async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && key !== "id") {
        fields.push(`${key} = $${paramCount}`);
        values.push(req.body[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE branches SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).json({ error: "Failed to update branch" });
  }
});

// Delete branch (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE branches SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ error: "Failed to delete branch" });
  }
});

export default router;
