# 🔐 Authentication System Setup Guide

## ✅ What's Been Created:

### Backend (Server):

- ✅ User authentication model (`models/User.js`)
- ✅ Login & Register controllers (`controllers/authController.js`)
- ✅ Auth routes (`routes/auth.js`)
- ✅ Users table in database
- ✅ Integration with main.js

### Frontend (Tauri):

- ✅ Updated Login.jsx to connect to backend API
- ✅ Real authentication with backend
- ✅ Error handling and loading states

## 🚀 How to Test:

### Step 1: Start the Backend Server

```bash
cd server
npm start
```

You should see:

```
✅ PostgreSQL database connected successfully
✅ Users table ready
✅ Patients table ready
📊 Database tables ready
🚀 Server running on port 3000
📍 http://localhost:3000
```

### Step 2: Create a Test User

Open a NEW terminal and run:

```bash
cd server
node createTestUser.js
```

This creates a test user:

- **Username**: `admin`
- **Password**: `admin123`

### Step 3: Start the Frontend (Tauri)

Open ANOTHER terminal:

```bash
cd hptmng
npm run tauri dev
```

### Step 4: Login

1. The Tauri app will open
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"

## 📡 API Endpoints:

### POST `/api/auth/login`

Login with username and password

**Request:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "System Administrator",
    "role": "admin"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### POST `/api/auth/register`

Create a new user

**Request:**

```json
{
  "username": "johndoe",
  "password": "password123",
  "full_name": "John Doe",
  "role": "user"
}
```

## 🔧 Testing with PowerShell:

### Test Login:

```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Test Register:

```powershell
$body = @{
    username = "doctor1"
    password = "doc123"
    full_name = "Dr. Smith"
    role = "doctor"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## 🐛 Troubleshooting:

### "Connection error" on login:

- ✅ Make sure backend server is running on port 3000
- ✅ Check if `npm start` is active in server folder

### "Invalid credentials":

- ✅ Run `node createTestUser.js` to create the test user
- ✅ Use username: `admin`, password: `admin123`

### CORS errors:

- ✅ Already configured in main.js
- ✅ Frontend should work with Tauri

## ⚠️ Security Notes:

**Current Implementation (DEV ONLY):**

- ❌ Passwords stored in plain text
- ❌ No password hashing
- ❌ No JWT tokens
- ❌ No session management

**For Production, You Should:**

- ✅ Use `bcrypt` to hash passwords
- ✅ Implement JWT tokens
- ✅ Add refresh tokens
- ✅ Use HTTPS
- ✅ Add rate limiting
- ✅ Add input sanitization

## 📝 Next Steps:

1. Add password hashing with bcrypt
2. Implement JWT token authentication
3. Add session management
4. Create user management UI
5. Add password reset functionality
6. Implement role-based access control (RBAC)
