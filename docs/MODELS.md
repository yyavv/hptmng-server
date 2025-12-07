# Model Dokümantasyonu

Tüm modeller CRUD (Create, Read, Update, Delete) operasyonları için kullanılır. Veritabanı tabloları migration dosyalarıyla oluşturulur.

---

## User Model (User.js)

### findUserByUsername(username)

Kullanıcı adına göre kullanıcı bulur.

**Parametreler:**

- `username` (string) - Kullanıcı adı (büyük/küçük harf duyarsız)

**Dönen Değer:**

- User objesi veya undefined

**Örnek:**

```javascript
const user = await findUserByUsername("admin");
// { id, username, password_hash, first_name, last_name, email, role, ... }
```

---

### createUser(userData)

Yeni kullanıcı oluşturur (şifre otomatik hashlenir).

**Parametreler:**

```javascript
{
  username: string,
  password: string,    // Plain text (hashlenecek)
  first_name: string,
  last_name: string,
  role: string         // 'doctor', 'receptionist', 'admin'
}
```

**Güvenlik:**

1. PEPPER env variable'dan alınır
2. `password + PEPPER` birleştirilir
3. bcrypt.genSalt(10) ile salt oluşturulur
4. bcrypt.hash() ile hashlenir

**Dönen Değer:**

```javascript
{
  id, username, first_name, last_name, role, created_at;
}
```

**Örnek:**

```javascript
const user = await createUser({
  username: "dr.mehmet",
  password: "password123",
  first_name: "Mehmet",
  last_name: "Yılmaz",
  role: "doctor",
});
```

---

### comparePassword(plainPassword, hashedPassword)

Şifre karşılaştırması yapar (login için).

**Parametreler:**

- `plainPassword` (string) - Kullanıcının girdiği şifre
- `hashedPassword` (string) - Veritabanındaki hash

**İşleyiş:**

1. PEPPER env variable'dan alınır
2. `plainPassword + PEPPER` birleştirilir
3. bcrypt.compare() ile karşılaştırılır

**Dönen Değer:**

- `true` - Şifre doğru
- `false` - Şifre yanlış

**Örnek:**

```javascript
const isValid = await comparePassword("password123", user.password_hash);
if (isValid) {
  // Login başarılı
}
```

**Güvenlik Notu:**
PEPPER değişirse tüm hashler geçersiz olur. PEPPER sabit kalmalıdır.

---

### updateLastLogin(userId)

Son giriş zamanını günceller.

**Parametreler:**

- `userId` (number) - Kullanıcı ID

**Örnek:**

```javascript
await updateLastLogin(user.id);
```

---

### getAllUsers()

Tüm kullanıcıları listeler (şifreler hariç).

**Dönen Değer:**

```javascript
[
  {
    id,
    username,
    first_name,
    last_name,
    role,
    created_at,
    last_login
  },
  ...
]
```

**Örnek:**

```javascript
const users = await getAllUsers();
```

---

## Doctor Model (Doctor.js)

### Tablo Yapısı

- `id` → users.id (one-to-one)
- `doctor_number` → DR-001, DR-002
- `specialization_id` → specializations.id
- `hire_date` → İşe başlama tarihi

### Önemli Notlar

- Doctor kaydı oluşturulmadan önce user kaydı olmalı
- `id` alanı users tablosundan gelir
- ON DELETE CASCADE - user silinirse doctor da silinir

---

## Staff Model (Staff.js)

### Tablo Yapısı

- `id` → users.id (one-to-one)
- `staff_number` → STF-001, STF-002
- `hire_date` → İşe başlama tarihi

### Önemli Notlar

- Staff kaydı oluşturulmadan önce user kaydı olmalı
- `id` alanı users tablosundan gelir
- ON DELETE CASCADE - user silinirse staff da silinir

---

## Patient Model (Patient.js)

### Tablo Yapısı

Hasta kayıtları users tablosundan bağımsızdır.

**Kimlik:**

- `id` - Otomatik artan
- `patient_number` - P-00001, P-00002
- `first_name`, `last_name`
- `tc_no` - TC Kimlik No (unique)
- `passport_no` - Pasaport No (unique)

**Sağlık:**

- `birth_date` - Doğum tarihi
- `blood_type` - Kan grubu

**İletişim:**

- `phone` - Telefon numarası
- `email` - E-posta

**Diğer:**

- `notes` - Notlar
- `is_active` - Aktif/Pasif
- `created_by` → users.id
- `updated_by` → users.id

---

## Specialization Model (Specialization.js)

### Tablo Yapısı

- `id` - Otomatik artan
- `name` - Uzmanlık adı (unique)
- `description` - Açıklama

### Varsayılan Değerler

1. Ortodonti
2. Endodonti
3. Periodontoloji
4. Protez
5. Pedodonti
6. Ağız Cerrahisi

---

## Branch Model (Branch.js)

### Not

Şu an aktif değil. Gelecekte şube yönetimi için kullanılabilir.

---

## Appointment Model (Appointment.js)

### Not

Şu an aktif değil. Randevu sistemi için kullanılacak.

---

## Genel Kullanım Kuralları

### 1. Transaction Kullanımı

İlişkili kayıtlar oluştururken transaction kullanın:

```javascript
const client = await pool.connect();
try {
  await client.query("BEGIN");

  // User oluştur
  const user = await createUser(userData);

  // Doctor kaydı oluştur
  await client.query(
    "INSERT INTO doctors (id, doctor_number, specialization_id) VALUES ($1, $2, $3)",
    [user.id, "DR-001", 1]
  );

  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}
```

### 2. Hata Yönetimi

Model fonksiyonları hata fırlatır, controller'da yakalanır:

```javascript
try {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 404);
  }
} catch (error) {
  // Error handler middleware yakalar
  next(error);
}
```

### 3. Input Validation

Model'e gelmeden önce validation yapılmalı:

```javascript
router.post(
  "/users",
  validateRequired(["username", "password"]),
  validateEmail("email"),
  createUserController
);
```

### 4. Soft Delete

`deleted_at` alanı kullanarak soft delete:

```javascript
// Silme
UPDATE users SET deleted_at = NOW() WHERE id = $1

// Aktif kayıtlar
SELECT * FROM users WHERE deleted_at IS NULL
```

---

## Güvenlik Kuralları

### 1. Şifre Güvenliği

- ✅ bcrypt kullanılır (10 rounds)
- ✅ PEPPER ile ekstra güvenlik
- ❌ Plain text şifre döndürülmez
- ❌ Şifre loglara yazılmaz

### 2. SQL Injection Koruması

- ✅ Parameterized queries ($1, $2)
- ❌ String concatenation kullanılmaz

### 3. Veri Bütünlüğü

- ✅ Foreign key constraints
- ✅ Unique constraints
- ✅ NOT NULL constraints
- ✅ ON DELETE CASCADE/SET NULL

---

## Migration ile Model İlişkisi

| Migration                   | Model             | Açıklama          |
| --------------------------- | ----------------- | ----------------- |
| 001_create_users.sql        | User.js           | Kullanıcılar      |
| 005_specialization.sql      | Specialization.js | Uzmanlık alanları |
| 002_create_doctors.sql      | Doctor.js         | Doktorlar         |
| 003_create_recepcionist.sql | Staff.js          | Personel          |
| 004_create_patients.sql     | Patient.js        | Hastalar          |

**Önemli:** Tablolar migration ile oluşturulur, modeller sadece CRUD işlemleri yapar.
