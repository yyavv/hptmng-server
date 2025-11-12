# 🏥 Hospital Management System - Database Schema

## 📊 Database Structure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   HOSPITAL MANAGEMENT SYSTEM                 │
└─────────────────────────────────────────────────────────────┘

🔐 AUTHENTICATION & USERS
├── users (admin, doctor, nurse, receptionist)
└── user_roles

👥 PEOPLE MANAGEMENT
├── patients (hastalar)
├── doctors (doktorlar)
├── staff (personel - nurses, receptionists)

🏢 ORGANIZATIONAL
├── departments (bölümler - Kardiyoloji, Diş, vb.)
├── rooms (odalar/muayene odaları)

📅 APPOINTMENT SYSTEM
├── appointments (randevular)
├── appointment_status (randevu durumları)

🏥 MEDICAL RECORDS
├── medical_records (tıbbi kayıtlar)
├── prescriptions (reçeteler)
├── prescription_items (reçete detayları)
├── diagnoses (tanılar)
├── lab_tests (laboratuvar testleri)

💰 BILLING & PAYMENTS
├── invoices (faturalar)
├── invoice_items (fatura kalemleri)
├── payments (ödemeler)
├── payment_methods (ödeme yöntemleri)
├── services (hizmetler ve fiyatları)

📊 DENTAL SPECIFIC (İsteğe bağlı)
├── dental_charts (diş haritaları)
├── teeth_status (diş durumları)

📋 INVENTORY (İsteğe bağlı - gelecek için)
├── medicines (ilaçlar)
├── medical_equipment (tıbbi ekipman)
```

---

## 🗂️ Detailed Table Schemas

### 1️⃣ AUTHENTICATION & USER MANAGEMENT

```sql
-- Users Table (Already exists - updated version)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- admin, doctor, nurse, receptionist, user
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- User Roles Reference (for documentation)
-- Roles:
--   - admin: Full system access
--   - doctor: Medical access, patient records, prescriptions
--   - nurse: Patient care, basic records
--   - receptionist: Appointments, billing, patient registration
--   - user: Limited access (for external users if needed)
```

---

### 2️⃣ PEOPLE MANAGEMENT

```sql
-- Patients Table (Already exists - will be updated)
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_number VARCHAR(20) UNIQUE NOT NULL, -- HKD-2024-00001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11) UNIQUE, -- Turkish ID number
    passport_no VARCHAR(20), -- For foreign patients
    birth_date DATE,
    gender VARCHAR(10), -- male, female, other
    blood_type VARCHAR(5), -- A+, B-, O+, etc.
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Turkey',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    allergies TEXT, -- Known allergies
    chronic_diseases TEXT, -- Chronic conditions
    insurance_company VARCHAR(100),
    insurance_number VARCHAR(50),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table (extends users table)
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    doctor_number VARCHAR(20) UNIQUE NOT NULL, -- DR-001
    specialization VARCHAR(100) NOT NULL, -- Kardiyoloji, Diş Hekimi, etc.
    license_number VARCHAR(50) UNIQUE NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    qualification TEXT, -- Education background
    experience_years INTEGER,
    consultation_fee DECIMAL(10,2),
    phone VARCHAR(20),
    email VARCHAR(100),
    working_days TEXT, -- JSON or CSV: ["Monday", "Tuesday", "Wednesday"]
    working_hours_start TIME,
    working_hours_end TIME,
    bio TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Table (Nurses, Receptionists, etc.)
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    staff_number VARCHAR(20) UNIQUE NOT NULL, -- STF-001
    position VARCHAR(50) NOT NULL, -- Nurse, Receptionist, Lab Technician, etc.
    department_id INTEGER REFERENCES departments(id),
    phone VARCHAR(20),
    email VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3️⃣ ORGANIZATIONAL

