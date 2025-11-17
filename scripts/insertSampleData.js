// Insert sample data for testing
import pool from "../config/database.js";

async function insertSampleData() {
  try {
    console.log("🌱 Inserting sample data...\n");

    // 1. Create sample branches
    console.log("🏢 Creating sample branches...");
    const branch1 = await pool.query(
      `INSERT INTO branches (branch_code, branch_name, branch_type, city, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (branch_code) DO NOTHING
       RETURNING *`,
      [
        "HQ",
        "Merkez Klinik",
        "headquarters",
        "Istanbul",
        "0212 555 0001",
        "merkez@klinik.com",
        "Levent Mahallesi, İstanbul",
      ]
    );

    const branch2 = await pool.query(
      `INSERT INTO branches (branch_code, branch_name, branch_type, city, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (branch_code) DO NOTHING
       RETURNING *`,
      [
        "BR001",
        "Kadıköy Şubesi",
        "branch",
        "Istanbul",
        "0216 555 0002",
        "kadikoy@klinik.com",
        "Moda Caddesi, Kadıköy, İstanbul",
      ]
    );

    console.log("  ✓ HQ - Merkez Klinik");
    console.log("  ✓ BR001 - Kadıköy Şubesi\n");

    // 2. Create sample patient
    console.log("👤 Creating sample patient...");
    const patient = await pool.query(
      `INSERT INTO patients (
        patient_number, first_name, last_name, tc_no, birth_date, gender,
        phone, email, address, city, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (tc_no) DO NOTHING
      RETURNING *`,
      [
        "HKD-2025-00001",
        "Ahmet",
        "Yılmaz",
        "12345678901",
        "1990-05-15",
        "male",
        "0532 111 2233",
        "ahmet.yilmaz@email.com",
        "Bağdat Caddesi No:123",
        "Istanbul",
        1, // admin user
      ]
    );

    if (patient.rows.length > 0) {
      console.log("  ✓ Ahmet Yılmaz (HKD-2025-00001)\n");
    } else {
      console.log("  ℹ️  Patient already exists\n");
    }

    console.log("✅ Sample data inserted successfully!");
    console.log("\n📝 Summary:");
    console.log("  - 2 branches created (HQ, BR001)");
    console.log("  - 1 patient created");
    console.log("  - 8 specializations already available");
    console.log("\n💡 Next steps:");
    console.log("  1. Create doctor users via Settings page");
    console.log("  2. Assign doctors to specializations");
    console.log("  3. Assign doctors to branches");
    console.log("  4. Start booking appointments!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting sample data:", error.message);
    process.exit(1);
  }
}

insertSampleData();
