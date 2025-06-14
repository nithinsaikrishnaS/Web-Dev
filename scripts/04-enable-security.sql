-- Step 5: Enable Row Level Security
-- Run this after all tables are created

-- Enable RLS on all tables
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

-- Create basic policies (very permissive for initial testing)

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow everyone to read categories and regions (public data)
CREATE POLICY "Everyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view regions" ON public.regions
  FOR SELECT USING (true);

-- Allow everyone to view businesses (for now)
CREATE POLICY "Everyone can view businesses" ON public.businesses
  FOR SELECT USING (true);

-- Allow everyone to view audit templates
CREATE POLICY "Everyone can view templates" ON public.audit_templates
  FOR SELECT USING (true);

-- Basic policies for user-specific tables
CREATE POLICY "Users can view their supplier profile" ON public.suppliers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their auditor profile" ON public.auditors
  FOR SELECT USING (user_id = auth.uid());

-- Success message
SELECT 'Row Level Security enabled successfully! ✅' as result;
