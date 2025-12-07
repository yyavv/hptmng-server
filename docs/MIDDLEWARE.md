# Middleware Dokümantasyonu

## 1. Authentication Middleware (auth.js)

### generateToken(user)

JWT token oluşturur.

**Parametreler:**

- `user.id` - Kullanıcı ID
- `user.username` - Kullanıcı adı
- `user.role` - Kullanıcı rolü
- `user.email` - E-posta

**Dönen Değer:**

- JWT token (string)

**Geçerlilik Süresi:**

- 7 gün (varsayılan)
- `JWT_EXPIRE` env variable ile ayarlanabilir

**Örnek:**

```javascript
const token = generateToken({
  id: 1,
  username: "admin",
  role: "admin",
  email: "admin@hastane.com",
});
```

---

### authenticateToken(req, res, next)

JWT token doğrular ve kullanıcı bilgilerini `req.user`'a ekler.

**Header Formatı:**

```
Authorization: Bearer <token>
```

**Başarılı:**

- `req.user` objesine kullanıcı bilgileri eklenir
- `next()` çağrılır

**Hata Durumları:**

- Token yoksa → 401 "Access token required"
- Token geçersizse → 403 "Invalid or expired token"

**Kullanım:**

```javascript
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

---

### authorizeRoles(...allowedRoles)

Rol bazlı yetkilendirme yapar.

**Parametreler:**

- `...allowedRoles` - İzin verilen roller (string[])

**Başarılı:**

- Kullanıcının rolü izin verilenlerdeyse `next()` çağrılır

**Hata Durumları:**

- Kullanıcı yoksa → 401 "Authentication required"
- Rol yetkisizse → 403 "Access denied"

**Kullanım:**

```javascript
// Sadece admin
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUser
);

// Admin veya doktor
router.get(
  "/patients",
  authenticateToken,
  authorizeRoles("admin", "doctor"),
  getPatients
);
```

---

### optionalAuth(req, res, next)

Token varsa doğrular, yoksa devam eder.

**Kullanım:**

- Public endpoint'lerde kullanıcı bilgisi varsa eklemek için
- Login kontrolü yapmadan kullanıcı bilgisine erişmek için

**Örnek:**

```javascript
router.get("/public", optionalAuth, (req, res) => {
  if (req.user) {
    // Giriş yapmış kullanıcı
  } else {
    // Anonim kullanıcı
  }
});
```

---

## 2. Error Handler Middleware (errorHandler.js)

### AppError

Özel hata sınıfı.

**Constructor:**

```javascript
new AppError(message, statusCode);
```

**Örnek:**

```javascript
throw new AppError("Hasta bulunamadı", 404);
```

---

### asyncHandler(fn)

Async fonksiyonlardaki hataları yakalar.

**Kullanım:**

```javascript
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    throw new AppError("Hasta bulunamadı", 404);
  }
  res.json(patient);
});
```

---

### errorHandler(err, req, res, next)

Global hata yakalayıcı.

**PostgreSQL Hata Kodları:**

- `23505` - Unique violation → "field already exists" (400)
- `23503` - Foreign key violation → "Referenced record does not exist" (400)
- `23502` - Not null violation → "field is required" (400)

**JWT Hataları:**

- `JsonWebTokenError` → "Invalid token" (401)
- `TokenExpiredError` → "Token expired" (401)

**Validation Hataları:**

- `ValidationError` → Custom message (400)

**Response Formatı:**

```json
{
  "success": false,
  "error": "Hata mesajı",
  "stack": "..." // Sadece development'da
}
```

---

### notFound(req, res, next)

404 handler.

**Kullanım:**

```javascript
app.use(notFound); // Tüm route'lardan sonra
```

---

## 3. Validation Middleware (validation.js)

### validateRequired(fields)

Zorunlu alanları kontrol eder.

**Kullanım:**

```javascript
router.post(
  "/patients",
  validateRequired(["first_name", "last_name", "phone"]),
  createPatient
);
```

**Hata Response:**

```json
{
  "error": "Missing required fields",
  "missingFields": ["first_name", "phone"]
}
```

---

### validateEmail(field = 'email')

E-posta formatını kontrol eder.

**Regex:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Kullanım:**

```javascript
router.post("/register", validateEmail("email"), register);
```

---

### validatePhone(field = 'phone')

Türk telefon formatını kontrol eder.

**Format:**

- `5XX XXX XX XX`
- `05XX XXX XX XX`

**Regex:** `/^(0)?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/`

**Kullanım:**

```javascript
router.post("/patients", validatePhone("phone"), createPatient);
```

---

### validateTCNo(field = 'tc_no')

TC Kimlik No algoritmasını kontrol eder.

**Kurallar:**

- 11 haneli olmalı
- İlk hane 0 olamaz
- 10. hane hesaplanır: `(oddSum * 7 - evenSum) % 10`
- 11. hane hesaplanır: `totalSum % 10`

**Kullanım:**

```javascript
router.post("/patients", validateTCNo("tc_no"), createPatient);
```

---

### validateDate(field)

Tarih formatını kontrol eder.

**Kullanım:**

```javascript
router.post(
  "/appointments",
  validateDate("appointment_date"),
  createAppointment
);
```

---

### sanitizeInput(req, res, next)

Tehlikeli karakterleri temizler.

**Temizleme:**

- `<` ve `>` karakterleri kaldırılır
- Boşluklar trim edilir
- req.body, req.query, req.params temizlenir

**Kullanım:**

```javascript
app.use(sanitizeInput); // Global kullanım
```

---

## Middleware Kullanım Sırası

```javascript
// 1. Body parser
app.use(express.json());

// 2. Sanitize
app.use(sanitizeInput);

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", authenticateToken, patientRoutes);

// 4. 404 Handler
app.use(notFound);

// 5. Error Handler
app.use(errorHandler);
```

---

## Güvenlik Özellikleri

### 1. JWT Token

- Secret key ile imzalanır
- 7 gün geçerlilik süresi
- Bearer token formatı

### 2. Rol Bazlı Yetkilendirme

- Admin: Tüm yetkiler
- Doctor: Hasta ve randevu yönetimi
- Receptionist: Sınırlı erişim

### 3. Input Sanitization

- XSS koruması
- SQL injection koruması
- Trim ve temizleme

### 4. Hata Yönetimi

- Stack trace sadece development'da
- Kullanıcı dostu hata mesajları
- Log kaydı
