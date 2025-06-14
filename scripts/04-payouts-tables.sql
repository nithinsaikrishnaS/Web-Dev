-- Add payout-related tables and functions

-- Create payout status enum
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create payout method enum
CREATE TYPE payout_method AS ENUM ('bank_transfer', 'paypal', 'stripe', 'check');

-- Update payouts table with more detailed structure
DROP TABLE IF EXISTS public.payouts;
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status payout_status DEFAULT 'pending',
  method payout_method DEFAULT 'bank_transfer',
  
  -- Audit details
  audit_submissions UUID[] DEFAULT '{}',
  audits_count INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  
  -- Payment processing
  transaction_id TEXT,
  stripe_payment_intent_id TEXT,
  bank_account_last_four VARCHAR(4),
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin fields
  processed_by UUID REFERENCES users(id),
  admin_notes TEXT,
  failure_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auditor bank accounts table
CREATE TABLE IF NOT EXISTS public.auditor_bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE,
  
  -- Bank details
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number_encrypted TEXT NOT NULL, -- Store encrypted
  routing_number_encrypted TEXT NOT NULL, -- Store encrypted
  account_type VARCHAR(20) DEFAULT 'checking',
  
  -- Display info (last 4 digits)
  account_last_four VARCHAR(4) NOT NULL,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_method TEXT,
  
  -- Status
  is_primary BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(auditor_id, is_primary) -- Only one primary account per auditor
);

-- Create payout settings table
CREATE TABLE IF NOT EXISTS public.auditor_payout_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE UNIQUE,
  
  -- Payout preferences
  minimum_payout_amount DECIMAL(10,2) DEFAULT 100.00,
  payout_frequency VARCHAR(20) DEFAULT 'weekly', -- weekly, biweekly, monthly
  preferred_method payout_method DEFAULT 'bank_transfer',
  auto_payout_enabled BOOLEAN DEFAULT true,
  
  -- Goals and targets
  monthly_goal DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create earnings summary view
