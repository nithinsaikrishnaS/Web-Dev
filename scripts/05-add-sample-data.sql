-- Step 6: Add Sample Data
-- Run this after security is enabled

-- Insert sample regions
INSERT INTO public.regions (name, cities, pincodes) VALUES
('North Delhi', ARRAY['Delhi', 'New Delhi', 'Gurgaon'], ARRAY['110001', '110002', '122001']),
('Mumbai Metro', ARRAY['Mumbai', 'Navi Mumbai', 'Thane'], ARRAY['400001', '400002', '400601']),
('Bangalore Urban', ARRAY['Bangalore', 'Bengaluru'], ARRAY['560001', '560002', '560100'])
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name, description, payout_amount) VALUES
('Restaurant', 'Food service establishments', 500.00),
('Retail Store', 'General retail businesses', 300.00),
('Healthcare', 'Medical facilities and clinics', 800.00),
('Education', 'Schools and educational institutions', 600.00),
('Manufacturing', 'Manufacturing and production facilities', 1000.00)
ON CONFLICT DO NOTHING;

-- Insert sample audit template
INSERT INTO public.audit_templates (category_id, name, template_data) 
SELECT 
  c.id,
  'Restaurant Safety Audit',
  '{
    "sections": [
      {
        "title": "Kitchen Safety",
        "questions": [
          {
            "id": "kitchen_cleanliness",
            "type": "rating",
            "question": "Rate the overall kitchen cleanliness",
            "scale": 5,
            "required": true
          },
          {
            "id": "food_storage",
            "type": "multiple_choice",
            "question": "Are food items stored at proper temperatures?",
            "options": ["Yes", "No", "Partially"],
            "required": true
          },
          {
            "id": "kitchen_photo",
            "type": "photo",
            "question": "Take a photo of the kitchen area",
            "required": true
          }
        ]
      }
    ]
  }'::jsonb
FROM public.categories c 
WHERE c.name = 'Restaurant'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Sample data added successfully! ✅' as result;
