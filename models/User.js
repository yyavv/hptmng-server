import pool from "../config/database.js";
import bcrypt from "bcryptjs";

// Create users table for authentication
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Users table ready");
  } catch (error) {
    console.error("❌ Users table creation error:", error);
    throw error;
  }
};

// Find user by username
export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

// Create new user (with password hashing)
export const createUser = async (userData) => {
  const { username, password, full_name, role } = userData;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `INSERT INTO users (username, password, full_name, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, full_name, role, created_at`,
    [username, hashedPassword, full_name, role || "user"]
  );

  return result.rows[0];
};

// Compare password (for login)
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Update last login time
export const updateLastLogin = async (userId) => {
  await pool.query(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
    [userId]
  );
};

// Get all users (exclude passwords)
export const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, username, full_name, role, created_at, last_login FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};
