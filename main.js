import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";

// Import route handlers
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import patientsRouter from "./routes/patients.js";
import branchesRouter from "./routes/branches.js";
import doctorsRouter from "./routes/doctors.js";
import specializationsRouter from "./routes/specializations.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { sanitizeInput } from "./middleware/validation.js";

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

// Sanitize all user input
app.use(sanitizeInput);

// CORS (Cross-Origin Resource Sharing) configuration
// Allows frontend applications to access this API from different domains
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Allowed HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers - ADDED Authorization for JWT

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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
      auth: "/api/auth",
      users: "/api/users",
      patients: "/api/patients",
      branches: "/api/branches",
      doctors: "/api/doctors",
      specializations: "/api/specializations",
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

// User management routes
app.use("/api/users", usersRouter);

// Patient management routes
app.use("/api/patients", patientsRouter);

// Branch management routes
app.use("/api/branches", branchesRouter);

// Doctor management routes
app.use("/api/doctors", doctorsRouter);

// Specialization routes
app.use("/api/specializations", specializationsRouter);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - catches all undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// SERVER INITIALIZATION
// ============================================

// Start the server
const startServer = async () => {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("Database connection verified");

    // Start Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1); // Exit with error code
  }
};

// Start the application
startServer();
