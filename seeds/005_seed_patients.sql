-- Seed data for patients table

INSERT INTO patients (patient_number, first_name, last_name, tc_no, birth_date, blood_type, phone, email, notes, is_active, created_by) VALUES
('P-00001', 'Ali', 'Yıldız', '12345678901', '1985-03-15', 'A+', '05321234567', 'ali.yildiz@email.com', 'Düzenli kontrol hastası', true, 1),
('P-00002', 'Merve', 'Kara', '12345678902', '1990-07-22', 'O+', '05321234568', 'merve.kara@email.com', NULL, true, 1),
('P-00003', 'Can', 'Yılmaz', '12345678903', '1978-11-30', 'B+', '05321234569', 'can.yilmaz@email.com', 'Diş eti tedavisi devam ediyor', true, 1),
('P-00004', 'Selin', 'Özdemir', '12345678904', '1995-02-14', 'AB+', '05321234570', 'selin.ozdemir@email.com', NULL, true, 1),
('P-00005', 'Burak', 'Aydın', '12345678905', '1982-09-08', 'A-', '05321234571', 'burak.aydin@email.com', 'İmplant tedavisi planlanıyor', true, 1),
('P-00006', 'Deniz', 'Çetin', '12345678906', '1988-05-19', 'O-', '05321234572', 'deniz.cetin@email.com', NULL, true, 6),
('P-00007', 'Ebru', 'Şen', '12345678907', '1992-12-25', 'B-', '05321234573', 'ebru.sen@email.com', 'Kanal tedavisi tamamlandı', true, 6),
('P-00008', 'Kemal', 'Aksoy', '12345678908', '1975-04-03', 'AB-', '05321234574', 'kemal.aksoy@email.com', NULL, true, 6),
('P-00009', 'Gamze', 'Polat', '12345678909', '1998-08-17', 'A+', '05321234575', 'gamze.polat@email.com', 'Ortodonti tedavisine başlandı', true, 7),
('P-00010', 'Murat', 'Koç', '12345678910', '1980-01-28', 'O+', '05321234576', 'murat.koc@email.com', NULL, true, 7),
('P-00011', 'Nazlı', 'Güler', '12345678911', '1987-06-12', 'B+', '05321234577', 'nazli.guler@email.com', 'Protez uygulaması yapıldı', true, 7),
('P-00012', 'Oğuz', 'Demirci', '12345678912', '1993-10-05', 'A-', '05321234578', 'oguz.demirci@email.com', NULL, true, 8),
('P-00013', 'Pınar', 'Yurt', '12345678913', '1991-03-21', 'AB+', '05321234579', 'pinar.yurt@email.com', 'Diş beyazlatma yapıldı', true, 8),
('P-00014', 'Serkan', 'Acar', '12345678914', '1984-07-14', 'O-', '05321234580', 'serkan.acar@email.com', NULL, true, 8),
('P-00015', 'Tuba', 'Erdem', '12345678915', '1996-11-09', 'B-', '05321234581', 'tuba.erdem@email.com', 'Çocuk hastası - düzenli kontrol', true, 1)
ON CONFLICT (patient_number) DO NOTHING;
