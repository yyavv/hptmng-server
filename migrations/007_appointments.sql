CREATE TABLE IF NOT EXISTS appointments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    appointment_number VARCHAR(20) NOT NULL UNIQUE,
    
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    
    appointment_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    
    created_by INT,
    cancelled_by INT,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT appointments_doctor_date_time_unique
        UNIQUE (doctor_id, appointment_date, appointment_time),

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,

    CONSTRAINT fk_appointment_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),

    CONSTRAINT fk_appointment_cancelled_by
        FOREIGN KEY (cancelled_by) REFERENCES users(id)
);

CREATE INDEX idx_appointment_patient ON appointments(patient_id);
CREATE INDEX idx_appointment_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_appointment_status ON appointments(status);
CREATE INDEX idx_appointment_doctor_date ON appointments(doctor_id, appointment_date);    