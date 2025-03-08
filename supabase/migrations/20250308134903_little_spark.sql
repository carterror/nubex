/*
  # Admin Panel Schema Updates

  1. New Tables
    - category_images: Store category thumbnail images
    - supplier_documents: Store supplier agreements/contracts
    - product_variants: Handle product variations
    - product_images: Store product images
    - product_seo: Store SEO metadata
    - activity_logs: Track admin actions
    - user_roles: Manage admin user roles

  2. Changes
    - Add new columns to existing tables
    - Add necessary indexes and foreign keys
    - Enable RLS policies
*/

-- Add status to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'::text CHECK (status IN ('active', 'inactive'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- Create category_images table
CREATE TABLE IF NOT EXISTS category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add supplier fields
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'::text CHECK (status IN ('active', 'inactive'));
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS performance_metrics jsonb DEFAULT '{}'::jsonb;

-- Create supplier_documents table
CREATE TABLE IF NOT EXISTS supplier_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add product fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku text UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost numeric DEFAULT 0 CHECK (cost >= 0);
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS related_products uuid[] DEFAULT ARRAY[]::uuid[];

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text UNIQUE,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer DEFAULT 0,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create product_seo table
CREATE TABLE IF NOT EXISTS product_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'editor')),
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public users can view category images"
  ON category_images FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage category images"
  ON category_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Only authenticated users can view supplier documents"
  ON supplier_documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only authenticated users can manage supplier documents"
  ON supplier_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public users can view product variants"
  ON product_variants FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage product variants"
  ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public users can view product images"
  ON product_images FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage product images"
  ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public users can view product SEO"
  ON product_seo FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage product SEO"
  ON product_seo FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Only authenticated users can view activity logs"
  ON activity_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only authenticated users can insert activity logs"
  ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authenticated users can view user roles"
  ON user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON user_roles FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_category_images_updated_at
  BEFORE UPDATE ON category_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_documents_updated_at
  BEFORE UPDATE ON supplier_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_seo_updated_at
  BEFORE UPDATE ON product_seo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();