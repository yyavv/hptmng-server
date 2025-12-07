-- Seed data for specializations table

INSERT INTO specializations (name, description, is_active) VALUES
('Kardiyoloji', 'Kalp ve damar hastalıkları uzmanı', true),
('Nöroloji', 'Sinir sistemi hastalıkları uzmanı', true),
('Ortopedi', 'Kemik ve eklem hastalıkları uzmanı', true),
('Göz Hastalıkları', 'Göz sağlığı ve hastalıkları uzmanı', true),
('Çocuk Sağlığı', 'Çocuk hastalıkları ve gelişimi uzmanı', true),
('Dahiliye', 'İç hastalıkları uzmanı', true),
('Genel Cerrahi', 'Genel cerrahi operasyonlar uzmanı', true)
ON CONFLICT DO NOTHING;