CREATE OR REPLACE VIEW auditor_earnings_summary AS
SELECT 
  a.id as auditor_id,
  a.user_id,
  u.full_name,
  u.email,
  u.city,
  
  -- Current month earnings
  COALESCE(SUM(CASE 
    WHEN DATE_TRUNC('month', asub.submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND asub.is_approved = true
    THEN at.payout_amount 
    ELSE 0 
  END), 0) as current_month_earnings,
  
  -- Total earnings
  COALESCE(SUM(CASE 
    WHEN asub.is_approved = true 
    THEN at.payout_amount 
    ELSE 0 
  END), 0) as total_earnings,
  
  -- Pending earnings (approved but not paid)
  COALESCE(SUM(CASE 
    WHEN asub.is_approved = true 
    AND NOT EXISTS (
      SELECT 1 FROM payouts p 
      WHERE asub.id = ANY(p.audit_submissions) 
      AND p.status = 'completed'
    )
    THEN at.payout_amount 
    ELSE 0 
  END), 0) as pending_earnings,
  
  -- Audit counts
  COUNT(CASE 
    WHEN DATE_TRUNC('month', asub.submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND asub.is_approved = true
    THEN 1 
  END) as current_month_audits,
  
  COUNT(CASE 
    WHEN asub.is_approved = true 
    THEN 1 
  END) as total_audits,
  
  -- Average rating
  ROUND(AVG(CASE 
    WHEN asub.is_approved = true 
    THEN (asub.submission_data->>'overall_rating')::DECIMAL 
  END), 2) as average_rating,
  
  -- Last payout
  (SELECT MAX(completed_at) FROM payouts WHERE auditor_id = a.id AND status = 'completed') as last_payout_date

FROM auditors a
JOIN users u ON a.user_id = u.id
LEFT JOIN audit_submissions asub ON a.id = asub.auditor_id
LEFT JOIN audit_tasks at ON asub.task_id = at.id
GROUP BY a.id, a.user_id, u.full_name, u.email, u.city;

-- Enable RLS
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditor_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditor_payout_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payouts
CREATE POLICY "Auditors can view their own payouts" ON public.payouts
  FOR SELECT USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payouts" ON public.payouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage payouts" ON public.payouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for bank accounts
CREATE POLICY "Auditors can manage their own bank accounts" ON public.auditor_bank_accounts
  FOR ALL USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view bank accounts" ON public.auditor_bank_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for payout settings
CREATE POLICY "Auditors can manage their own payout settings" ON public.auditor_payout_settings
  FOR ALL USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
  );

-- Function to create automatic payouts
CREATE OR REPLACE FUNCTION create_automatic_payout(p_auditor_id UUID)
RETURNS UUID AS $$
DECLARE
  v_payout_id UUID;
  v_settings RECORD;
  v_pending_amount DECIMAL;
  v_submissions UUID[];
BEGIN
  -- Get auditor payout settings
  SELECT * INTO v_settings 
  FROM auditor_payout_settings 
  WHERE auditor_id = p_auditor_id;
  
  -- If no settings, use defaults
  IF v_settings IS NULL THEN
    INSERT INTO auditor_payout_settings (auditor_id) 
    VALUES (p_auditor_id);
    
    SELECT * INTO v_settings 
    FROM auditor_payout_settings 
    WHERE auditor_id = p_auditor_id;
  END IF;
  
  -- Calculate pending earnings
  SELECT 
    COALESCE(SUM(at.payout_amount), 0),
    ARRAY_AGG(asub.id)
  INTO v_pending_amount, v_submissions
  FROM audit_submissions asub
  JOIN audit_tasks at ON asub.task_id = at.id
  WHERE asub.auditor_id = p_auditor_id
    AND asub.is_approved = true
    AND NOT EXISTS (
      SELECT 1 FROM payouts p 
      WHERE asub.id = ANY(p.audit_submissions) 
      AND p.status IN ('completed', 'processing', 'pending')
    );
  
  -- Check if minimum payout amount is met
  IF v_pending_amount >= v_settings.minimum_payout_amount THEN
    INSERT INTO payouts (
      auditor_id,
      amount,
      audit_submissions,
      audits_count,
      period_start,
      period_end,
      status
    ) VALUES (
      p_auditor_id,
      v_pending_amount,
      v_submissions,
      array_length(v_submissions, 1),
      CURRENT_DATE - INTERVAL '1 week',
      CURRENT_DATE,
      'pending'
    ) RETURNING id INTO v_payout_id;
  END IF;
  
  RETURN v_payout_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update payout status
CREATE OR REPLACE FUNCTION update_payout_status(
  p_payout_id UUID,
  p_status payout_status,
  p_transaction_id TEXT DEFAULT NULL,
  p_admin_notes TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payouts SET
    status = p_status,
    transaction_id = COALESCE(p_transaction_id, transaction_id),
    admin_notes = COALESCE(p_admin_notes, admin_notes),
    failure_reason = COALESCE(p_failure_reason, failure_reason),
    processed_at = CASE WHEN p_status = 'processing' THEN NOW() ELSE processed_at END,
    completed_at = CASE WHEN p_status = 'completed' THEN NOW() ELSE completed_at END,
    processed_by = auth.uid(),
    updated_at = NOW()
  WHERE id = p_payout_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO auditor_payout_settings (auditor_id, minimum_payout_amount, monthly_goal) 
SELECT id, 100.00, 3000.00 FROM auditors LIMIT 3;

INSERT INTO auditor_bank_accounts (auditor_id, bank_name, account_holder_name, account_number_encrypted, routing_number_encrypted, account_last_four, is_verified)
SELECT 
  id, 
  'Chase Bank', 
  'John Doe', 
  'encrypted_account_123', 
  'encrypted_routing_456', 
  '1234', 
  true 
FROM auditors LIMIT 1;
