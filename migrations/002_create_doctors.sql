CREATE TABLE IF NOT EXISTS doctors
(
    id INT PRIMARY KEY,
    
    doctor_number VARCHAR(20) NOT NULL UNIQUE,
    specialization_id integer,

    hire_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialization_id) REFERENCES specializations(id)
);

-- Indexes for performance
CREATE INDEX idx_doctor_number ON doctors(doctor_number);
