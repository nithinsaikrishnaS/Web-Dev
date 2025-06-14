# AuditPro Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Settings → API to get your project URL and anon key

## Step 2: Run SQL Scripts

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the content from `scripts/01-create-tables.sql`
5. Click "Run" button
6. Repeat for `scripts/02-create-policies.sql`
7. Repeat for `scripts/03-seed-data.sql`

### Method 2: Using Supabase CLI

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
\`\`\`

## Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Step 4: Install and Run

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## Step 5: Test the Application

1. Open http://localhost:3000
2. Click "Register" to create a new account
3. Try different roles: user, supplier, auditor
4. Login and explore the dashboard

## Troubleshooting

### Common Issues:

1. **"relation does not exist" error**
   - Make sure you ran the SQL scripts in order
   - Check that all tables were created in the `public` schema

2. **"permission denied" error**
   - Ensure RLS policies are properly set up
   - Check that you're using the correct API keys

3. **"function uuid_generate_v4() does not exist"**
   - Make sure the uuid-ossp extension is enabled
   - Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

4. **Authentication issues**
   - Verify your Supabase URL and keys are correct
   - Check that auth is enabled in your Supabase project

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Make sure your Supabase project is fully initialized

## Next Steps

Once the basic setup is working:
1. Add sample data through the admin dashboard
2. Test the mobile app setup
3. Configure Stripe for payments (optional)
4. Deploy to Vercel for production
