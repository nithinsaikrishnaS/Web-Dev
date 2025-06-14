-- Insert sample regions
INSERT INTO public.regions (name, cities, pincodes) VALUES
('North Delhi', ARRAY['Delhi', 'New Delhi', 'Gurgaon'], ARRAY['110001', '110002', '122001']),
('Mumbai Metro', ARRAY['Mumbai', 'Navi Mumbai', 'Thane'], ARRAY['400001', '400002', '400601']),
('Bangalore Urban', ARRAY['Bangalore', 'Bengaluru'], ARRAY['560001', '560002', '560100']);

-- Insert sample categories
INSERT INTO public.categories (name, description, payout_amount) VALUES
('Restaurant', 'Food service establishments', 500.00),
('Retail Store', 'General retail businesses', 300.00),
('Healthcare', 'Medical facilities and clinics', 800.00),
('Education', 'Schools and educational institutions', 600.00),
('Manufacturing', 'Manufacturing and production facilities', 1000.00);

-- Insert sample audit templates
INSERT INTO public.audit_templates (category_id, name, template_data) VALUES
(
  (SELECT id FROM public.categories WHERE name = 'Restaurant' LIMIT 1),
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
      },
      {
        "title": "Customer Area",
        "questions": [
          {
            "id": "seating_cleanliness",
            "type": "rating",
            "question": "Rate the seating area cleanliness",
            "scale": 5,
            "required": true
          },
          {
            "id": "customer_area_photo",
            "type": "photo",
            "question": "Take a photo of the customer seating area",
            "required": true
          }
        ]
      }
    ]
  }'
),
(
  (SELECT id FROM public.categories WHERE name = 'Retail Store' LIMIT 1),
  'Retail Store Audit',
  '{
    "sections": [
      {
        "title": "Store Layout",
        "questions": [
          {
            "id": "product_display",
            "type": "rating",
            "question": "Rate the product display organization",
            "scale": 5,
            "required": true
          },
          {
            "id": "store_entrance_photo",
            "type": "photo",
            "question": "Take a photo of the store entrance",
            "required": true
          }
        ]
      }
    ]
  }'
);

-- Create function to automatically create audit tasks when business is created
CREATE OR REPLACE FUNCTION create_audit_task_for_business()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_tasks (
    business_id,
    template_id,
    title,
    description,
    payout_amount,
    created_by
  )
  SELECT 
    NEW.id,
    at.id,
    'Initial Audit for ' || NEW.name,
    'Automated audit task created for new business onboarding',
    c.payout_amount,
    NEW.created_by
  FROM public.audit_templates at
  JOIN public.categories c ON at.category_id = c.id
  WHERE c.id = NEW.category_id AND at.is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_create_audit_task
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_task_for_business();
