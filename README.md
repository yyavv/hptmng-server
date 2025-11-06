# 🏥 Hospital Management System - Backend API

## 📁 Proje Yapısı

```
server/
├── config/           # Konfigürasyon dosyaları
│   └── database.js   # PostgreSQL bağlantısı (db kodları burada)
├── models/           # Veritabanı modelleri (SQL sorguları burada)
│   └── Patient.js    # Hasta CRUD işlemleri
├── controllers/      # İş mantığı (business logic)
│   └── patientController.js
├── routes/           # API route tanımlamaları
│   └── patients.js   # /api/patients endpoint'leri
├── main.js           # Ana server dosyası
├── .env              # Veritabanı bilgileri (GİZLİ!)
└── package.json
```

## 🎯 Veritabanı Kodları Nerede?

### 1️⃣ **Bağlantı** → `config/database.js`

- PostgreSQL bağlantı ayarları
- Connection pool yapılandırması

### 2️⃣ **SQL Sorguları** → `models/Patient.js`

- CREATE TABLE (tablo oluşturma)
- SELECT, INSERT, UPDATE, DELETE sorguları
- Her model bir tablo için tüm DB işlemlerini içerir

### 3️⃣ **İş Mantığı** → `controllers/patientController.js`

- Model fonksiyonlarını çağırır
- Hata yönetimi
- Response formatı

### 4️⃣ **API Endpoints** → `routes/patients.js`

- HTTP metodları (GET, POST, PUT, DELETE)
- URL yapılandırması

## 🚀 Kurulum

### 1. PostgreSQL'i Başlat

PostgreSQL servisinin çalıştığından emin olun.

### 2. .env Dosyasını Düzenle

\`\`\`env
DB*HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=BURAYA*ŞİFRENİZİ_YAZIN
DB_NAME=hptmng
\`\`\`

### 3. Veritabanını Oluştur

PostgreSQL'e bağlanın (pgAdmin veya psql):
\`\`\`sql
CREATE DATABASE hptmng;
\`\`\`

### 4. Server'ı Başlat

\`\`\`bash
cd server
npm start
\`\`\`

Server başladığında tablolar otomatik oluşturulur!

## 📡 API Endpoints

### Hastalar (Patients)

| Method | Endpoint          | Açıklama                   |
| ------ | ----------------- | -------------------------- |
| GET    | /api/patients     | Tüm hastaları listele      |
| GET    | /api/patients/:id | Belirli bir hastayı getir  |
| POST   | /api/patients     | Yeni hasta ekle            |
| PUT    | /api/patients/:id | Hasta bilgilerini güncelle |
| DELETE | /api/patients/:id | Hasta sil                  |

### Örnek İstekler

**Hasta Ekle (POST /api/patients)**
\`\`\`json
{
"first_name": "Ahmet",
"last_name": "Yılmaz",
"tc_no": "12345678901",
"birth_date": "1990-05-15",
"phone": "05551234567",
"email": "ahmet@email.com",
"address": "İstanbul, Türkiye"
}
\`\`\`

## 🔧 Yeni Tablo Eklemek

Örnek: Doktorlar tablosu eklemek için:

1. **Model oluştur**: `models/Doctor.js`
2. **Controller oluştur**: `controllers/doctorController.js`
3. **Routes oluştur**: `routes/doctors.js`
4. **main.js'e ekle**: `app.use("/api/doctors", doctorsRouter);`

## ❓ DB Server'dan Ayrı mı?

**EVET!** İki farklı süreç:

- 🐘 **PostgreSQL** → Port 5432 (veritabanı sunucusu)
- 🟢 **Node.js API** → Port 3000 (web sunucusu)

Node.js, PostgreSQL'e **network üzerinden** bağlanır.
