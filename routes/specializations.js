// Specialization routes
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all specializations
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM specializations 
       WHERE is_active = true 
       ORDER BY name_tr`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ error: "Failed to fetch specializations" });
  }
});

// Get specialization by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM specializations WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Specialization not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching specialization:", error);
    res.status(500).json({ error: "Failed to fetch specialization" });
  }
});

export default router;
