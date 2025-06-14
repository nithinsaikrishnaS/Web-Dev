# Complete Supabase Setup Guide for Beginners

## What is Supabase?

Supabase is like a "backend-as-a-service" - it provides:
- **Database**: PostgreSQL database to store your data
- **Authentication**: User login/signup system
- **Real-time**: Live updates when data changes
- **Storage**: File uploads and storage
- **API**: Automatic REST API for your database

Think of it as Firebase but using PostgreSQL instead of NoSQL.

## Step 1: Create Your Supabase Account

### 1.1 Sign Up
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (green button)
3. Sign up with:
   - **GitHub** (recommended - easier)
   - **Google**
   - **Email/Password**

### 1.2 Verify Your Account
- Check your email for verification link
- Click the link to verify your account
- You'll be redirected to the Supabase dashboard

## Step 2: Create Your First Project

### 2.1 Create New Project
1. Click "New Project" (big green button)
2. You'll see a form with these fields:

**Organization**: 
- If first time: Create new organization
- Name it something like "My Projects" or your company name

**Project Name**: 
- Enter: `auditx-database`
- This is just a label, you can change it later

**Database Password**: 
- **VERY IMPORTANT**: Write this down somewhere safe!
- Use a strong password like: `MySecure123!Password`
- You'll need this later for direct database connections

**Region**: 
- Choose closest to your location
- US East (N. Virginia) is usually fastest
- Europe (West London) for Europe
- Asia Pacific (Singapore) for Asia

**Pricing Plan**: 
- Select "Free" (perfect for development)
- You get 500MB database, 50MB file storage
- 50,000 monthly active users

### 2.2 Wait for Project Creation
- Takes 2-3 minutes to set up
- You'll see a progress screen
- Don't close the browser tab!

### 2.3 Project Ready
- You'll see "Project is ready!" message
- You're now in your project dashboard

## Step 3: Understanding Your Dashboard

### 3.1 Left Sidebar Menu
- **Home**: Project overview and stats
- **Table Editor**: Visual database editor (like Excel for databases)
- **SQL Editor**: Write custom SQL queries
- **Authentication**: Manage users and login settings
- **Storage**: File uploads and management
- **Edge Functions**: Serverless functions
- **Settings**: Project configuration

### 3.2 Important Information to Save
Go to **Settings → API** and copy these values:

**Project URL**: 
\`\`\`
https://your-project-id.supabase.co
\`\`\`

**API Keys**:
- **anon/public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**⚠️ IMPORTANT**: 
- The `anon` key is safe to use in your frontend
- The `service_role` key is SECRET - never expose it publicly
- Save both keys in a secure place

## Step 4: Set Up Your Local Environment

### 4.1 Create Environment File
In your project folder, create `.env.local`:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Replace**:
- `your-project-id` with your actual project ID
- The keys with your actual keys from Settings → API

### 4.2 Install Supabase in Your Project
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

## Step 5: Test Your Connection

### 5.1 Create Connection Test Page
We'll create a simple page to test if everything works.

### 5.2 Test the Connection
1. Start your Next.js app: `npm run dev`
2. Go to `http://localhost:3000/test-connection`
3. You should see connection status and any existing tables

## Step 6: Understanding Databases and Tables

