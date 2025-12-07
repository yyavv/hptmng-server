-- Seed data for appointments table
-- Note: Patient IDs and Doctor IDs must exist in database

INSERT INTO appointments (
    appointment_number, 
    patient_id, 
    doctor_id, 
    appointment_date, 
    appointment_time, 
    duration_minutes,
    appointment_type,
    status,
    reason,
    notes,
    created_by
) VALUES
-- Completed appointments (past dates)
('APT-00001', 1, 2, '2024-11-15', '09:00', 30, 'Kontrol', 'completed', 'Rutin diş kontrolü', 'Tel takma işlemi yapıldı', 6),
('APT-00002', 2, 3, '2024-11-16', '10:30', 45, 'Tedavi', 'completed', 'Diş ağrısı', 'Kanal tedavisi başlatıldı', 6),
('APT-00003', 3, 4, '2024-11-18', '14:00', 30, 'Kontrol', 'completed', 'Diş eti kontrolü', 'Temizlik yapıldı', 7),
('APT-00004', 4, 5, '2024-11-20', '11:00', 60, 'Tedavi', 'completed', 'Protez ölçüsü', 'İlk ölçü alındı', 7),
('APT-00005', 5, 2, '2024-11-22', '15:30', 30, 'Kontrol', 'completed', 'Tel kontrolü', 'Tel ayarı yapıldı', 8),

-- Scheduled appointments (future dates)
('APT-00006', 6, 3, '2024-12-05', '09:00', 45, 'Tedavi', 'scheduled', 'Kanal tedavisi devam', 'İkinci seans', 6),
('APT-00007', 7, 4, '2024-12-05', '10:00', 30, 'Kontrol', 'scheduled', '6 aylık kontrol', NULL, 6),
('APT-00008', 8, 5, '2024-12-06', '14:00', 60, 'Tedavi', 'scheduled', 'Protez takılacak', NULL, 7),
('APT-00009', 9, 2, '2024-12-06', '15:00', 30, 'Kontrol', 'scheduled', 'Tel başlangıç konsültasyonu', NULL, 7),
('APT-00010', 10, 3, '2024-12-07', '11:00', 30, 'Kontrol', 'scheduled', 'Rutin kontrol', NULL, 8),

-- Confirmed appointments
('APT-00011', 11, 4, '2024-12-08', '09:30', 30, 'Kontrol', 'confirmed', 'Diş eti tedavisi kontrol', NULL, 6),
('APT-00012', 12, 5, '2024-12-08', '14:00', 45, 'Tedavi', 'confirmed', 'İmplant değerlendirme', NULL, 7),
('APT-00013', 13, 2, '2024-12-09', '10:00', 30, 'Kontrol', 'confirmed', 'Ortodonti başlangıç', NULL, 8),

-- Cancelled appointment
('APT-00014', 14, 3, '2024-12-04', '16:00', 30, 'Kontrol', 'cancelled', 'Rutin kontrol', 'Hasta iptal etti', 6),

-- No-show appointment
('APT-00015', 15, 4, '2024-11-25', '13:00', 30, 'Kontrol', 'no-show', 'Kontrol randevusu', 'Hasta gelmedi', 7)

ON CONFLICT (appointment_number) DO NOTHING;
