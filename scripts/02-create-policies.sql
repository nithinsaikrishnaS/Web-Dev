-- RLS Policies

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

-- Businesses policies
CREATE POLICY "Users can view businesses in their region" ON public.businesses
  FOR SELECT USING (
    city IN (
      SELECT unnest(cities) FROM public.regions r
      JOIN public.users u ON u.city = ANY(r.cities)
      WHERE u.id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all businesses" ON public.businesses
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

-- Audit tasks policies
CREATE POLICY "Auditors can view their tasks" ON public.audit_tasks
  FOR SELECT USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
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
