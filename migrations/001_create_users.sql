-- Büyük/küçük harf duyarsız kullanıcı adı için
CREATE EXTENSION IF NOT EXISTS citext;

-- Rol ENUM tipleri
CREATE TYPE user_role AS ENUM ('doctor', 'receptionist', 'admin');

-- Kullanıcı tablosu
CREATE TABLE IF NOT EXISTS public.users
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    username CITEXT NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,

    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),

    role user_role NOT NULL DEFAULT 'receptionist',

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ -- soft delete kolonu
);