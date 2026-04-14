import { supabase } from '@/lib/supabase';

// --- Interfaces ---
export interface Product {
  id: number;
  description: string;
  price: number;
  img: string;
  numInStock: number;
}

export interface Discount {
  id: number;
  description: string;
  numInDiscount: number;
  discountPercent: number;
  productId: number;
}

export interface Cart {
  id: number;
  idUser: string;
  sum: number;
  products?: Product[];
}

// --- Auth Helpers ---
export const getToken = () => localStorage.getItem("auth_token");
export const setToken = (token: string | null) => {
  if (token) localStorage.setItem("auth_token", token);
  else {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_name");
  }
};

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    // For demo purposes, we'll use a simple check
    // In production, you should decode the JWT properly
    return localStorage.getItem("user_role") || null;
  } catch { return null; }
};

// --- Supabase API Calls ---

export const productApi = {
  // GET all products
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },
  
  // GET product by description/barcode
  getByBarcode: async (description: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('description', `%${description.trim()}%`)
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  // Update stock
  updateStock: async (id: number, count: number) => {
    const { error } = await supabase
      .from('products')
      .update({ numInStock: count })
      .eq('id', id);
    
    if (error) throw error;
    return { ok: true };
  },

  // Add new product (admin only)
  add: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const discountApi = {
  // GET all discounts
  getAll: async (): Promise<Discount[]> => {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },
  
  // Create new discount (admin only)
  create: async (discount: Omit<Discount, 'id'>) => {
    const { data, error } = await supabase
      .from('discounts')
      .insert(discount)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Simple demo authentication - GUARANTEED TO WORK
export const authApi = {
  login: async (credentials: { userName: string; password: string }) => {
    const { userName, password } = credentials;
    
    console.log('🔐 Demo Login attempt:', { userName, password: '***' });
    
    // Simple hardcoded login - no database needed
    if (userName === 'admin' && password === 'admin123') {
      console.log('✅ Admin login successful!');
      
      const fakeToken = 'demo-admin-token-123';
      setToken(fakeToken);
      localStorage.setItem('user_name', 'admin');
      localStorage.setItem('user_role', 'Admin');
      
      return { token: fakeToken };
    } 
    else if (userName === 'user' && password === 'user123') {
      console.log('✅ User login successful!');
      
      const fakeToken = 'demo-user-token-456';
      setToken(fakeToken);
      localStorage.setItem('user_name', 'user');
      localStorage.setItem('user_role', 'User');
      
      return { token: fakeToken };
    }
    
    console.error('❌ Invalid credentials');
    throw new Error('Invalid credentials');
  }
};
