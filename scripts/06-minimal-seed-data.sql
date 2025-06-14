-- Minimal seed data to test the system
-- Run this after policies are applied

-- Insert sample regions
INSERT INTO public.regions (name, cities, pincodes) VALUES
('Test Region', ARRAY['Test City'], ARRAY['12345'])
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name, description, payout_amount) VALUES
('Test Category', 'Test category for development', 100.00)
ON CONFLICT DO NOTHING;

-- Insert a test admin user (you'll need to sign up first, then update the role)
-- This is just a placeholder - you'll need to update with actual user ID after signup
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Insert sample audit template
INSERT INTO public.audit_templates (category_id, name, template_data) 
SELECT 
  c.id,
  'Basic Test Audit',
  '{
    "sections": [
      {
        "title": "General Check",
        "questions": [
          {
            "id": "cleanliness",
            "type": "rating",
            "question": "Rate overall cleanliness",
            "scale": 5,
            "required": true
          }
        ]
      }
    ]
  }'::jsonb
FROM public.categories c 
WHERE c.name = 'Test Category'
LIMIT 1
ON CONFLICT DO NOTHING;
