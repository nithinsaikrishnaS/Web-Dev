# Fix "No Database Connected" Error in Supabase

## Step 1: Check Your Supabase Project Status

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Verify Project is Active**
   - Look for a green "Active" status indicator
   - If it shows "Paused" or "Inactive", click to resume it
   - Wait 2-3 minutes for the database to fully start

## Step 2: Access SQL Editor Properly

1. **Navigate to SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in the left sidebar
   - Wait for it to load completely

2. **Check Connection Status**
   - Look for a connection indicator (usually top-right)
   - Should show "Connected" or a green dot
   - If red/disconnected, refresh the page

## Step 3: Alternative Methods to Run SQL

### Method A: Use the Table Editor First
1. Go to "Table Editor" in Supabase dashboard
2. Click "New table" 
3. This will establish the database connection
4. Then go back to SQL Editor

### Method B: Use Direct SQL Commands
1. In SQL Editor, try a simple test first:
   \`\`\`sql
   SELECT NOW();
   \`\`\`
2. Click "Run" - this should establish connection
3. Then run your policies script

### Method C: Use Supabase CLI (Recommended)
\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# Run SQL files directly
supabase db push
\`\`\`

## Step 4: Manual Connection Steps

1. **Get Your Database URL**
   - Go to Settings → Database in Supabase
   - Copy the "Connection string"
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

2. **Test Connection with psql** (if you have it installed)
   \`\`\`bash
   psql "postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
   \`\`\`

## Step 5: Run Scripts Step by Step

Instead of running the full script, try smaller chunks:

### Chunk 1: Enable RLS
\`\`\`sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
\`\`\`

### Chunk 2: Create Simple Policy
\`\`\`sql
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
\`\`\`

### Chunk 3: Test the Policy
\`\`\`sql
SELECT * FROM public.users LIMIT 1;
\`\`\`

## Step 6: Common Solutions

### Solution 1: Refresh Everything
1. Close all Supabase tabs
2. Clear browser cache for supabase.com
3. Login again
4. Navigate to SQL Editor

### Solution 2: Check Browser
- Try a different browser (Chrome, Firefox, Safari)
- Disable ad blockers temporarily
- Check if JavaScript is enabled

### Solution 3: Project Region Issue
- Some regions have connectivity issues
- Try accessing from a different network/VPN
- Contact Supabase support if persistent

### Solution 4: Use the Simple Approach
Instead of complex policies, start with basic ones:

\`\`\`sql
-- Disable RLS temporarily for testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

-- Test your app first, then enable RLS later
\`\`\`

## Step 7: Verify Your Setup

1. **Check if tables exist**:
   \`\`\`sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   \`\`\`

2. **Check your project settings**:
   - Go to Settings → API
   - Verify your project URL and keys are correct
   - Make sure the project is not paused

## Step 8: Emergency Workaround

If SQL Editor still doesn't work:

1. **Use the REST API**:
   \`\`\`javascript
   // In your app's browser console
   fetch('https://your-project.supabase.co/rest/v1/users', {
     headers: {
       'apikey': 'your-anon-key',
       'Authorization': 'Bearer your-anon-key'
     }
   }).then(r => r.json()).then(console.log)
   \`\`\`

2. **Use your app's connection**:
   - Run your Next.js app locally
   - Use the test connection page we created
   - Execute SQL through your app's Supabase client

## Need Help?

If none of these work:
1. Check Supabase status page: [status.supabase.com](https://status.supabase.com)
2. Try creating a new project to test
3. Contact Supabase support with your project reference
4. Share the exact error message you're seeing

## Quick Test Script

Try this simple script first to test connection:

\`\`\`sql
-- Simple connection test
SELECT 'Database connected successfully!' as status;

-- Check if auth is working
SELECT auth.uid() as current_user_id;

-- List existing tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
