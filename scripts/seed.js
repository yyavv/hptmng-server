import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
  const client = await pool.connect();

  try {
    console.log("Seeding database...\n");

    // Seed files in order
    const seedFiles = [
      "001_seed_users.sql",
      "002_seed_specializations.sql",
      "003_seed_doctors.sql",
      "004_seed_staff.sql",
      "005_seed_patients.sql",
      "006_seed_appointments.sql",
    ];

    const seedsPath = path.join(__dirname, "..", "seeds");

    await client.query("BEGIN");

    for (const file of seedFiles) {
      const filePath = path.join(seedsPath, file);

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

    console.log("\nAll seeds completed successfully!");
    console.log("\nSeeded data:");
    console.log("  - 8 users (1 admin, 4 doctors, 3 receptionists)");
    console.log("  - 7 specializations");
    console.log("  - 4 doctor records");
    console.log("  - 3 staff records");
    console.log("  - 15 patient records");
    console.log("  - 15 appointment records");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\nSeeding error:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds()
  .then(() => {
    console.log("\nData seeded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nError:", error);
    process.exit(1);
  });
