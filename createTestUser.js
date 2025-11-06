import pool from "./config/database.js";
import { createUsersTable, createUser } from "./models/User.js";

// Create a test user for development
const createTestUser = async () => {
  try {
    console.log("🔧 Creating test user...");

    // Ensure users table exists
    await createUsersTable();

    // Create test user
    // Username: admin
    // Password: admin123
    const testUser = await createUser({
      username: "admin",
      password: "admin123", // NOTE: In production, this should be hashed!
      full_name: "System Administrator",
      role: "admin",
    });

    console.log("✅ Test user created successfully:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Full Name:", testUser.full_name);
    console.log("   Role:", testUser.role);
    console.log("\n💡 Use these credentials to log in!");

    process.exit(0);
  } catch (error) {
    if (error.code === "23505") {
      // Unique constraint violation - user already exists
      console.log("ℹ️  Test user already exists!");
      console.log("   Username: admin");
      console.log("   Password: admin123");
    } else {
      console.error("❌ Error creating test user:", error.message);
    }
    process.exit(1);
  }
};

createTestUser();