```sql
-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Cardiology, Dentistry, Orthopedics, etc.
    name_tr VARCHAR(100), -- Turkish name: Kardiyoloji, Diş, Ortopedi
    description TEXT,
    head_doctor_id INTEGER REFERENCES doctors(id),
    phone VARCHAR(20),
    floor_number INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table (Examination rooms, operation rooms, etc.)
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL, -- 101, 102, OR-1
    room_type VARCHAR(50) NOT NULL, -- examination, operation, ward, icu
    department_id INTEGER REFERENCES departments(id),
    floor_number INTEGER,
    capacity INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT true,
    equipment TEXT, -- JSON list of equipment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4️⃣ APPOINTMENT SYSTEM

```sql
-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    appointment_number VARCHAR(20) UNIQUE NOT NULL, -- APT-2024-00001
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    department_id INTEGER REFERENCES departments(id),
    room_id INTEGER REFERENCES rooms(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type VARCHAR(50), -- checkup, consultation, follow-up, emergency
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no-show
    reason TEXT, -- Chief complaint
    notes TEXT,
    created_by INTEGER REFERENCES users(id), -- Who created the appointment (receptionist)
    cancelled_by INTEGER REFERENCES users(id),
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Prevent double booking
    UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Appointment Status History (Optional - for tracking)
CREATE TABLE appointment_history (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by INTEGER REFERENCES users(id),
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5️⃣ MEDICAL RECORDS

```sql
-- Medical Records (Visit records)
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    record_number VARCHAR(20) UNIQUE NOT NULL, -- MR-2024-00001
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    appointment_id INTEGER REFERENCES appointments(id),
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chief_complaint TEXT, -- Ana şikayet
    symptoms TEXT, -- Symptoms described
    diagnosis TEXT, -- Tanı
    treatment_plan TEXT, -- Tedavi planı
    vital_signs JSONB, -- {"blood_pressure": "120/80", "temperature": "36.5", "pulse": "72"}
    examination_notes TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diagnoses (ICD-10 codes)
CREATE TABLE diagnoses (
    id SERIAL PRIMARY KEY,
    medical_record_id INTEGER REFERENCES medical_records(id) ON DELETE CASCADE,
    icd_code VARCHAR(10), -- ICD-10 code
    diagnosis_name VARCHAR(200) NOT NULL,
    diagnosis_type VARCHAR(20), -- primary, secondary
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    prescription_number VARCHAR(20) UNIQUE NOT NULL, -- RX-2024-00001
    medical_record_id INTEGER REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    doctor_id INTEGER NOT NULL REFERENCES doctors(id),
    prescription_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription Items (Medications in the prescription)
CREATE TABLE prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100), -- 500mg, 10ml, etc.
    frequency VARCHAR(100), -- 3 times a day, every 8 hours
    duration VARCHAR(50), -- 7 days, 2 weeks
    quantity INTEGER, -- Number of boxes/bottles
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Tests
CREATE TABLE lab_tests (
    id SERIAL PRIMARY KEY,
    test_number VARCHAR(20) UNIQUE NOT NULL, -- LAB-2024-00001
    medical_record_id INTEGER REFERENCES medical_records(id),
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(100), -- blood, urine, xray, mri, ct, ultrasound
    test_date DATE DEFAULT CURRENT_DATE,
    result_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
    results TEXT,
    result_file_path VARCHAR(255), -- Path to PDF/image result
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 6️⃣ BILLING & PAYMENTS

```sql
-- Services (Treatment/Procedure pricing)
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(20) UNIQUE NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    service_name_tr VARCHAR(200), -- Turkish name
    category VARCHAR(100), -- consultation, surgery, lab, imaging, etc.
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL, -- INV-2024-00001
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
    balance DECIMAL(10,2) DEFAULT 0, -- Remaining amount
    status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid, cancelled
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items (Line items in invoice)
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    description VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_number VARCHAR(20) UNIQUE NOT NULL, -- PAY-2024-00001
    invoice_id INTEGER REFERENCES invoices(id),
    patient_id INTEGER REFERENCES patients(id),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- cash, credit_card, debit_card, insurance, bank_transfer
    transaction_reference VARCHAR(100), -- Bank transaction ID, credit card approval code
    notes TEXT,
    received_by INTEGER REFERENCES users(id), -- Receptionist who received payment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Plans (Installment plans)
CREATE TABLE payment_plans (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id),
    patient_id INTEGER REFERENCES patients(id),
    total_amount DECIMAL(10,2) NOT NULL,
    installment_count INTEGER NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Plan Installments
CREATE TABLE payment_plan_installments (
    id SERIAL PRIMARY KEY,
    payment_plan_id INTEGER REFERENCES payment_plans(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7️⃣ DENTAL SPECIFIC (Optional)

```sql
-- Dental Charts
CREATE TABLE dental_charts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teeth Status (32 teeth)
CREATE TABLE teeth_status (
    id SERIAL PRIMARY KEY,
    dental_chart_id INTEGER REFERENCES dental_charts(id) ON DELETE CASCADE,
    tooth_number INTEGER NOT NULL, -- 1-32 (Universal numbering)
    status VARCHAR(50), -- healthy, cavity, filled, crown, missing, implant, etc.
    condition_details TEXT,
    treatment_needed TEXT,
    last_treatment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dental_chart_id, tooth_number)
);
```

---

### 8️⃣ INVENTORY (Future Implementation)

```sql
-- Medicines (Drug inventory)
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    medicine_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    manufacturer VARCHAR(100),
    category VARCHAR(50), -- antibiotic, painkiller, etc.
    dosage_form VARCHAR(50), -- tablet, syrup, injection
    strength VARCHAR(50), -- 500mg, 10ml
    unit_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Equipment
CREATE TABLE medical_equipment (
    id SERIAL PRIMARY KEY,
    equipment_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    warranty_expiry DATE,
    maintenance_schedule VARCHAR(50), -- monthly, quarterly, yearly
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status VARCHAR(20) DEFAULT 'operational', -- operational, maintenance, out_of_service
    location VARCHAR(100), -- Department or room
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Relationships Summary

```
users (1) ──→ (∞) doctors
users (1) ──→ (∞) staff
users (1) ──→ (∞) appointments (created_by)
users (1) ──→ (∞) medical_records (doctor)
users (1) ──→ (∞) invoices (created_by)
users (1) ──→ (∞) payments (received_by)

patients (1) ──→ (∞) appointments
patients (1) ──→ (∞) medical_records
patients (1) ──→ (∞) prescriptions
patients (1) ──→ (∞) invoices
patients (1) ──→ (∞) payments
patients (1) ──→ (1) dental_charts

doctors (1) ──→ (∞) appointments
doctors (1) ──→ (∞) medical_records
doctors (1) ──→ (∞) prescriptions
doctors (1) ──→ (∞) lab_tests
doctors (1) ──→ (1) departments (head_doctor)

departments (1) ──→ (∞) doctors
departments (1) ──→ (∞) staff
departments (1) ──→ (∞) rooms
departments (1) ──→ (∞) appointments

appointments (1) ──→ (1) medical_records
appointments (1) ──→ (1) invoices

medical_records (1) ──→ (∞) diagnoses
medical_records (1) ──→ (∞) prescriptions
medical_records (1) ──→ (∞) lab_tests
medical_records (1) ──→ (1) invoices

prescriptions (1) ──→ (∞) prescription_items

invoices (1) ──→ (∞) invoice_items
invoices (1) ──→ (∞) payments
invoices (1) ──→ (1) payment_plans

payment_plans (1) ──→ (∞) payment_plan_installments

dental_charts (1) ──→ (∞) teeth_status
```

---

## 📝 Implementation Priority

### Phase 1 - Core (Already Started)

- [x] users
- [x] patients (update existing)
- [ ] doctors
- [ ] departments
- [ ] appointments

### Phase 2 - Medical

- [ ] medical_records
- [ ] prescriptions
- [ ] prescription_items
- [ ] diagnoses
- [ ] lab_tests

### Phase 3 - Billing

- [ ] services
- [ ] invoices
- [ ] invoice_items
- [ ] payments
- [ ] payment_plans

### Phase 4 - Advanced

- [ ] staff
- [ ] rooms
- [ ] dental_charts
- [ ] teeth_status
- [ ] appointment_history

### Phase 5 - Inventory (Future)

- [ ] medicines
- [ ] medical_equipment

---

## 🎯 Next Steps

1. Review this schema
2. Make any modifications needed
3. Start implementing Phase 1 tables
4. Create migration scripts
5. Update models and controllers
6. Build API endpoints
7. Design frontend UI components
