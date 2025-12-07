import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log("Starting database migration...\n");

    // Migration files in order
    const migrationFiles = [
      "001_create_users.sql",
      "005_specialization.sql",
      "002_create_doctors.sql",
      "003_create_recepcionist.sql",
      "004_create_patients.sql",
      "007_appointments.sql",
    ];

    const migrationsPath = path.join(__dirname, "..", "migrations");

    await client.query("BEGIN");

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsPath, file);

      if (!fs.existsSync(filePath)) {
        console.log(`${file} not found, skipping...`);
        continue;
      }

      console.log(`Running ${file}...`);
      const sql = fs.readFileSync(filePath, "utf-8");

      if (sql.trim()) {
        await client.query(sql);
        console.log(`${file} completed successfully`);
      } else {
        console.log(`${file} is empty, skipping...`);
      }
    }

    await client.query("COMMIT");

    console.log("\nAll migrations completed successfully!");
    console.log("\nCreated tables:");
    console.log("  - users");
    console.log("  - specializations");
    console.log("  - doctors");
    console.log("  - staff");
    console.log("  - patients");
    console.log("  - appointments");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\nMigration error:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => {
    console.log("\nDatabase is ready!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nError:", error);
    process.exit(1);
  });
