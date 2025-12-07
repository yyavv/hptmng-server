-- Seed data for staff table
-- Note: These IDs must match the user IDs for receptionists from 001_seed_users.sql
-- Assuming: recep1=6, recep2=7, recep3=8 (after admin and doctors)

INSERT INTO staff (id, staff_number, hire_date) VALUES
(6, 'STF-001', '2019-01-10'),  -- Elif Şahin
(7, 'STF-002', '2020-05-15'),  -- Fatma Çelik
(8, 'STF-003', '2021-08-20')   -- Emre Öztürk
ON CONFLICT (id) DO NOTHING;
