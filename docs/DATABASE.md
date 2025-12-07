# Veritabanı Yapısı

## Tablolar

### 1. users (Kullanıcılar)

Tüm sistem kullanıcılarının temel bilgileri.

**Alanlar:**

- `id` - Otomatik artan benzersiz kimlik
- `username` - Kullanıcı adı (citext - büyük/küçük harf duyarsız)
- `password_hash` - Şifrelenmiş parola (bcrypt + PEPPER)
- `first_name` - Ad
- `last_name` - Soyad
- `email` - E-posta adresi
- `phone_number` - Telefon numarası
- `role` - Kullanıcı rolü (doctor, receptionist, admin)
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı
- `last_login` - Son giriş zamanı
- `is_active` - Aktif/Pasif durumu
- `deleted_at` - Soft delete için

**Özellikler:**

- Role tipi: ENUM ('doctor', 'receptionist', 'admin')
- Şifreler bcrypt ile hashlenip PEPPER ile güçlendirilir
- citext extension kullanılarak username büyük/küçük harf duyarsız

---

### 2. specializations (Uzmanlık Alanları)

Doktorların uzmanlık alanları.

**Alanlar:**

- `id` - Otomatik artan benzersiz kimlik
- `name` - Uzmanlık adı (Ortodonti, Endodonti, vb.) UNIQUE
- `description` - Açıklama
- `is_active` - Aktif/Pasif durumu
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı

**Varsayılan Değerler:**

- Genel Diş Hekimliği
- Ortodonti
- Endodonti
- Periodontoloji
- Protez
- Pedodonti
- Ağız Cerrahisi

---

### 3. doctors (Doktorlar)

Doktor bilgileri (users tablosuyla 1-1 ilişki).

**Alanlar:**

- `id` - Primary Key (users.id ile aynı)
- `doctor_number` - Doktor numarası (DR-001 formatında)
- `specialization_id` - Uzmanlık alanı (Foreign Key)
- `hire_date` - İşe başlama tarihi
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı

**İlişkiler:**

- `id` → `users(id)` ON DELETE CASCADE
- `specialization_id` → `specializations(id)`

**İndeksler:**

- `idx_doctor_number` - Doktor numarasına göre arama

**Tasarım Notu:**
Doktorlar için ayrı ID yerine users.id kullanılır (one-to-one inheritance pattern).

---

### 4. staff (Personel)

Resepsiyonist ve diğer personel bilgileri (users tablosuyla 1-1 ilişki).

**Alanlar:**

- `id` - Primary Key (users.id ile aynı)
- `staff_number` - Personel numarası (STF-001 formatında)
- `hire_date` - İşe başlama tarihi
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı

**İlişkiler:**

- `id` → `users(id)` ON DELETE CASCADE

**İndeksler:**

- `idx_staff_number` - Personel numarasına göre arama

---

### 5. patients (Hastalar)

Hasta kayıtları.

**Alanlar:**

**Kimlik Bilgileri:**

- `id` - Otomatik artan benzersiz kimlik
- `patient_number` - Hasta numarası (P-00001 formatında)
- `first_name` - Ad
- `last_name` - Soyad
- `tc_no` - T.C. Kimlik No (11 haneli)
- `passport_no` - Pasaport No

**Sağlık Bilgileri:**

- `birth_date` - Doğum tarihi
- `blood_type` - Kan grubu

**İletişim Bilgileri:**

- `phone` - Telefon numarası
- `email` - E-posta adresi

**Diğer:**

- `notes` - Notlar
- `is_active` - Aktif/Pasif durumu
- `created_by` - Kaydı oluşturan kullanıcı (Foreign Key)
- `updated_by` - Son güncelleyen kullanıcı (Foreign Key)
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı

**İlişkiler:**

- `created_by` → `users(id)`
- `updated_by` → `users(id)`

**İndeksler:**

- `idx_patient_number` - Hasta numarasına göre arama
- `idx_patient_tc_no` - TC No'ya göre arama
- `idx_patient_phone` - Telefon numarasına göre arama
- `idx_patient_is_active` - Aktif hastalara göre filtreleme

---

### 6. appointments (Randevular)

Hasta randevu kayıtları.

**Alanlar:**

- `id` - Otomatik artan benzersiz kimlik
- `appointment_number` - Randevu numarası (APT-00001 formatında)
- `patient_id` - Hasta ID (Foreign Key)
- `doctor_id` - Doktor ID (Foreign Key)
- `appointment_date` - Randevu tarihi
- `appointment_time` - Randevu saati
- `duration_minutes` - Süre (dakika, varsayılan 30)
- `appointment_type` - Randevu tipi (Kontrol, Tedavi, vb.)
- `status` - Durum (scheduled, confirmed, completed, cancelled, no-show)
- `reason` - Randevu nedeni
- `notes` - Notlar
- `created_by` - Kaydı oluşturan kullanıcı
- `cancelled_by` - İptal eden kullanıcı
- `cancellation_reason` - İptal nedeni
- `created_at` - Oluşturulma zamanı
- `updated_at` - Güncellenme zamanı

**İlişkiler:**

- `patient_id` → `patients(id)` ON DELETE CASCADE
- `doctor_id` → `doctors(id)` ON DELETE CASCADE
- `created_by` → `users(id)`
- `cancelled_by` → `users(id)`

**İndeksler:**

- `idx_appointment_patient` - Hastaya göre arama
- `idx_appointment_doctor` - Doktora göre arama
- `idx_appointment_date` - Tarihe göre arama
- `idx_appointment_status` - Duruma göre filtreleme
- `idx_appointment_doctor_date` - Doktor+tarih composite index

**Unique Constraint:**

- Aynı doktor, aynı tarih, aynı saatte iki randevu olamaz

**Status Değerleri:**

- `scheduled` - Planlandı
- `confirmed` - Onaylandı
- `completed` - Tamamlandı
- `cancelled` - İptal edildi
- `no-show` - Hasta gelmedi

---

## İlişki Diyagramı

```
users (1) ──────→ (1) doctors ──────→ specializations
  │                    │
  │                    └──→ (*) appointments
  │
  ├─────────→ (1) staff
  │
  └─────────→ (*) patients ──────→ (*) appointments
```

---

## Önemli Notlar

### 1. One-to-One İlişki Pattern

- `doctors.id = users.id`
- `staff.id = users.id`
- Avantajları:
  - Veri tutarlılığı
  - JOIN performansı
  - Basit silme işlemleri (CASCADE)

### 2. Güvenlik

- Şifreler bcrypt ile hashlenir
- PEPPER ile ekstra güvenlik katmanı
- Soft delete için `deleted_at` alanı
- Foreign key'ler ile veri bütünlüğü

### 3. İndeksleme Stratejisi

- Sık sorgulanan alanlar indekslenir
- Unique constraint'ler performansı artırır
- Foreign key'ler otomatik indekslenir
- Composite index'ler complex sorgular için

### 4. Migration Sırası

1. `001_create_users.sql` - Kullanıcı tablosu
2. `005_specialization.sql` - Uzmanlık alanları
3. `002_create_doctors.sql` - Doktor tablosu
4. `003_create_recepcionist.sql` - Personel tablosu
5. `004_create_patients.sql` - Hasta tablosu
6. `007_appointments.sql` - Randevu tablosu
