-- Seed data for doctors table
-- Note: These IDs must match the user IDs from 001_seed_users.sql
-- Assuming: admin=1, dr.mehmet=2, dr.ayse=3, dr.ahmet=4, dr.zeynep=5

INSERT INTO doctors (id, doctor_number, specialization_id, hire_date) VALUES
(2, 'DR-001', 1, '2020-01-15'),  -- Dr. Mehmet Yılmaz - Kardiyoloji
(3, 'DR-002', 2, '2019-06-20'),  -- Dr. Ayşe Demir - Nöroloji
(4, 'DR-003', 6, '2021-03-10'),  -- Dr. Ahmet Kaya - Dahiliye
(5, 'DR-004', 4, '2022-09-05')   -- Dr. Zeynep Arslan - Göz Hastalıkları
ON CONFLICT (id) DO NOTHING;
