// Doctor routes
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all doctors
router.get("/", async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, 
              u.username, u.email, u.full_name, u.is_active as user_active,
              s.name_tr as specialization_name, s.name_en as specialization_name_en, 
              s.code as specialization_code
       FROM doctors d
       JOIN users u ON d.id = u.id
       LEFT JOIN specializations s ON d.specialization_id = s.id
       WHERE d.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

// Get doctor's branches
router.get("/:id/branches", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT db.*, b.branch_code, b.branch_name, b.city
       FROM doctor_branches db
       JOIN branches b ON db.branch_id = b.id
       WHERE db.doctor_id = $1 AND db.is_active = true
       ORDER BY db.is_primary DESC, b.branch_name`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching doctor branches:", error);
    res.status(500).json({ error: "Failed to fetch doctor branches" });
  }
});

// Get doctors by branch
router.get("/branch/:branchId", async (req, res) => {
  try {
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
      [req.params.branchId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching doctors by branch:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Create doctor (user must exist first)
router.post("/", async (req, res) => {
  try {
    const {
      id, // user_id
      specialization_id,
      license_number,
      consultation_fee,
      qualification,
      experience_years,
      bio,
    } = req.body;

    // Generate doctor number
    const numberResult = await pool.query(
      `SELECT doctor_number FROM doctors ORDER BY id DESC LIMIT 1`
    );

    let doctor_number = "DR-001";
    if (numberResult.rows.length > 0) {
      const lastNumber = numberResult.rows[0].doctor_number;
      const numPart = parseInt(lastNumber.split("-")[1]) + 1;
      doctor_number = `DR-${String(numPart).padStart(3, "0")}`;
    }

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

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

// Assign doctor to branch
router.post("/:id/branches", async (req, res) => {
  try {
    const {
      branch_id,
      is_primary,
      working_days,
      working_hours_start,
      working_hours_end,
    } = req.body;

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
        req.params.id,
        branch_id,
        is_primary,
        working_days,
        working_hours_start,
        working_hours_end,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error assigning doctor to branch:", error);
    res.status(500).json({ error: "Failed to assign doctor to branch" });
  }
});

// Update doctor
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
      `UPDATE doctors SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

export default router;
