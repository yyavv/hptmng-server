import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";
import { createPatientsTable } from "./models/Patient.js";
import { createUsersTable } from "./models/User.js";

// Import route handlers
import authRouter from "./routes/auth.js";
import patientsRouter from "./routes/patients.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Parse incoming JSON request bodies
// Allows us to access req.body in routes
app.use(express.json());

// Parse URL-encoded data (form submissions)
// extended: true allows rich objects and arrays
app.use(express.urlencoded({ extended: true }));

// CORS (Cross-Origin Resource Sharing) configuration
// Allows frontend applications to access this API from different domains
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allowed HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
  next();
});

// ============================================
// ROUTES
// ============================================

// Root endpoint - API information
app.get("/", (req, res) => {
  res.json({
    message: "Hospital Management System API",
    version: "1.0.0",
    endpoints: {
      patients: "/api/patients",
      testDb: "/api/test-db",
    },
  });
});

// Database connection test endpoint
// Use this to verify database connectivity
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connection successful",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Authentication routes (login, register)
app.use("/api/auth", authRouter);

// Patient management routes
// All patient-related endpoints are handled by patientsRouter
app.use("/api/patients", patientsRouter);

// 404 handler - catches all undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// ============================================
// SERVER INITIALIZATION
// ============================================

// Initialize database tables and start the server
const startServer = async () => {
  try {
    // Create database tables if they don't exist
    await createUsersTable();
    await createPatientsTable();
    console.log("📊 Database tables ready");

    // Start Express server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📍 http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1); // Exit with error code
  }
};

// Start the application
startServer();
