-- Locations
INSERT INTO locations (name, code, country) VALUES
('United States', 'US', 'United States'),
('United Kingdom', 'UK', 'United Kingdom'),
('Germany', 'DE', 'Germany'),
('Japan', 'JP', 'Japan')
ON CONFLICT (code) DO NOTHING;

-- Products
INSERT INTO products (name, sku, product_line, price) VALUES
('Laptop Pro', 'ELEC-001', 'Electronics', 1299.99),
('Wireless Mouse', 'ELEC-002', 'Electronics', 49.99),
('Office Desk', 'FURN-001', 'Furniture', 399.99),
('Ergonomic Chair', 'FURN-002', 'Furniture', 299.99),
('Running Shoes', 'SPORT-001', 'Sports', 89.99),
('Yoga Mat', 'SPORT-002', 'Sports', 29.99)
ON CONFLICT (sku) DO NOTHING;
