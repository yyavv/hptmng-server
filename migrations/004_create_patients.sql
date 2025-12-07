CREATE TABLE IF NOT EXISTS patients
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_number VARCHAR(20) NOT NULL UNIQUE,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11) UNIQUE,
    passport_no VARCHAR(20) UNIQUE,
    
    birth_date DATE,
    blood_type VARCHAR(5),
    
    phone VARCHAR(20),
    email VARCHAR(100),
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_by INT REFERENCES users(id),
    updated_by INT REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_number ON patients(patient_number);
CREATE INDEX idx_patient_tc_no ON patients(tc_no);
CREATE INDEX idx_patient_phone ON patients(phone);
CREATE INDEX idx_patient_is_active ON patients(is_active);

/* 
TODO: 
1. Address, city, country
2. Emergency contact name, phone, relation
3. Allergies, chronic diseases
4. Insurance details expansion?
*/