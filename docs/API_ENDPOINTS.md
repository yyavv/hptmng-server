# API Endpoints Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 📌 Authentication & Users

### POST /auth/login

Login to the system and get JWT token.

**Request Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin",
    "first_name": "Admin",
    "last_name": "Kullanıcı",
    "email": "admin@hastane.com",
    "role": "admin"
  }
}
```

---

### POST /auth/register

Create a new user (Admin only).

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "username": "yeni_doktor",
  "password": "password123",
  "first_name": "Ali",
  "last_name": "Veli",
  "email": "ali.veli@hastane.com",
  "phone_number": "05309999999",
  "role": "doctor"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 9,
    "username": "yeni_doktor",
    "first_name": "Ali",
    "last_name": "Veli",
    "email": "ali.veli@hastane.com",
    "phone_number": "05309999999",
    "role": "doctor",
    "created_at": "2025-12-07T06:24:02.468Z"
  }
}
```

---

### GET /users

Get all users.

**Auth Required:** Yes (Admin)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "first_name": "Admin",
      "last_name": "Kullanıcı",
      "email": "admin@hastane.com",
      "phone_number": "05301234567",
      "role": "admin",
      "is_active": true,
      "created_at": "2025-12-07T00:00:00.000Z",
      "last_login": "2025-12-07T12:00:00.000Z"
    }
  ]
}
```

---

### GET /users/:id

Get user by ID.

**Auth Required:** Yes (Admin)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "dr.mehmet",
    "first_name": "Mehmet",
    "last_name": "Yılmaz",
    "email": "mehmet.yilmaz@hastane.com",
    "phone_number": "05301234568",
    "role": "doctor",
    "is_active": true
  }
}
```

---

### PUT /users/:id

Update user information.

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "first_name": "Mehmet",
  "last_name": "Demir",
  "email": "mehmet.demir@hastane.com",
  "phone_number": "05301234567",
  "role": "doctor"
}
```

**Updatable Fields:**

- `first_name` - First name
- `last_name` - Last name
- `email` - Email address
- `phone_number` - Phone number
- `role` - User role (admin, doctor, receptionist, nurse)

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "username": "dr.mehmet",
    "first_name": "Mehmet",
    "last_name": "Demir",
    "email": "mehmet.demir@hastane.com"
  }
}
```

---

### DELETE /users/:id

Soft delete user (set is_active to false).

**Auth Required:** Yes (Admin)

**Response:**

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": 9,
    "username": "yeni_doktor",
    "is_active": false
  }
}
```

**Note:** User is not deleted from database, only deactivated. They cannot login anymore.

---

## 👨‍⚕️ Doctors

### GET /doctors

Get all doctors with user info and specialization.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "doctor_number": "DR-001",
      "specialization_id": 1,
      "hire_date": "2020-01-15",
      "username": "dr.mehmet",
      "email": "mehmet.yilmaz@hastane.com",
      "first_name": "Mehmet",
      "last_name": "Yılmaz",
      "phone_number": "05301234568",
      "user_active": true,
      "specialization_name": "Kardiyoloji"
    }
  ]
}
```

---

### GET /doctors/:id

Get doctor by ID with full details.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "doctor_number": "DR-001",
    "specialization_id": 1,
    "hire_date": "2020-01-15",
    "first_name": "Mehmet",
    "last_name": "Yılmaz",
    "specialization_name": "Kardiyoloji"
  }
}
```

---

### GET /doctors/specialization/:specializationId

Get doctors by specialization.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "doctor_number": "DR-001",
      "first_name": "Mehmet",
      "last_name": "Yılmaz",
      "specialization_name": "Kardiyoloji"
    }
  ]
}
```

---

### POST /doctors

Create a new doctor record (user must exist first).

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "user_id": 9,
  "specialization_id": 3,
  "hire_date": "2025-12-07"
}
```

**Note:** `user_id` is automatically mapped to `id` field. `doctor_number` is auto-generated.

**Response:**

```json
{
  "success": true,
  "message": "Doktor başarıyla eklendi",
  "data": {
    "id": 9,
    "doctor_number": "DR-005",
    "specialization_id": 3,
    "hire_date": "2025-12-07"
  }
}
```

---

### PUT /doctors/:id

Update doctor information.

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "specialization_id": 2,
  "hire_date": "2020-01-15"
}
```

**Updatable Fields:**

- `specialization_id` - Specialization ID
- `hire_date` - Hire date

**Response:**

```json
{
  "success": true,
  "message": "Doktor başarıyla güncellendi",
  "data": {
    "id": 2,
    "specialization_id": 2,
    "hire_date": "2020-01-15"
  }
}
```

**Note:** To delete a doctor, delete their user account via `DELETE /users/:id`.

---

## 🏥 Specializations

### GET /specializations

