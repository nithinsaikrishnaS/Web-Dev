# How to Connect and Set Up Your Supabase Database

## Step 1: Create Supabase Project

1. **Go to Supabase**
   - Visit [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up/Login with GitHub or email

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `auditpro-database`
   - Enter database password (save this!)
   - Select region closest to you
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator

## Step 2: Get Your Database Credentials

1. **Go to Project Settings**
   - Click on "Settings" (gear icon) in left sidebar
   - Click on "API" tab

2. **Copy These Values:**
   \`\`\`
   Project URL: https://xxxxx.supabase.co
   Project API Keys:
   - anon/public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   \`\`\`

3. **Save Database Password**
   - You set this when creating the project
   - You'll need it for direct database connections

## Step 3: Run SQL Scripts in Supabase

### Method A: Using SQL Editor (Recommended)

1. **Open SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Run the Scripts**
   \`\`\`sql
   -- First, enable the UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   \`\`\`
   Click "Run" button

3. **Create the Tables**
   - Copy the entire content from `scripts/01-create-tables.sql`
   - Paste in the SQL editor
   - Click "Run"

4. **Check if Tables Were Created**
   - Go to "Table Editor" in left sidebar
   - You should see all the tables listed

### Method B: Using Database URL (Alternative)

1. **Get Database URL**
   - Go to Settings → Database
   - Copy the "Connection string" 
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

2. **Use with psql or any SQL client**
   \`\`\`bash
   psql "postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
   \`\`\`

## Step 4: Verify Connection in Your App

1. **Create .env.local file**
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   \`\`\`

2. **Test Connection**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

3. **Check Browser Console**
   - Open http://localhost:3000
   - Open browser dev tools (F12)
   - Look for any Supabase connection errors

## Step 5: Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Double-check your API keys in .env.local
   - Make sure there are no extra spaces
   - Restart your dev server after changing .env.local

2. **"relation does not exist" error**
   - Tables weren't created properly
   - Go back to SQL Editor and run the table creation script again

3. **"permission denied" error**
   - RLS (Row Level Security) is blocking access
   - Run the policies script: `scripts/02-create-policies.sql`

4. **Connection timeout**
   - Check your internet connection
   - Verify the Supabase project URL is correct

### Testing Your Connection:

\`\`\`javascript
// Test this in browser console on your app
import { supabase } from './lib/supabase'

// Test connection
supabase.from('users').select('count').then(console.log)
\`\`\`

## Quick Setup Commands

If you prefer command line:

\`\`\`bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# 4. Push schema
supabase db push
