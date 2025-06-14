-- Add Stripe integration tables and columns

-- Add Stripe account info to auditors table
ALTER TABLE public.auditors 
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT false;

-- Create Stripe transactions table for tracking
CREATE TABLE IF NOT EXISTS public.stripe_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payout_id UUID REFERENCES payouts(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES auditors(id) ON DELETE CASCADE,
  
  -- Stripe IDs
  stripe_transfer_id TEXT UNIQUE,
  stripe_account_id TEXT NOT NULL,
  
  -- Transaction details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status TEXT NOT NULL, -- pending, paid, failed, canceled
  
  -- Stripe response data
  stripe_response JSONB,
  failure_code TEXT,
  failure_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create webhook events table for Stripe webhooks
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.stripe_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Stripe transactions
CREATE POLICY "Auditors can view their own transactions" ON public.stripe_transactions
  FOR SELECT USING (
    auditor_id IN (
      SELECT id FROM public.auditors WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all transactions" ON public.stripe_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage transactions" ON public.stripe_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for webhook events (admin only)
CREATE POLICY "Admins can manage webhook events" ON public.stripe_webhook_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to process Stripe payout
CREATE OR REPLACE FUNCTION process_stripe_payout(
  p_payout_id UUID,
  p_stripe_account_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_payout RECORD;
  v_auditor RECORD;
  v_result JSONB;
BEGIN
  -- Get payout details
  SELECT * INTO v_payout FROM payouts WHERE id = p_payout_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payout not found');
  END IF;
  
  -- Get auditor details
  SELECT * INTO v_auditor FROM auditors WHERE id = v_payout.auditor_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Auditor not found');
  END IF;
  
  -- Update payout status to processing
  UPDATE payouts 
  SET 
    status = 'processing',
    processed_at = NOW(),
    processed_by = auth.uid()
  WHERE id = p_payout_id;
  
  -- Create transaction record (will be updated by webhook)
  INSERT INTO stripe_transactions (
    payout_id,
    auditor_id,
    stripe_account_id,
    amount,
    status
  ) VALUES (
    p_payout_id,
    v_payout.auditor_id,
    p_stripe_account_id,
    v_payout.amount,
    'pending'
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'payout_id', p_payout_id,
    'amount', v_payout.amount,
    'stripe_account_id', p_stripe_account_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update Stripe account status
CREATE OR REPLACE FUNCTION update_stripe_account_status(
  p_auditor_id UUID,
  p_stripe_account_id TEXT,
  p_charges_enabled BOOLEAN,
  p_payouts_enabled BOOLEAN,
  p_details_submitted BOOLEAN
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE auditors 
  SET 
    stripe_account_id = p_stripe_account_id,
    stripe_charges_enabled = p_charges_enabled,
    stripe_payouts_enabled = p_payouts_enabled,
    stripe_details_submitted = p_details_submitted,
    stripe_onboarding_completed = (p_charges_enabled AND p_payouts_enabled AND p_details_submitted),
    updated_at = NOW()
  WHERE id = p_auditor_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
