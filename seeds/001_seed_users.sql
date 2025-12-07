-- Seed data for users table
-- Passwords are hashed with bcrypt (password: "password123" for all users)

INSERT INTO users (username, password_hash, first_name, last_name, email, phone_number, role, is_active) VALUES
-- Admin users
('admin', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Admin', 'Kullanıcı', 'admin@hastane.com', '05301234567', 'admin', true),

-- Doctors
('dr.mehmet', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Mehmet', 'Yılmaz', 'mehmet.yilmaz@hastane.com', '05301234568', 'doctor', true),
('dr.ayse', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Ayşe', 'Demir', 'ayse.demir@hastane.com', '05301234569', 'doctor', true),
('dr.ahmet', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Ahmet', 'Kaya', 'ahmet.kaya@hastane.com', '05301234570', 'doctor', true),
('dr.zeynep', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Zeynep', 'Arslan', 'zeynep.arslan@hastane.com', '05301234571', 'doctor', true),

-- Receptionists
('recep1', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Elif', 'Şahin', 'elif.sahin@hastane.com', '05301234572', 'receptionist', true),
('recep2', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Fatma', 'Çelik', 'fatma.celik@hastane.com', '05301234573', 'receptionist', true),
('recep3', '$2b$10$VTUZfC1JkXcId0IKpBcE8OmEhs2q0SF475CKf195MD9XBjEJCXkES', 'Emre', 'Öztürk', 'emre.ozturk@hastane.com', '05301234574', 'receptionist', true)
ON CONFLICT (username) DO NOTHING;
