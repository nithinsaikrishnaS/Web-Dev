-- Step 4: Create Task and Submission Tables
-- Run this after business tables are created

-- Supply tasks table
CREATE TABLE IF NOT EXISTS public.supply_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id),
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'to_do',
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit tasks table
CREATE TABLE IF NOT EXISTS public.audit_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES auditors(id),
  template_id UUID REFERENCES audit_templates(id),
  title TEXT NOT NULL,
  description TEXT,
  status audit_status DEFAULT 'pending',
  scheduled_date DATE,
  payout_amount DECIMAL(10,2) NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit submissions table
CREATE TABLE IF NOT EXISTS public.audit_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES audit_tasks(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES auditors(id),
  submission_data JSONB NOT NULL,
  photos TEXT[] DEFAULT '{}',
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id),
  is_approved BOOLEAN,
  feedback TEXT
);

-- Success message
SELECT 'Task tables created successfully! ✅' as result;
