-- Connection Test Script
-- Run this first to verify your database connection

-- Test 1: Basic connection
SELECT 'Database connected successfully!' as status, NOW() as current_time;

-- Test 2: Check if auth system is working
SELECT 
  CASE 
    WHEN auth.uid() IS NULL THEN 'No user logged in (normal for SQL editor)'
    ELSE 'User logged in: ' || auth.uid()::text
  END as auth_status;

-- Test 3: List all tables in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test 4: Check if our main tables exist
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
    THEN 'users table exists ✓'
    ELSE 'users table missing ✗'
  END as users_table_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories' AND table_schema = 'public')
    THEN 'categories table exists ✓'
    ELSE 'categories table missing ✗'
  END as categories_table_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'businesses' AND table_schema = 'public')
    THEN 'businesses table exists ✓'
    ELSE 'businesses table missing ✗'
  END as businesses_table_status;

-- Test 5: Check if extensions are enabled
SELECT 
  extname as extension_name,
  extversion as version
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Test 6: Check if custom types exist
SELECT 
  typname as type_name,
  typtype as type_type
FROM pg_type 
WHERE typname IN ('user_role', 'task_status', 'audit_status');
