-- Supabase Database Schema for Shopping Cart App

-- Users Table (for future Supabase Auth integration)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_name TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Added password field
  role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  img TEXT, -- Base64 encoded image
  numInStock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discounts Table
CREATE TABLE IF NOT EXISTS discounts (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  discountPercent INTEGER NOT NULL CHECK (discountPercent >= 0 AND discountPercent <= 100),
  numInDiscount INTEGER NOT NULL DEFAULT 1,
  productId INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carts Table
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  idUser TEXT NOT NULL,
  sum DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart Items Table (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cartId INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  productId INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cartId, productId)
);

-- Enable Row Level Security (RLS) - DISABLED for users table to allow login
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- Users table RLS disabled for authentication purposes
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for Products (Read for all, Insert/Update for authenticated users)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for Discounts (Read for all, Insert for authenticated users)
CREATE POLICY "Discounts are viewable by everyone" ON discounts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert discounts" ON discounts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for Carts (Users can only access their own carts)
CREATE POLICY "Users can view their own carts" ON carts
  FOR SELECT USING (auth.uid()::text = idUser);

CREATE POLICY "Users can insert their own carts" ON carts
  FOR INSERT WITH CHECK (auth.uid()::text = idUser);

CREATE POLICY "Users can update their own carts" ON carts
  FOR UPDATE USING (auth.uid()::text = idUser);

-- Policies for Cart Items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cartId 
      AND auth.uid()::text = carts.idUser
    )
  );

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cartId 
      AND auth.uid()::text = carts.idUser
    )
  );

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cartId 
      AND auth.uid()::text = carts.idUser
    )
  );

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cartId 
      AND auth.uid()::text = carts.idUser
    )
  );

-- Insert some sample data
INSERT INTO users (email, user_name, password, role) VALUES
('admin@smartcart.com', 'admin', 'admin123', 'Admin'),
('user@smartcart.com', 'user', 'user123', 'User')
ON CONFLICT DO NOTHING;

INSERT INTO products (description, price, img, numInStock) VALUES
('חלב תנובה 3%', 6.90, '', 50),
('לחם פרוסים שחור', 12.50, '', 30),
('ביצים לבנות מדיום', 13.90, '', 40),
('עגבניות שרי', 8.50, '', 25),
('מלפפונים', 5.90, '', 35)
ON CONFLICT DO NOTHING;

INSERT INTO discounts (description, discountPercent, numInDiscount, productId) VALUES
('מבצע חלב - קנה 2 תשלם למחיר אחד', 50, 2, 1),
'מבצע לחם - 10% הנחה', 10, 1, 2)
ON CONFLICT DO NOTHING;
