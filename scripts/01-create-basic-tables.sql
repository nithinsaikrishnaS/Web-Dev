-- Step 2: Create Basic Tables
-- Run this after connection test succeeds

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user role types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'supplier', 'auditor');
EXCEPTION
    WHEN duplicate_object THEN 
    RAISE NOTICE 'user_role type already exists, skipping...';
END $$;

-- Create task status types  
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'sent', 'delivered', 'completed');
EXCEPTION
    WHEN duplicate_object THEN 
    RAISE NOTICE 'task_status type already exists, skipping...';
END $$;

-- Create audit status types
DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN 
    RAISE NOTICE 'audit_status type already exists, skipping...';
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  city TEXT,
  pincode TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  payout_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions table
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  cities TEXT[] NOT NULL,
  pincodes TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success message
SELECT 'Basic tables created successfully! ✅' as result;