Get all specializations.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kardiyoloji",
      "description": "Kalp ve damar hastalıkları uzmanı",
      "is_active": true
    }
  ]
}
```

---

### GET /specializations/:id

Get specialization by ID.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kardiyoloji",
    "description": "Kalp ve damar hastalıkları uzmanı"
  }
}
```

---

### POST /specializations

Create a new specialization.

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "name": "Dermatoloji",
  "description": "Cilt hastalıkları uzmanı"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Uzmanlık başarıyla eklendi",
  "data": {
    "id": 8,
    "name": "Dermatoloji",
    "description": "Cilt hastalıkları uzmanı",
    "is_active": true
  }
}
```

---

### PUT /specializations/:id

Update specialization.

**Auth Required:** Yes (Admin)

**Request Body:**

```json
{
  "name": "Kardiyoloji",
  "description": "Kalp ve damar hastalıkları uzmanı - güncellendi"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Uzmanlık başarıyla güncellendi",
  "data": {
    "id": 1,
    "name": "Kardiyoloji",
    "description": "Kalp ve damar hastalıkları uzmanı - güncellendi"
  }
}
```

---

## 🏥 Patients

### GET /patients

Get all active patients.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_number": "HKD-2025-00001",
      "first_name": "Ahmet",
      "last_name": "Yılmaz",
      "tc_no": "12345678901",
      "birth_date": "1990-01-15",
      "blood_type": "A+",
      "phone": "555-1234",
      "email": "ahmet@email.com",
      "is_active": true,
      "created_by_name": "Admin Kullanıcı"
    }
  ]
}
```

---

### GET /patients/:id

Get patient by ID.

**Auth Required:** Yes

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_number": "HKD-2025-00001",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "phone": "555-1234",
    "email": "ahmet@email.com"
  }
}
```

---

### POST /patients

Create a new patient.

**Auth Required:** Yes (Admin, Receptionist, Nurse)

**Request Body:**

```json
{
  "first_name": "Test",
  "last_name": "Hasta",
  "phone": "555-9999",
  "email": "test@email.com",
  "tc_no": "12345678901",
  "passport_no": "A1234567",
  "birth_date": "1990-01-01",
  "blood_type": "A+",
  "notes": "Notlar"
}
```

**Required Fields:**

- `first_name`
- `last_name`
- `phone`

**Response:**

```json
{
  "success": true,
  "message": "Hasta başarıyla eklendi",
  "data": {
    "id": 16,
    "patient_number": "HKD-2025-00016",
    "first_name": "Test",
    "last_name": "Hasta",
    "phone": "555-9999"
  }
}
```

**Note:** `patient_number` and `created_by` are auto-generated.

---

### PUT /patients/:id

Update patient information.

**Auth Required:** Yes (Admin, Receptionist, Nurse)

**Request Body:**

```json
{
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "tc_no": "12345678901",
  "passport_no": "A1234567",
  "birth_date": "1990-05-15",
  "blood_type": "A+",
  "phone": "555-1234",
  "email": "ahmet@email.com",
  "notes": "Diyabet hastası"
}
```

**Updatable Fields:**

- `first_name`, `last_name`
- `tc_no`, `passport_no`
- `birth_date`, `blood_type`
- `phone`, `email`
- `notes`

**Response:**

```json
{
  "success": true,
  "message": "Hasta başarıyla güncellendi",
  "data": {
    "id": 1,
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "phone": "555-1234"
  }
}
```

---

### DELETE /patients/:id

Soft delete patient (set is_active to false).

**Auth Required:** Yes (Admin)

**Response:**

```json
{
  "success": true,
  "message": "Hasta başarıyla silindi"
}
```

**Note:** Returns 404 if patient not found or already deleted.

---

## 🔒 Authorization Roles

- **admin** - Full access to all endpoints
- **doctor** - Can view patients, appointments
- **receptionist** - Can manage patients, appointments
- **nurse** - Can manage patients

---

## 📝 Common Response Codes

- **200 OK** - Successful GET/PUT/DELETE
- **201 Created** - Successful POST
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate entry (username, tc_no, etc.)
- **500 Internal Server Error** - Server error

---

## 🧪 Test Data

Default users (password: `password123`):

- `admin` - Admin user
- `dr.mehmet` - Kardiyoloji doctor
- `dr.ayse` - Nöroloji doctor
- `dr.ahmet` - Dahiliye doctor
- `dr.zeynep` - Göz Hastalıkları doctor
- `recep1`, `recep2`, `recep3` - Receptionists

Default specializations:

1. Kardiyoloji
2. Nöroloji
3. Ortopedi
4. Göz Hastalıkları
5. Çocuk Sağlığı
6. Dahiliye
7. Genel Cerrahi

Database reset command:

```bash
npm run db:fresh
```

This will reset database, run all migrations, and seed test data.
