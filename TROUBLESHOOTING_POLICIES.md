# Troubleshooting RLS Policies

## Common Issues and Solutions

### 1. **"relation does not exist" error**

**Problem**: Tables haven't been created yet.

**Solution**: 
\`\`\`sql
-- Run the table creation script first
\i scripts/01-create-tables.sql
-- OR
\i scripts/01-create-tables-simple.sql
\`\`\`

### 2. **"type user_role does not exist" error**

**Problem**: Custom enum types weren't created.

**Solution**:
\`\`\`sql
-- Create the enum types manually
CREATE TYPE user_role AS ENUM ('admin', 'user', 'supplier', 'auditor');
CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'sent', 'delivered', 'completed');
CREATE TYPE audit_status AS ENUM ('pending', 'in_progress', 'completed', 'rejected');
\`\`\`

### 3. **"permission denied" errors**

**Problem**: RLS policies are too restrictive.

**Solution**: Use the fixed policies script which has more permissive initial policies.

### 4. **Policies already exist**

**Problem**: Trying to create policies that already exist.

**Solution**: The fixed script includes `DROP POLICY IF EXISTS` statements.

### 5. **Cannot access tables after applying policies**

**Problem**: No matching policy for your user.

**Solution**: 
\`\`\`sql
-- Temporarily disable RLS for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Re-enable after fixing policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
\`\`\`

## Step-by-Step Application

1. **First, create tables**:
   \`\`\`sql
   \i scripts/01-create-tables.sql
   \`\`\`

2. **Then apply fixed policies**:
   \`\`\`sql
   \i scripts/02-create-policies-fixed.sql
   \`\`\`

3. **Test the setup**:
   \`\`\`sql
   \i scripts/05-test-policies.sql
   \`\`\`

4. **Add minimal test data**:
   \`\`\`sql
   \i scripts/06-minimal-seed-data.sql
   \`\`\`

## Verification Commands

\`\`\`sql
-- Check if all tables exist
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- List all policies
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
\`\`\`

## Manual Policy Reset

If you need to start fresh:

\`\`\`sql
-- Disable RLS on all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.' || r.tablename || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Drop all policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY "' || r.policyname || '" ON public.' || r.tablename;
    END LOOP;
END $$;
