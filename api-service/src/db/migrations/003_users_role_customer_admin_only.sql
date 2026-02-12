-- Users have only two roles: customer (linked to customers table) or admin (linked to managers table)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'admin'));

-- Migrate any existing 'manager' role to 'admin'
UPDATE users SET role = 'admin' WHERE role = 'manager';
