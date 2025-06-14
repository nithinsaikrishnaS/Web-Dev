-- Verify Stripe Integration Setup

-- Check if Stripe columns were added to auditors table
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'auditors' 
  AND column_name LIKE 'stripe_%'
ORDER BY column_name;

-- Check if Stripe tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name IN ('stripe_transactions', 'stripe_webhook_events')
  AND table_schema = 'public';

-- Check if RLS is enabled on Stripe tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('stripe_transactions', 'stripe_webhook_events')
  AND schemaname = 'public';

-- Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('stripe_transactions', 'stripe_webhook_events')
ORDER BY tablename, policyname;

-- Check if functions exist
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name IN ('process_stripe_payout', 'update_stripe_account_status')
  AND routine_schema = 'public';

-- Test data query (should return empty results initially)
SELECT 'stripe_transactions' as table_name, COUNT(*) as row_count FROM stripe_transactions
UNION ALL
SELECT 'stripe_webhook_events' as table_name, COUNT(*) as row_count FROM stripe_webhook_events;
