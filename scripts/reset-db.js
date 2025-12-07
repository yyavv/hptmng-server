import pool from "../config/database.js";

async function resetDatabase() {
  const client = await pool.connect();

  try {
    console.log("Resetting database...\n");

    await client.query("BEGIN");

    // Drop all tables (CASCADE will also drop foreign keys)
    console.log("Dropping tables...");
    await client.query(`
      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS patients CASCADE;
      DROP TABLE IF EXISTS staff CASCADE;
      DROP TABLE IF EXISTS doctors CASCADE;
      DROP TABLE IF EXISTS specializations CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TYPE IF EXISTS user_role CASCADE;
      DROP EXTENSION IF EXISTS citext CASCADE;
    `);

    await client.query("COMMIT");

    console.log("Database cleaned!");
    console.log("\nYou can now run migrations:");
    console.log("   node scripts/migrate.js");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\nError:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase()
  .then(() => {
    console.log("\nOperation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nError:", error);
    process.exit(1);
  });
