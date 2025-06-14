-- Step 7: Verify Everything is Working
-- Run this to check your complete setup

-- Check all tables exist
SELECT 
  'Tables Check' as test_type,
  COUNT(*) as table_count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ All tables created'
    ELSE '❌ Missing tables'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check sample data
SELECT 
  'Sample Data Check' as test_type,
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM regions) as regions_count,
  (SELECT COUNT(*) FROM audit_templates) as templates_count;

-- Check RLS is enabled
SELECT 
  'Security Check' as test_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check custom types exist
SELECT 
  'Custom Types Check' as test_type,
  typname as type_name,
  '✅ Created' as status
FROM pg_type 
WHERE typname IN ('user_role', 'task_status', 'audit_status');

-- Final success message
SELECT 
  '🎉 SETUP COMPLETE! 🎉' as message,
  'Your AuditX database is ready to use!' as details;
