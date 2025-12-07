import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a connection pool to PostgreSQL database
// Pool maintains multiple database connections for better performance
const pool = new Pool({
  host: process.env.DB_HOST, // Database server address (e.g., localhost)
  port: process.env.DB_PORT, // PostgreSQL port (default: 5432)
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name to connect to

  // Maximum number of clients the pool can contain
  // More connections = more simultaneous requests can be handled
  max: 20,

  // How long a client can remain idle before being closed
  // 30000ms = 30 seconds of inactivity before connection closes
  // This frees up resources when connections aren't being used
  idleTimeoutMillis: 30000,

  // Maximum time to wait for a connection before timing out
  // 2000ms = 2 seconds max wait time
  // If database doesn't respond in 2 seconds, throws an error
  connectionTimeoutMillis: 2000,
});

// Event listener: Fires when a new client successfully connects to the database
pool.on("connect", () => {
  console.log("PostgreSQL database connected successfully");
});

// Event listener: Fires when an unexpected database error occurs
// This catches errors like connection loss, network issues, etc.
pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1); // Exit the application with error code
});

// Export the pool to be used throughout the application
export default pool;
