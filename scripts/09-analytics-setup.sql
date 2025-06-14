-- Analytics Setup for Payout Analytics
-- Create views and functions for advanced analytics

-- Create analytics views for better performance
CREATE OR REPLACE VIEW public.auditor_performance_metrics AS
SELECT 
  a.id as auditor_id,
  a.user_id,
  u.full_name,
  u.email,
  u.city,
  u.state,
  
  -- Earnings metrics
  COALESCE(SUM(CASE WHEN at.payout_amount IS NOT NULL AND s.is_approved THEN at.payout_amount ELSE 0 END), 0) as total_earnings,
  COALESCE(COUNT(CASE WHEN s.is_approved THEN 1 END), 0) as completed_audits,
  COALESCE(COUNT(s.id), 0) as total_submissions,
  
  -- Current month metrics
  COALESCE(SUM(CASE 
    WHEN at.payout_amount IS NOT NULL 
    AND s.is_approved 
    AND DATE_TRUNC('month', s.submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
    THEN at.payout_amount ELSE 0 END), 0) as current_month_earnings,
  COALESCE(COUNT(CASE 
    WHEN s.is_approved 
    AND DATE_TRUNC('month', s.submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
    THEN 1 END), 0) as current_month_audits,
    
  -- Performance metrics
  CASE 
    WHEN COUNT(s.id) > 0 
    THEN ROUND((COUNT(CASE WHEN s.is_approved THEN 1 END)::DECIMAL / COUNT(s.id)) * 100, 2)
    ELSE 0 
  END as approval_rate,
  
  CASE 
    WHEN COUNT(CASE WHEN s.is_approved THEN 1 END) > 0 
    THEN ROUND(SUM(CASE WHEN at.payout_amount IS NOT NULL AND s.is_approved THEN at.payout_amount ELSE 0 END) / COUNT(CASE WHEN s.is_approved THEN 1 END), 2)
    ELSE 0 
  END as avg_earning_per_audit,
  
  -- Rating metrics
  CASE 
    WHEN COUNT(CASE WHEN s.submission_data->>'overall_rating' IS NOT NULL THEN 1 END) > 0
    THEN ROUND(AVG((s.submission_data->>'overall_rating')::DECIMAL), 2)
    ELSE 0
  END as avg_rating,
  
  -- Activity metrics
  MIN(s.submitted_at) as first_audit_date,
  MAX(s.submitted_at) as last_audit_date,
  
  -- Streak calculation (days since last audit)
  CASE 
    WHEN MAX(s.submitted_at) IS NOT NULL 
    THEN EXTRACT(DAY FROM (CURRENT_DATE - MAX(s.submitted_at)::DATE))
    ELSE NULL 
  END as days_since_last_audit

FROM public.auditors a
LEFT JOIN public.users u ON a.user_id = u.id
LEFT JOIN public.audit_submissions s ON a.id = s.auditor_id
LEFT JOIN public.audit_tasks at ON s.task_id = at.id
GROUP BY a.id, a.user_id, u.full_name, u.email, u.city, u.state;

-- Create monthly earnings trend view
CREATE OR REPLACE VIEW public.monthly_earnings_trend AS
SELECT 
  a.id as auditor_id,
  u.full_name,
  DATE_TRUNC('month', s.submitted_at) as month,
  COALESCE(SUM(CASE WHEN s.is_approved AND at.payout_amount IS NOT NULL THEN at.payout_amount ELSE 0 END), 0) as earnings,
  COALESCE(COUNT(CASE WHEN s.is_approved THEN 1 END), 0) as completed_audits,
  COALESCE(COUNT(s.id), 0) as total_submissions,
  CASE 
    WHEN COUNT(s.id) > 0 
    THEN ROUND((COUNT(CASE WHEN s.is_approved THEN 1 END)::DECIMAL / COUNT(s.id)) * 100, 2)
    ELSE 0 
  END as approval_rate
FROM public.auditors a
LEFT JOIN public.users u ON a.user_id = u.id
LEFT JOIN public.audit_submissions s ON a.id = s.auditor_id
LEFT JOIN public.audit_tasks at ON s.task_id = at.id
WHERE s.submitted_at IS NOT NULL
GROUP BY a.id, u.full_name, DATE_TRUNC('month', s.submitted_at)
ORDER BY month DESC;

-- Create category performance view
CREATE OR REPLACE VIEW public.category_performance AS
SELECT 
  a.id as auditor_id,
  u.full_name,
  c.name as category_name,
  COALESCE(SUM(CASE WHEN s.is_approved AND at.payout_amount IS NOT NULL THEN at.payout_amount ELSE 0 END), 0) as earnings,
  COALESCE(COUNT(CASE WHEN s.is_approved THEN 1 END), 0) as completed_audits,
  COALESCE(COUNT(s.id), 0) as total_submissions,
  CASE 
    WHEN COUNT(s.id) > 0 
    THEN ROUND((COUNT(CASE WHEN s.is_approved THEN 1 END)::DECIMAL / COUNT(s.id)) * 100, 2)
    ELSE 0 
  END as approval_rate,
  CASE 
    WHEN COUNT(CASE WHEN s.submission_data->>'overall_rating' IS NOT NULL THEN 1 END) > 0
    THEN ROUND(AVG((s.submission_data->>'overall_rating')::DECIMAL), 2)
    ELSE 0
  END as avg_rating
FROM public.auditors a
LEFT JOIN public.users u ON a.user_id = u.id
LEFT JOIN public.audit_submissions s ON a.id = s.auditor_id
LEFT JOIN public.audit_tasks at ON s.task_id = at.id
LEFT JOIN public.businesses b ON at.business_id = b.id
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE s.submitted_at IS NOT NULL AND c.name IS NOT NULL
GROUP BY a.id, u.full_name, c.name;

-- Function to get auditor analytics data
CREATE OR REPLACE FUNCTION get_auditor_analytics(p_auditor_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_performance RECORD;
  v_monthly_data JSONB;
  v_category_data JSONB;
BEGIN
  -- Get performance metrics
  SELECT * INTO v_performance 
  FROM auditor_performance_metrics 
  WHERE (p_auditor_id IS NULL OR auditor_id = p_auditor_id)
  LIMIT 1;
  
  -- Get monthly trend data
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', month,
      'earnings', earnings,
      'completed_audits', completed_audits,
      'approval_rate', approval_rate
    ) ORDER BY month DESC
  ) INTO v_monthly_data
  FROM monthly_earnings_trend 
  WHERE (p_auditor_id IS NULL OR auditor_id = p_auditor_id)
  LIMIT 12;
  
  -- Get category performance data
  SELECT jsonb_agg(
    jsonb_build_object(
      'category', category_name,
      'earnings', earnings,
      'completed_audits', completed_audits,
      'approval_rate', approval_rate,
      'avg_rating', avg_rating
    )
  ) INTO v_category_data
  FROM category_performance 
  WHERE (p_auditor_id IS NULL OR auditor_id = p_auditor_id);
  
  -- Build result
  v_result := jsonb_build_object(
    'performance', row_to_json(v_performance),
    'monthly_trend', COALESCE(v_monthly_data, '[]'::jsonb),
    'category_performance', COALESCE(v_category_data, '[]'::jsonb)
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comparative analytics
CREATE OR REPLACE FUNCTION get_comparative_analytics()
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_top_performers JSONB;
  v_category_leaders JSONB;
  v_monthly_comparison JSONB;
BEGIN
  -- Get top performers
  SELECT jsonb_agg(
    jsonb_build_object(
      'auditor_id', auditor_id,
      'full_name', full_name,
      'total_earnings', total_earnings,
      'completed_audits', completed_audits,
      'approval_rate', approval_rate,
      'avg_rating', avg_rating
    ) ORDER BY total_earnings DESC
  ) INTO v_top_performers
  FROM auditor_performance_metrics
  WHERE completed_audits > 0
  LIMIT 10;
  
  -- Get category leaders
  SELECT jsonb_agg(
    jsonb_build_object(
      'category', category_name,
      'leader', full_name,
      'earnings', earnings,
      'completed_audits', completed_audits,
      'approval_rate', approval_rate
    )
  ) INTO v_category_leaders
  FROM (
    SELECT DISTINCT ON (category_name) 
      category_name, full_name, earnings, completed_audits, approval_rate
    FROM category_performance
    WHERE completed_audits > 0
    ORDER BY category_name, earnings DESC
  ) leaders;
  
  -- Get monthly comparison (last 6 months)
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', month,
      'total_earnings', total_earnings,
      'total_audits', total_audits,
      'avg_approval_rate', avg_approval_rate,
      'active_auditors', active_auditors
    ) ORDER BY month DESC
  ) INTO v_monthly_comparison
  FROM (
    SELECT 
      DATE_TRUNC('month', s.submitted_at) as month,
      SUM(CASE WHEN s.is_approved AND at.payout_amount IS NOT NULL THEN at.payout_amount ELSE 0 END) as total_earnings,
      COUNT(CASE WHEN s.is_approved THEN 1 END) as total_audits,
      ROUND(AVG(CASE 
        WHEN COUNT(sub.id) > 0 
        THEN (COUNT(CASE WHEN sub.is_approved THEN 1 END)::DECIMAL / COUNT(sub.id)) * 100
        ELSE 0 
      END), 2) as avg_approval_rate,
      COUNT(DISTINCT s.auditor_id) as active_auditors
    FROM audit_submissions s
    LEFT JOIN audit_tasks at ON s.task_id = at.id
    LEFT JOIN audit_submissions sub ON sub.auditor_id = s.auditor_id 
      AND DATE_TRUNC('month', sub.submitted_at) = DATE_TRUNC('month', s.submitted_at)
    WHERE s.submitted_at >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', s.submitted_at)
  ) monthly_stats
  LIMIT 6;
  
  -- Build result
  v_result := jsonb_build_object(
    'top_performers', COALESCE(v_top_performers, '[]'::jsonb),
    'category_leaders', COALESCE(v_category_leaders, '[]'::jsonb),
    'monthly_comparison', COALESCE(v_monthly_comparison, '[]'::jsonb)
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.auditor_performance_metrics TO authenticated;
GRANT SELECT ON public.monthly_earnings_trend TO authenticated;
GRANT SELECT ON public.category_performance TO authenticated;
