import pool from "../config/database.js";
import bcrypt from "bcryptjs";

const createSampleUsers = async () => {
  try {
    console.log("🔄 Creating sample users (doctor and staff)...\n");

    const salt = await bcrypt.genSalt(10);

    // 1. Create Doctor User
    const doctorPassword = "doctor123";
    const doctorHashedPassword = await bcrypt.hash(doctorPassword, salt);

    const doctorUser = await pool.query(
      `INSERT INTO users (username, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE 
       SET password = EXCLUDED.password
       RETURNING id, username, full_name, role`,
      ["dr.ahmet", doctorHashedPassword, "Dr. Ahmet Yılmaz", "doctor"]
    );

    console.log("✅ Doctor user created:", doctorUser.rows[0]);

    // 2. Get a specialization (e.g., GENERAL)
    const specialization = await pool.query(
      `SELECT id FROM specializations WHERE code = 'GENERAL' LIMIT 1`
    );

    // 3. Create Doctor record
    const doctor = await pool.query(
      `INSERT INTO doctors (id, doctor_number, specialization_id, license_number, consultation_fee, qualification, experience_years, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE 
       SET license_number = EXCLUDED.license_number
       RETURNING *`,
      [
        doctorUser.rows[0].id,
        "DR-001",
        specialization.rows[0]?.id || 1,
        "DIS-12345",
        500,
        "Üniversite Hastanesi",
        8,
        "Genel diş hekimliği alanında 8 yıllık deneyime sahip.",
      ]
    );

    console.log("✅ Doctor profile created:", doctor.rows[0].doctor_number);

    // 4. Create Receptionist/Staff User
    const staffPassword = "staff123";
    const staffHashedPassword = await bcrypt.hash(staffPassword, salt);

    const staffUser = await pool.query(
      `INSERT INTO users (username, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE 
       SET password = EXCLUDED.password
       RETURNING id, username, full_name, role`,
      ["receptionist1", staffHashedPassword, "Ayşe Demir", "receptionist"]
    );

    console.log("✅ Staff user created:", staffUser.rows[0]);

    // 5. Create Staff record
    const staff = await pool.query(
      `INSERT INTO staff (id, staff_number, position, hire_date, salary)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE 
       SET position = EXCLUDED.position
       RETURNING *`,
      [staffUser.rows[0].id, "STF-001", "Receptionist", new Date(), 15000]
    );

    console.log("✅ Staff profile created:", staff.rows[0].staff_number);

    // 6. Create another staff (Nurse)
    const nursePassword = "nurse123";
    const nurseHashedPassword = await bcrypt.hash(nursePassword, salt);

    const nurseUser = await pool.query(
      `INSERT INTO users (username, password, full_name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE 
       SET password = EXCLUDED.password
       RETURNING id, username, full_name, role`,
      ["nurse1", nurseHashedPassword, "Zeynep Arslan", "nurse"]
    );

    console.log("✅ Nurse user created:", nurseUser.rows[0]);

    const nurse = await pool.query(
      `INSERT INTO staff (id, staff_number, position, hire_date, salary)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE 
       SET position = EXCLUDED.position
       RETURNING *`,
      [nurseUser.rows[0].id, "STF-002", "Nurse", new Date(), 12000]
    );

    console.log("✅ Nurse profile created:", nurse.rows[0].staff_number);

    console.log("\n" + "=".repeat(60));
    console.log("📋 LOGIN CREDENTIALS");
    console.log("=".repeat(60));

    console.log("\n👨‍⚕️ DOCTOR (Doktor):");
    console.log("   Username: dr.ahmet");
    console.log("   Password: doctor123");
    console.log("   Role: doctor");
    console.log("   Name: Dr. Ahmet Yılmaz");

    console.log("\n👩‍💼 RECEPTIONIST (Resepsiyonist):");
    console.log("   Username: receptionist1");
    console.log("   Password: staff123");
    console.log("   Role: receptionist");
    console.log("   Name: Ayşe Demir");

    console.log("\n👩‍⚕️ NURSE (Hemşire):");
    console.log("   Username: nurse1");
    console.log("   Password: nurse123");
    console.log("   Role: nurse");
    console.log("   Name: Zeynep Arslan");

    console.log("\n👨‍💼 ADMIN (Yönetici):");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Role: admin");

    console.log("\n" + "=".repeat(60));
    console.log("⚠️  IMPORTANT: Change these passwords in production!");
    console.log("=".repeat(60) + "\n");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating sample users:", error);
    process.exit(1);
  }
};

createSampleUsers();
