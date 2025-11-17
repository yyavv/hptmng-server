// Fix patients table - add missing columns
import pool from "../config/database.js";

async function fixPatientsTable() {
  try {
    console.log("🔧 Fixing patients table...\n");

    // Drop and recreate patients table
    await pool.query("DROP TABLE IF EXISTS patients CASCADE");
    console.log("✓ Dropped old patients table");

    await pool.query(`
      CREATE TABLE patients (
        id SERIAL PRIMARY KEY,
        patient_number VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        tc_no VARCHAR(11) UNIQUE,
        passport_no VARCHAR(20),
        birth_date DATE,
        gender VARCHAR(10),
        blood_type VARCHAR(5),
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        city VARCHAR(50),
        country VARCHAR(50) DEFAULT 'Turkey',
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(20),
        emergency_contact_relation VARCHAR(50),
        allergies TEXT,
        chronic_diseases TEXT,
        insurance_company VARCHAR(100),
        insurance_number VARCHAR(50),
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_patients_tc ON patients(tc_no);
      CREATE INDEX idx_patients_phone ON patients(phone);
      CREATE INDEX idx_patients_active ON patients(is_active);
    `);

    console.log("✓ Created new patients table with all columns\n");
    console.log("✅ Patients table fixed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixPatientsTable();
