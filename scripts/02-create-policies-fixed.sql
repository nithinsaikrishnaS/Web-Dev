-- RLS Policies (Fixed Version)
-- Run this after creating all tables

-- First, ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage users" ON public.users;

DROP POLICY IF EXISTS "Users can view businesses in their region" ON public.businesses;
DROP POLICY IF EXISTS "Admins can manage all businesses" ON public.businesses;

DROP POLICY IF EXISTS "Everyone can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

DROP POLICY IF EXISTS "Everyone can view active templates" ON public.audit_templates;
DROP POLICY IF EXISTS "Admins can manage templates" ON public.audit_templates;

DROP POLICY IF EXISTS "Suppliers can view their tasks" ON public.supply_tasks;
DROP POLICY IF EXISTS "Suppliers can update their tasks" ON public.supply_tasks;

DROP POLICY IF EXISTS "Auditors can view their tasks" ON public.audit_tasks;
DROP POLICY IF EXISTS "Admins can manage audit tasks" ON public.audit_tasks;

DROP POLICY IF EXISTS "Auditors can manage their submissions" ON public.audit_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.audit_submissions;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Regions policies (admins only)
CREATE POLICY "Admins can manage regions" ON public.regions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies
CREATE POLICY "Everyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit templates policies
CREATE POLICY "Everyone can view active templates" ON public.audit_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.audit_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Businesses policies
CREATE POLICY "Users can view businesses" ON public.businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all businesses" ON public.businesses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Suppliers policies
CREATE POLICY "Suppliers can view their own profile" ON public.suppliers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Suppliers can update their own profile" ON public.suppliers
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auditors policies
CREATE POLICY "Auditors can view their own profile" ON public.auditors
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Auditors can update their own profile" ON public.auditors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage auditors" ON public.auditors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Supply tasks policies
CREATE POLICY "Suppliers can view their tasks" ON public.supply_tasks
  FOR SELECT USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can update their tasks" ON public.supply_tasks
  FOR UPDATE USING (
    supplier_id IN (
      SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage supply tasks" ON public.supply_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit tasks policies
CREATE POLICY "Auditors can view their tasks" ON public.audit_tasks
  FOR SELECT USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    ) OR auditor_id IS NULL
  );

CREATE POLICY "Admins can manage audit tasks" ON public.audit_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Audit submissions policies
CREATE POLICY "Auditors can manage their submissions" ON public.audit_submissions
  FOR ALL USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all submissions" ON public.audit_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
