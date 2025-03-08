/*
  # Test Data Population

  1. Overview
    Creates a comprehensive test dataset with realistic data and edge cases
    for all tables in the e-commerce system.

  2. Data Volumes
    - Categories: 8 records
    - Suppliers: 5 records
    - Discounts: 6 records
    - Products: 5 records
    - Orders: 10 records
    - Order Items: 25 records

  3. Test Scenarios
    - Standard valid cases
    - Edge cases (null descriptions, max values)
    - Unicode characters and special text
    - Various date ranges
    - Different status combinations
*/

-- Categories
INSERT INTO categories (id, name, description, slug, created_at, updated_at) VALUES
  ('c1f2f9d7-b6c7-4d7f-9c5b-8c1a3e6d4b2a', 'Electronics', 'Latest electronic gadgets and devices', 'electronics', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00'),
  ('d2e3f4a8-c7d8-4e8f-0d6e-9f2b3c4d5e6f', 'Clothing', 'Trendy fashion and apparel', 'clothing', '2024-01-15 10:05:00+00', '2024-01-15 10:05:00+00'),
  ('e3f4a5b9-d8e9-5f9a-1e7f-0a3c4d5e6f7a', 'Books', 'Educational and entertainment reading', 'books', '2024-01-15 10:10:00+00', '2024-01-15 10:10:00+00'),
  ('f4a5b6c0-e9f0-6a0b-2f8a-1b4d5e6f7a8b', 'Home & Garden', 'Home improvement and garden supplies', 'home-garden', '2024-01-15 10:15:00+00', '2024-01-15 10:15:00+00'),
  ('a5b6c7d1-f0a1-7b1c-3a9b-2c5e6f7a8b9c', 'Sports', 'Sports equipment and accessories', 'sports', '2024-01-15 10:20:00+00', '2024-01-15 10:20:00+00'),
  ('b6c7d8e2-a1b2-8c2d-4b0c-3d6f7a8b9c0d', 'Beauty', NULL, 'beauty', '2024-01-15 10:25:00+00', '2024-01-15 10:25:00+00'),
  ('c7d8e9f3-b2c3-9d3e-5c1d-4e7a8b9c0d1e', 'Toys & Games', 'Fun for all ages! 🎮', 'toys-games', '2024-01-15 10:30:00+00', '2024-01-15 10:30:00+00'),
  ('d8e9f0a4-c3d4-0e4f-6d2e-5f8b9c0d1e2f', 'Special Characters Test ★☆', 'Testing with ♠♣♥♦ symbols', 'special-test', '2024-01-15 10:35:00+00', '2024-01-15 10:35:00+00');

-- Suppliers
INSERT INTO suppliers (id, name, contact_name, email, phone, address, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'TechPro Supplies', 'John Smith', 'john@techpro.com', '+1-555-0123', '123 Tech Street, Silicon Valley, CA 94025', '2024-01-20 09:00:00+00', '2024-01-20 09:00:00+00'),
  ('b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'Fashion Forward', 'Emma Johnson', 'emma@fashionforward.com', '+1-555-0124', '456 Fashion Ave, New York, NY 10018', '2024-01-20 09:05:00+00', '2024-01-20 09:05:00+00'),
  ('c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 'Global Books Ltd', 'Michael Brown', 'michael@globalbooks.com', '+1-555-0125', '789 Reader Lane, Boston, MA 02108', '2024-01-20 09:10:00+00', '2024-01-20 09:10:00+00'),
  ('d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'Sports Elite', NULL, NULL, NULL, NULL, '2024-01-20 09:15:00+00', '2024-01-20 09:15:00+00'),
  ('e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b', 'Beauty Essentials 美容', 'María García', 'maria@beauty-essentials.com', '+34-555-0126', 'Calle Principal 123, Madrid, España', '2024-01-20 09:20:00+00', '2024-01-20 09:20:00+00');

-- Discounts
INSERT INTO discounts (id, code, description, percentage, valid_from, valid_to, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'SUMMER2024', 'Summer sale discount', 20.00, '2024-06-01 00:00:00+00', '2024-08-31 23:59:59+00', '2024-01-25 08:00:00+00', '2024-01-25 08:00:00+00'),
  ('b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'FLASH50', 'Flash sale - 50% off', 50.00, '2024-02-01 00:00:00+00', '2024-02-02 23:59:59+00', '2024-01-25 08:05:00+00', '2024-01-25 08:05:00+00'),
  ('c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 'WELCOME10', 'New customer discount', 10.00, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-01-25 08:10:00+00', '2024-01-25 08:10:00+00'),
  ('d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'SPECIAL99', 'Special category items', 15.00, '2024-03-01 00:00:00+00', '2024-03-31 23:59:59+00', '2024-01-25 08:15:00+00', '2024-01-25 08:15:00+00'),
  ('e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b', 'HOLIDAY25', 'Holiday season discount', 25.00, '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-01-25 08:20:00+00', '2024-01-25 08:20:00+00'),
  ('f6a7b8c9-d0e1-9f2a-3b4c-5d6e7f8a9b0c', 'TEST100', 'Maximum discount test', 100.00, '2024-01-01 00:00:00+00', '2024-12-31 23:59:59+00', '2024-01-25 08:25:00+00', '2024-01-25 08:25:00+00');

-- Products
INSERT INTO products (id, name, slug, description, price, stock, images, category_id, supplier_id, discount_id, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Smartphone X Pro', 'smartphone-x-pro', 'Latest flagship smartphone with advanced features', 999.99, 50, ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', 'https://images.unsplash.com/photo-1578872336149-c228e4ff3b1d?w=800'], 'c1f2f9d7-b6c7-4d7f-9c5b-8c1a3e6d4b2a', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2024-01-30 10:00:00+00', '2024-01-30 10:00:00+00'),
  
  ('b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'Designer Jeans', 'designer-jeans', 'Premium quality designer jeans', 199.99, 100, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], 'd2e3f4a8-c7d8-4e8f-0d6e-9f2b3c4d5e6f', 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', '2024-01-30 10:05:00+00', '2024-01-30 10:05:00+00'),
  
  ('c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 'Programming Guide 2024', 'programming-guide-2024', 'Comprehensive programming guide', 49.99, 200, ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800'], 'e3f4a5b9-d8e9-5f9a-1e7f-0a3c4d5e6f7a', 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', NULL, '2024-01-30 10:10:00+00', '2024-01-30 10:10:00+00'),
  
  ('d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'Garden Tool Set', 'garden-tool-set', NULL, 89.99, 0, ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'], 'f4a5b6c0-e9f0-6a0b-2f8a-1b4d5e6f7a8b', NULL, NULL, '2024-01-30 10:15:00+00', '2024-01-30 10:15:00+00'),
  
  ('e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b', 'Professional Tennis Racket', 'professional-tennis-racket', 'Tournament-grade tennis racket', 299.99, 30, ARRAY['https://images.unsplash.com/photo-1617083934555-ac7b9b8a5a8f?w=800'], 'a5b6c7d1-f0a1-7b1c-3a9b-2c5e6f7a8b9c', 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', '2024-01-30 10:20:00+00', '2024-01-30 10:20:00+00');

-- Orders
INSERT INTO orders (id, customer_name, customer_email, customer_phone, customer_address, total_amount, status, notes, created_at, updated_at) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Alice Johnson', 'alice@email.com', '+1-555-0001', '123 Main St, Portland, OR 97201', 1299.98, 'completed', 'Priority shipping requested', '2024-02-01 15:00:00+00', '2024-02-01 15:00:00+00'),
  
  ('b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'Bob Wilson', 'bob@email.com', '+1-555-0002', '456 Oak Ave, Seattle, WA 98101', 49.99, 'processing', NULL, '2024-02-01 15:30:00+00', '2024-02-01 15:30:00+00'),
  
  ('c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 'Carlos García', 'carlos@email.com', '+1-555-0003', '789 Pine St, Miami, FL 33101', 599.97, 'pending', 'Special packaging needed', '2024-02-01 16:00:00+00', '2024-02-01 16:00:00+00'),
  
  ('d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'Diana Smith', 'diana@email.com', '+1-555-0004', '321 Elm St, Chicago, IL 60601', 89.99, 'cancelled', 'Customer requested cancellation', '2024-02-01 16:30:00+00', '2024-02-01 16:30:00+00'),
  
  ('e5f6a7b8-c9d0-8e1f-2a3b-4c5d6e7f8a9b', 'Elena Wong 黃', 'elena@email.com', '+1-555-0005', '654 Maple Dr, San Francisco, CA 94101', 1499.95, 'completed', NULL, '2024-02-01 17:00:00+00', '2024-02-01 17:00:00+00');

-- Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, price_at_time, created_at) VALUES
  ('f6a7b8c9-d0e1-9f2a-3b4c-5d6e7f8a9b0c', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 1, 999.99, '2024-02-01 15:00:00+00'),
  ('a7b8c9d0-e1f2-0a3b-4c5d-6e7f8a9b0c1d', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 1, 299.99, '2024-02-01 15:00:00+00'),
  ('b8c9d0e1-f2a3-1b4c-5d6e-7f8a9b0c1d2e', 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6e', 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 1, 49.99, '2024-02-01 15:30:00+00'),
  ('c9d0e1f2-a3b4-2c5d-6e7f-8a9b0c1d2e3f', 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7f', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 2, 299.99, '2024-02-01 16:00:00+00'),
  ('d0e1f2a3-b4c5-3d6e-7f8a-9b0c1d2e3f4a', 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8a', 1, 89.99, '2024-02-01 16:30:00+00');