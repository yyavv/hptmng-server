import pool from "../config/database.js";

const createSamplePatients = async () => {
  try {
    console.log("🔄 Creating 25 sample patients with various scenarios...\n");

    const patients = [
      // Genel kontrol hastaları
      {
        first_name: "Mehmet",
        last_name: "Yılmaz",
        tc_no: "12345678901",
        birth_date: "1985-03-15",
        gender: "MALE",
        phone: "532 111 11 11",
        address: "Kadıköy",
        city: "İstanbul",
        blood_type: "A+",
      },
      {
        first_name: "Ayşe",
        last_name: "Kaya",
        tc_no: "23456789012",
        birth_date: "1990-07-22",
        gender: "FEMALE",
        phone: "532 222 22 22",
        address: "Beşiktaş",
        city: "İstanbul",
        blood_type: "O+",
      },
      {
        first_name: "Ahmet",
        last_name: "Demir",
        tc_no: "34567890123",
        birth_date: "1978-11-30",
        gender: "MALE",
        phone: "532 333 33 33",
        address: "Üsküdar",
        city: "İstanbul",
        blood_type: "B+",
      },

      // Yaşlı hastalar
      {
        first_name: "Fatma",
        last_name: "Öztürk",
        tc_no: "45678901234",
        birth_date: "1950-05-10",
        gender: "FEMALE",
        phone: "532 444 44 44",
        address: "Şişli",
        city: "İstanbul",
        blood_type: "AB+",
        chronic_diseases: "Hipertansiyon, Diyabet",
      },
      {
        first_name: "Hasan",
        last_name: "Çelik",
        tc_no: "56789012345",
        birth_date: "1948-08-20",
        gender: "MALE",
        phone: "532 555 55 55",
        address: "Bakırköy",
        city: "İstanbul",
        blood_type: "A+",
        chronic_diseases: "Kalp hastalığı",
      },

      // Çocuk hastalar
      {
        first_name: "Zeynep",
        last_name: "Arslan",
        tc_no: "67890123456",
        birth_date: "2015-02-14",
        gender: "FEMALE",
        phone: "532 666 66 66",
        address: "Maltepe",
        city: "İstanbul",
        blood_type: "O+",
        emergency_contact_name: "Elif Arslan",
        emergency_contact_phone: "532 666 66 67",
        emergency_contact_relation: "Anne",
      },
      {
        first_name: "Ali",
        last_name: "Yıldız",
        tc_no: "78901234567",
        birth_date: "2018-09-05",
        gender: "MALE",
        phone: "532 777 77 77",
        address: "Kartal",
        city: "İstanbul",
        blood_type: "B+",
        emergency_contact_name: "Mustafa Yıldız",
        emergency_contact_phone: "532 777 77 78",
        emergency_contact_relation: "Baba",
      },
      {
        first_name: "Elif",
        last_name: "Şahin",
        tc_no: "89012345678",
        birth_date: "2012-12-25",
        gender: "FEMALE",
        phone: "532 888 88 88",
        address: "Pendik",
        city: "İstanbul",
        blood_type: "A+",
        emergency_contact_name: "Ayşe Şahin",
        emergency_contact_phone: "532 888 88 89",
        emergency_contact_relation: "Anne",
      },

      // Alerji ve kronik hastalık olanlar
      {
        first_name: "Can",
        last_name: "Özkan",
        tc_no: "90123456789",
        birth_date: "1995-04-18",
        gender: "MALE",
        phone: "532 999 99 99",
        address: "Ataşehir",
        city: "İstanbul",
        blood_type: "AB+",
        allergies: "Penisilin, Polen",
        chronic_diseases: "Astım",
      },
      {
        first_name: "Selin",
        last_name: "Aydın",
        tc_no: "01234567890",
        birth_date: "1988-06-30",
        gender: "FEMALE",
        phone: "533 111 11 11",
        address: "Çekmeköy",
        city: "İstanbul",
        blood_type: "O+",
        allergies: "Kedi tüyü, Fıstık",
      },

      // Sigorta çeşitliliği
      {
        first_name: "Emre",
        last_name: "Koç",
        tc_no: "12345678902",
        birth_date: "1992-01-15",
        gender: "MALE",
        phone: "533 222 22 22",
        address: "Beykoz",
        city: "İstanbul",
        blood_type: "A+",
        insurance_company: "SGK",
        insurance_number: "SGK123456",
      },
      {
        first_name: "Deniz",
        last_name: "Polat",
        tc_no: "23456789013",
        birth_date: "1987-10-08",
        gender: "FEMALE",
        phone: "533 333 33 33",
        address: "Sarıyer",
        city: "İstanbul",
        blood_type: "B+",
        insurance_company: "AXA Sigorta",
        insurance_number: "AXA789012",
      },
      {
        first_name: "Burak",
        last_name: "Erdoğan",
        tc_no: "34567890124",
        birth_date: "1993-03-22",
        gender: "MALE",
        phone: "533 444 44 44",
        address: "Eyüp",
        city: "İstanbul",
        blood_type: "O+",
        insurance_company: "SGK",
      },

      // Acil durum hastalar
      {
        first_name: "Merve",
        last_name: "Güneş",
        tc_no: "45678901235",
        birth_date: "1991-08-12",
        gender: "FEMALE",
        phone: "533 555 55 55",
        address: "Bayrampaşa",
        city: "İstanbul",
        blood_type: "AB+",
        emergency_contact_name: "Ahmet Güneş",
        emergency_contact_phone: "533 555 55 56",
        emergency_contact_relation: "Eş",
      },
      {
        first_name: "Cem",
        last_name: "Yalçın",
        tc_no: "56789012346",
        birth_date: "1989-11-28",
        gender: "MALE",
        phone: "533 666 66 66",
        address: "Esenler",
        city: "İstanbul",
        blood_type: "A+",
        emergency_contact_name: "Fatma Yalçın",
        emergency_contact_phone: "533 666 66 67",
        emergency_contact_relation: "Anne",
      },

      // Yabancı uyruklu hastalar (pasaport ile)
      {
        first_name: "John",
        last_name: "Smith",
        passport_no: "US123456789",
        birth_date: "1985-05-20",
        gender: "MALE",
        phone: "534 111 11 11",
        address: "Nişantaşı",
        city: "İstanbul",
        blood_type: "O+",
        country: "USA",
      },
      {
        first_name: "Maria",
        last_name: "Garcia",
        passport_no: "ES987654321",
        birth_date: "1990-09-15",
        gender: "FEMALE",
        phone: "534 222 22 22",
        address: "Taksim",
        city: "İstanbul",
        blood_type: "A+",
        country: "Spain",
      },

      // Çeşitli yaş grupları
      {
        first_name: "Yusuf",
        last_name: "Kılıç",
        tc_no: "67890123457",
        birth_date: "2000-01-01",
        gender: "MALE",
        phone: "534 333 33 33",
        address: "Ümraniye",
        city: "İstanbul",
        blood_type: "B+",
      },
      {
        first_name: "Ebru",
        last_name: "Uzun",
        tc_no: "78901234568",
        birth_date: "1975-07-07",
        gender: "FEMALE",
        phone: "534 444 44 44",
        address: "Kağıthane",
        city: "İstanbul",
        blood_type: "O+",
        chronic_diseases: "Migren",
      },
      {
        first_name: "Kerem",
        last_name: "Doğan",
        tc_no: "89012345679",
        birth_date: "1998-12-30",
        gender: "MALE",
        phone: "534 555 55 55",
        address: "Şişli",
        city: "İstanbul",
        blood_type: "AB+",
      },

      // Kompleks vakalar
      {
        first_name: "Hacer",
        last_name: "Aslan",
        tc_no: "90123456780",
        birth_date: "1982-04-05",
        gender: "FEMALE",
        phone: "534 666 66 66",
        address: "Gaziosmanpaşa",
        city: "İstanbul",
        blood_type: "A+",
        allergies: "Anestezi ilaçları",
        chronic_diseases: "Romatizma",
        notes: "Diş tedavilerinde özel anestezi gerekir",
      },
      {
        first_name: "Okan",
        last_name: "Kurt",
        tc_no: "01234567891",
        birth_date: "1970-06-18",
        gender: "MALE",
        phone: "534 777 77 77",
        address: "Sultangazi",
        city: "İstanbul",
        blood_type: "B+",
        chronic_diseases: "Diyabet, Böbrek yetmezliği",
        notes: "Antibiyotik dozajı ayarlanmalı",
      },

      // Genç yetişkinler
      {
        first_name: "Tuğçe",
        last_name: "Avcı",
        tc_no: "12345678903",
        birth_date: "2002-02-28",
        gender: "FEMALE",
        phone: "534 888 88 88",
        address: "Esenyurt",
        city: "İstanbul",
        blood_type: "O+",
      },
      {
        first_name: "Berk",
        last_name: "Çakır",
        tc_no: "23456789014",
        birth_date: "2001-11-11",
        gender: "MALE",
        phone: "534 999 99 99",
        address: "Avcılar",
        city: "İstanbul",
        blood_type: "A+",
      },
      {
        first_name: "İrem",
        last_name: "Toprak",
        tc_no: "34567890125",
        birth_date: "1997-08-08",
        gender: "FEMALE",
        phone: "535 111 11 11",
        address: "Beylikdüzü",
        city: "İstanbul",
        blood_type: "AB+",
        allergies: "Lateks",
      },
    ];

    let successCount = 0;
    let patientNumbers = [];

    for (const patient of patients) {
      try {
        // Generate patient number
        const lastPatient = await pool.query(
          `SELECT patient_number FROM patients ORDER BY id DESC LIMIT 1`
        );

        let patient_number = "HKD-2025-00001";
        if (lastPatient.rows.length > 0) {
          const lastNumber = lastPatient.rows[0].patient_number;
          const numPart = parseInt(lastNumber.split("-")[2]) + 1;
          patient_number = `HKD-2025-${String(numPart).padStart(5, "0")}`;
        }

        // Insert patient
        const result = await pool.query(
          `INSERT INTO patients (
            patient_number, first_name, last_name, tc_no, passport_no,
            birth_date, gender, phone, address, city, country, blood_type,
            allergies, chronic_diseases, insurance_company, insurance_number,
            emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
            notes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
          ) RETURNING patient_number, first_name, last_name`,
          [
            patient_number,
            patient.first_name,
            patient.last_name,
            patient.tc_no || null,
            patient.passport_no || null,
            patient.birth_date,
            patient.gender,
            patient.phone,
            patient.address || null,
            patient.city || null,
            patient.country || "Turkey",
            patient.blood_type || null,
            patient.allergies || null,
            patient.chronic_diseases || null,
            patient.insurance_company || null,
            patient.insurance_number || null,
            patient.emergency_contact_name || null,
            patient.emergency_contact_phone || null,
            patient.emergency_contact_relation || null,
            patient.notes || null,
          ]
        );

        successCount++;
        patientNumbers.push(
          `${result.rows[0].patient_number} - ${result.rows[0].first_name} ${result.rows[0].last_name}`
        );
      } catch (err) {
        console.error(
          `❌ Error creating patient ${patient.first_name} ${patient.last_name}:`,
          err.message
        );
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log(`✅ Successfully created ${successCount} patients!`);
    console.log("=".repeat(80));

    console.log("\n📋 CREATED PATIENTS:\n");
    patientNumbers.forEach((patient, index) => {
      console.log(`${String(index + 1).padStart(2)}. ${patient}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("📊 PATIENT DISTRIBUTION:");
    console.log("=".repeat(80));
    console.log("👶 Çocuk (0-18 yaş): 3 hasta");
    console.log("👨 Genç Yetişkin (19-35 yaş): 7 hasta");
    console.log("👩 Orta Yaş (36-60 yaş): 10 hasta");
    console.log("👴 Yaşlı (60+ yaş): 5 hasta");
    console.log("\n🌍 Yabancı Uyruklu: 2 hasta");
    console.log("🏥 Kronik Hastalık: 7 hasta");
    console.log("⚠️  Alerji: 4 hasta");
    console.log("🛡️  Sigortalı: 3 hasta");
    console.log("📞 Acil İrtibat: 5 hasta");
    console.log("=".repeat(80) + "\n");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating sample patients:", error);
    process.exit(1);
  }
};

createSamplePatients();
