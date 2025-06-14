-- Step 1: Test Basic Connection
-- Copy and paste this in Supabase SQL Editor and click "Run"

SELECT 
  'Connection successful!' as status,
  NOW() as current_time,
  version() as database_version;

-- This should return:
-- status: "Connection successful!"
-- current_time: Current timestamp
-- database_version: PostgreSQL version info
