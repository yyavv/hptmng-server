// Insert dental specializations into the database
import pool from "../config/database.js";

const specializations = [
  {
    code: "GENERAL",
    name_en: "General Dentistry",
    name_tr: "Genel Diş Hekimliği",
    description: "General dental care, cleanings, fillings, extractions",
  },
  {
    code: "ENDO",
    name_en: "Endodontics",
    name_tr: "Endodonti",
    description: "Root canal treatments, dental pulp therapy",
  },
  {
    code: "PEDO",
    name_en: "Pediatric Dentistry",
    name_tr: "Pedodonti (Çocuk Diş Hekimliği)",
    description: "Dental care for children and adolescents",
  },
  {
    code: "ORTHO",
    name_en: "Orthodontics",
    name_tr: "Ortodonti",
    description: "Braces, aligners, bite correction",
  },
  {
    code: "PERIO",
    name_en: "Periodontics",
    name_tr: "Periodontoloji",
    description: "Gum diseases, dental implants",
  },
  {
    code: "PROSTHO",
    name_en: "Prosthodontics",
    name_tr: "Protetik Diş Tedavisi",
    description: "Crowns, bridges, dentures, dental implants",
  },
  {
    code: "ORALMAX",
    name_en: "Oral & Maxillofacial Surgery",
    name_tr: "Ağız, Diş ve Çene Cerrahisi",
    description: "Surgical procedures, wisdom teeth extraction, jaw surgery",
  },
  {
    code: "COSM",
    name_en: "Cosmetic Dentistry",
    name_tr: "Estetik Diş Hekimliği",
    description: "Teeth whitening, veneers, smile design",
  },
];

async function insertSpecializations() {
  try {
    console.log("Inserting dental specializations...");

    // Create specializations table if it doesn't exist
    await pool.query(`
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
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_specializations_active ON specializations(is_active);
    `);

    // Insert specializations
    for (const spec of specializations) {
      await pool.query(
        `INSERT INTO specializations (code, name_en, name_tr, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (code) DO UPDATE
         SET name_en = EXCLUDED.name_en,
             name_tr = EXCLUDED.name_tr,
             description = EXCLUDED.description,
             updated_at = CURRENT_TIMESTAMP`,
        [spec.code, spec.name_en, spec.name_tr, spec.description]
      );
      console.log(`✓ Added: ${spec.code} - ${spec.name_tr}`);
    }

    console.log("\n✅ All specializations inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting specializations:", error.message);
    process.exit(1);
  }
}

insertSpecializations();
