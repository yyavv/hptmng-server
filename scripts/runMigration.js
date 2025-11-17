// Migration script to create all database tables for Phase 1
import pool from "../config/database.js";

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log("🚀 Starting database migration...\n");

    await client.query("BEGIN");

    // 1. Branches Table
    console.log("📦 Creating branches table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id SERIAL PRIMARY KEY,
        branch_code VARCHAR(20) UNIQUE NOT NULL,
        branch_name VARCHAR(100) NOT NULL,
        branch_type VARCHAR(20) DEFAULT 'branch',
        address TEXT,
        city VARCHAR(50),
        district VARCHAR(50),
        postal_code VARCHAR(10),
        phone VARCHAR(20),
        email VARCHAR(100),
        manager_name VARCHAR(100),
        opening_hours TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active);
      CREATE INDEX IF NOT EXISTS idx_branches_city ON branches(city);
    `);

    // 2. Users Table (already exists, but ensure it's up to date)
    console.log("👤 Ensuring users table is up to date...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
      
      -- Add is_active column if it doesn't exist
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'is_active'
        ) THEN
          ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
      END $$;
      
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
    `);

    // 3. Patients Table
    console.log("🏥 Creating patients table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
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
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Add is_active column if it doesn't exist
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'patients' AND column_name = 'is_active'
        ) THEN
          ALTER TABLE patients ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
      END $$;
      
      CREATE INDEX IF NOT EXISTS idx_patients_tc ON patients(tc_no);
      CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
      CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(is_active);
    `);

    // 4. Specializations Table
    console.log("🦷 Creating specializations table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS specializations (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name_en VARCHAR(100) NOT NULL,
        name_tr VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_specializations_active ON specializations(is_active);
    `);

    // 5. Doctors Table
    console.log("👨‍⚕️ Creating doctors table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        doctor_number VARCHAR(20) UNIQUE NOT NULL,
        specialization_id INTEGER REFERENCES specializations(id),
        license_number VARCHAR(50) UNIQUE NOT NULL,
        consultation_fee DECIMAL(10,2),
        qualification TEXT,
        experience_years INTEGER,
        bio TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization_id);
      CREATE INDEX IF NOT EXISTS idx_doctors_available ON doctors(is_available);
    `);

    // 6. Staff Table
    console.log("👥 Creating staff table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        staff_number VARCHAR(20) UNIQUE NOT NULL,
        position VARCHAR(50) NOT NULL,
        hire_date DATE,
        salary DECIMAL(10,2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_staff_position ON staff(position);
      CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);
    `);

    // 7. Doctor Branches Junction Table
    console.log("🔗 Creating doctor_branches junction table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctor_branches (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT false,
        working_days TEXT,
        working_hours_start TIME,
        working_hours_end TIME,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(doctor_id, branch_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_doctor_branches_doctor ON doctor_branches(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_doctor_branches_branch ON doctor_branches(branch_id);
      CREATE INDEX IF NOT EXISTS idx_doctor_branches_active ON doctor_branches(is_active);
    `);

    // 8. Staff Branches Junction Table
    console.log("🔗 Creating staff_branches junction table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff_branches (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
        branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
        is_primary BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(staff_id, branch_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_staff_branches_staff ON staff_branches(staff_id);
      CREATE INDEX IF NOT EXISTS idx_staff_branches_branch ON staff_branches(branch_id);
    `);

    // 9. Add chief_doctor_id to branches (after doctors table exists)
    console.log("🔄 Adding chief_doctor_id to branches...");
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'branches' AND column_name = 'chief_doctor_id'
        ) THEN
          ALTER TABLE branches ADD COLUMN chief_doctor_id INTEGER REFERENCES doctors(id);
          CREATE INDEX idx_branches_chief_doctor ON branches(chief_doctor_id);
        END IF;
      END $$;
    `);

    // 10. Rooms Table
    console.log("🚪 Creating rooms table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER NOT NULL REFERENCES branches(id),
        room_number VARCHAR(20) NOT NULL,
        room_type VARCHAR(50) NOT NULL,
        floor_number INTEGER,
        capacity INTEGER DEFAULT 1,
        is_available BOOLEAN DEFAULT true,
        equipment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(branch_id, room_number)
      );
      
      CREATE INDEX IF NOT EXISTS idx_rooms_branch ON rooms(branch_id);
      CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(is_available);
    `);

    // 11. Appointments Table
    console.log("📅 Creating appointments table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER NOT NULL REFERENCES branches(id),
        appointment_number VARCHAR(20) UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES doctors(id),
        room_id INTEGER REFERENCES rooms(id),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        duration_minutes INTEGER DEFAULT 30,
        appointment_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'scheduled',
        reason TEXT,
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        cancelled_by INTEGER REFERENCES users(id),
        cancellation_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(doctor_id, branch_id, appointment_date, appointment_time)
      );
      
      CREATE INDEX IF NOT EXISTS idx_appointments_branch ON appointments(branch_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
    `);

    // 12. Medical Records Table
    console.log("📋 Creating medical_records table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER NOT NULL REFERENCES branches(id),
        record_number VARCHAR(20) UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES doctors(id),
        appointment_id INTEGER REFERENCES appointments(id),
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        chief_complaint TEXT,
        symptoms TEXT,
        diagnosis TEXT,
        treatment_plan TEXT,
        vital_signs JSONB,
        examination_notes TEXT,
        follow_up_date DATE,
        follow_up_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_medical_records_branch ON medical_records(branch_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_doctor ON medical_records(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_appointment ON medical_records(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
    `);

    // 13. Services Table
    console.log("💼 Creating services table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        service_code VARCHAR(20) UNIQUE NOT NULL,
        service_name VARCHAR(200) NOT NULL,
        service_name_tr VARCHAR(200),
        category VARCHAR(50),
        description TEXT,
        unit_price DECIMAL(10,2) NOT NULL,
        duration_minutes INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
      CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
    `);

    // 14. Invoices Table
    console.log("💰 Creating invoices table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        branch_id INTEGER NOT NULL REFERENCES branches(id),
        invoice_number VARCHAR(20) UNIQUE NOT NULL,
        patient_id INTEGER NOT NULL REFERENCES patients(id),
        appointment_id INTEGER REFERENCES appointments(id),
        medical_record_id INTEGER REFERENCES medical_records(id),
        invoice_date DATE DEFAULT CURRENT_DATE,
        due_date DATE,
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        discount_percentage DECIMAL(5,2) DEFAULT 0,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        balance DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_invoices_branch ON invoices(branch_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_appointment ON invoices(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_medical_record ON invoices(medical_record_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
    `);

    await client.query("COMMIT");

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📊 Created tables:");
    console.log("  ✓ branches");
    console.log("  ✓ users");
    console.log("  ✓ patients");
    console.log("  ✓ specializations");
    console.log("  ✓ doctors");
    console.log("  ✓ staff");
    console.log("  ✓ doctor_branches");
    console.log("  ✓ staff_branches");
    console.log("  ✓ rooms");
    console.log("  ✓ appointments");
    console.log("  ✓ medical_records");
    console.log("  ✓ services");
    console.log("  ✓ invoices");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log("\n🎉 Database is ready!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration error:", error);
    process.exit(1);
  });
