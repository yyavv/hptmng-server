CREATE TABLE IF NOT EXISTS staff
(
    id INT PRIMARY KEY,
    
    staff_number VARCHAR(20) NOT NULL UNIQUE,
    
    hire_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEX'LER (Performans İçin)
-- ============================================================================

-- Personel numarası (STF-001, STF-002 formatında - resmi evraklar için)

-- staff_number index'i:
-- Neden: Personel numarasına göre arama çok sık yapılır
-- Örnek: Login ekranında "STF-001" ile giriş, raporlarda filtreleme
-- Performans: O(log n) yerine O(1) arama
CREATE INDEX idx_staff_number ON staff(staff_number);

-- position index'i:
-- Neden: Pozisyona göre filtreleme sık yapılır
-- Örnek: "Tüm resepsiyonistleri listele", "Hemşirelerin vardiya listesi"
-- Kullanım: WHERE position = 'receptionist' sorgularını hızlandırır
-- CREATE INDEX idx_staff_position ON staff(position);