### 6.1 What is a Database Table?
Think of a table like a spreadsheet:
- **Columns**: Different types of information (name, email, age)
- **Rows**: Individual records (each person's data)
- **Primary Key**: Unique identifier for each row (like an ID number)

### 6.2 Our AuditX Tables
We need these tables for our auditing app:

**users**: Store user information
- id, email, full_name, role, city, etc.

**businesses**: Store business information  
- id, name, address, category, contact info, etc.

**categories**: Types of businesses
- id, name, description, payout_amount

**audit_tasks**: Audit assignments
- id, business_id, auditor_id, status, etc.

**audit_submissions**: Completed audits
- id, task_id, submission_data, photos, etc.

## Step 7: Create Your Database Tables

### 7.1 Using SQL Editor
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. You'll see a text area where you can write SQL

### 7.2 What is SQL?
SQL (Structured Query Language) is how we talk to databases:
- `CREATE TABLE`: Make a new table
- `INSERT INTO`: Add data to a table
- `SELECT`: Get data from a table
- `UPDATE`: Change existing data
- `DELETE`: Remove data

### 7.3 Run Your First SQL Command
Copy and paste this simple test:

\`\`\`sql
-- This is a comment (ignored by database)
-- Let's test our connection
SELECT 'Hello from Supabase!' as message, NOW() as current_time;
\`\`\`

Click the "Run" button. You should see:
- message: "Hello from Supabase!"
- current_time: Current date and time

**If this works, your connection is perfect!**

## Step 8: Create the Database Schema

### 8.1 Understanding the Process
We'll create tables in this order:
1. **Basic tables first** (users, categories)
2. **Tables that reference others** (businesses, auditors)
3. **Complex tables last** (audit_tasks, submissions)

### 8.2 Run the Table Creation Script
Copy the content from `scripts/01-create-tables.sql` and paste it in SQL Editor.

**What this script does**:
- Creates custom data types (enums)
- Creates all necessary tables
- Sets up relationships between tables
- Enables Row Level Security (RLS)

Click "Run" and wait for completion.

## Step 9: Understanding Row Level Security (RLS)

### 9.1 What is RLS?
Row Level Security controls who can see/edit which rows:
- **Without RLS**: Everyone sees all data
- **With RLS**: Users only see data they're allowed to see

### 9.2 Example
In our `users` table:
- Users can only see their own profile
- Admins can see all users
- This is enforced at the database level

### 9.3 Apply Security Policies
Run the `scripts/02-create-policies-fixed.sql` script.

**What this does**:
- Sets up security rules for each table
- Defines who can read/write what data
- Protects sensitive information

## Step 10: Add Sample Data

### 10.1 Why Sample Data?
Sample data helps us:
- Test that tables work correctly
- See how the app will look with real data
- Debug issues early

### 10.2 Run Seed Script
Run the `scripts/03-seed-data.sql` script.

**This adds**:
- Sample regions (cities and pincodes)
- Business categories
- Audit templates
- Automatic functions

## Step 11: Test Everything

### 11.1 Check Tables Were Created
In SQL Editor, run:
\`\`\`sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
\`\`\`

You should see all your tables listed.

### 11.2 Check Sample Data
\`\`\`sql
SELECT * FROM categories;
SELECT * FROM regions;
\`\`\`

You should see the sample data we inserted.

### 11.3 Test Your App
1. Start your Next.js app: `npm run dev`
2. Go to `http://localhost:3000`
3. Try to register a new account
4. Login and check the dashboard

## Step 12: Understanding Common Issues

### 12.1 "No Database Connected" Error
**Causes**:
- Project is paused (free tier pauses after inactivity)
- Browser cache issues
- Network connectivity problems

**Solutions**:
- Check project status in dashboard
- Refresh browser or try incognito mode
- Wait a few minutes and try again

### 12.2 "Permission Denied" Errors
**Causes**:
- RLS policies are too restrictive
- User doesn't have proper role assigned

**Solutions**:
- Check user role in database
- Temporarily disable RLS for testing
- Review policy conditions

### 12.3 "Relation Does Not Exist" Errors
**Causes**:
- Tables weren't created successfully
- Wrong schema or table name

**Solutions**:
- Re-run table creation script
- Check table names are correct
- Verify you're in the right database

## Step 13: Next Steps

### 13.1 Create Your First User
1. Go to your app: `http://localhost:3000/auth/register`
2. Register with your email
3. Check Supabase Authentication tab to see the user

### 13.2 Make Yourself Admin
In SQL Editor:
\`\`\`sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
\`\`\`

### 13.3 Explore the Dashboard
- Try different user roles
- Create some test businesses
- Explore all the features

## Step 14: Backup and Security

### 14.1 Regular Backups
Supabase automatically backs up your data, but you can also:
- Export data manually from Table Editor
- Use `pg_dump` for full database backups
- Set up automated backups for production

### 14.2 Security Best Practices
- Never commit `.env.local` to git
- Use different projects for development/production
- Regularly review and update RLS policies
- Monitor usage in Supabase dashboard

## Troubleshooting Checklist

If something doesn't work:

✅ **Project Status**: Is your project active (not paused)?
✅ **Environment Variables**: Are they correctly set in `.env.local`?
✅ **API Keys**: Did you copy the right keys from Settings → API?
✅ **Network**: Can you access supabase.com normally?
✅ **Browser**: Try incognito mode or different browser
✅ **Scripts**: Did all SQL scripts run without errors?
✅ **Tables**: Do all expected tables exist?
✅ **Policies**: Are RLS policies applied correctly?

## Getting Help

If you're still stuck:
1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
3. **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
4. **Discord**: Supabase Discord community

## Summary

You now have:
- ✅ Supabase account and project
- ✅ Database with all necessary tables
- ✅ Security policies (RLS) configured
- ✅ Sample data for testing
- ✅ Local environment connected
- ✅ Working authentication system

Your AuditX app should now be fully functional with a proper backend!
