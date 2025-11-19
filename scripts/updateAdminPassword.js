import pool from "../config/database.js";
import bcrypt from "bcryptjs";

const updateAdminPassword = async () => {
  try {
    console.log("🔄 Updating admin user password with bcrypt hash...");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Update admin user
    const result = await pool.query(
      `UPDATE users 
       SET password = $1
       WHERE username = 'admin' 
       RETURNING id, username, full_name, role`,
      [hashedPassword]
    );

    if (result.rows.length === 0) {
      console.log("⚠️  Admin user not found. Creating new admin user...");

      // Create admin user if doesn't exist
      const createResult = await pool.query(
        `INSERT INTO users (username, password, full_name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, full_name, role`,
        ["admin", hashedPassword, "System Administrator", "admin"]
      );

      console.log("✅ Admin user created:", createResult.rows[0]);
    } else {
      console.log("✅ Admin password updated successfully:", result.rows[0]);
    }

    console.log("\n📝 Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password in production!");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating admin password:", error);
    process.exit(1);
  }
};

updateAdminPassword();
