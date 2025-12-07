import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Find user by username
export const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

// Create new user (with password hashing)
export const createUser = async (userData) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone_number,
    role,
  } = userData;

  const pepper = process.env.PEPPER || "";
  const passwordWithPepper = password + pepper;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordWithPepper, salt);

  const result = await pool.query(
    `INSERT INTO users (username, password_hash, first_name, last_name, email, phone_number, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, username, first_name, last_name, email, phone_number, role, created_at`,
    [
      username,
      hashedPassword,
      first_name,
      last_name,
      email,
      phone_number,
      role || "receptionist",
    ]
  );

  return result.rows[0];
};

// Compare password (for login)
export const comparePassword = async (plainPassword, hashedPassword) => {
  const pepper = process.env.PEPPER || "";
  const passwordWithPepper = plainPassword + pepper;
  return await bcrypt.compare(passwordWithPepper, hashedPassword);
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
    "SELECT id, username, first_name, last_name, email, phone_number, role, is_active, created_at, last_login FROM users ORDER BY created_at DESC"
  );
  return result.rows;
};

// Get user by ID (exclude password)
export const getUserById = async (userId) => {
  const result = await pool.query(
    "SELECT id, username, first_name, last_name, email, phone_number, role, is_active, created_at, last_login FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0];
};

// Update user
export const updateUser = async (userId, userData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Only allow specific fields to be updated
  const allowedFields = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "role",
  ];

  Object.keys(userData).forEach((key) => {
    if (allowedFields.includes(key) && userData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(userData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} 
     RETURNING id, username, first_name, last_name, email, phone_number, role, is_active, created_at`,
    values
  );

  return result.rows[0];
};

// Soft delete user (set is_active to false)
export const softDeleteUser = async (userId) => {
  const result = await pool.query(
    `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 
     RETURNING id, username, first_name, last_name, email, phone_number, role, is_active`,
    [userId]
  );
  return result.rows[0];
};
