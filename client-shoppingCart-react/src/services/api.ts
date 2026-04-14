// src/services/api.ts
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://localhost:7222/api";

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

const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {})
});

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch { return null; }
};

// --- API Calls ---

export const productApi = {
  // GET api/Product
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/Product`);
    return res.json();
  },
  
  // GET api/Product/desc/{description} - תואם לתמונה שלך!
  getByBarcode: async (description: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/Product/desc/${encodeURIComponent(description.trim())}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    } catch { return null; }
  },

  // PUT api/Product/{id}/count?count={count} - עדכון מלאי
  updateStock: async (id: number, count: number) => {
    return fetch(`${API_BASE_URL}/Product/${id}/count?count=${count}`, {
      method: "PUT",
      headers: getHeaders()
    });
  },

  // POST api/Product - הוספת מוצר חדש (למנהל)
  add: async (p: any) => {
    const res = await fetch(`${API_BASE_URL}/Product`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(p)
    });
    return res.json();
  }
};

export const cartApi = {
  // GET api/Cart
  getMyCart: async () => {
    const res = await fetch(`${API_BASE_URL}/Cart`, { headers: getHeaders() });
    return res.ok ? res.json() : null;
  },

  // PUT api/Cart/{idCart}/product/{idProd} - הוספה לסל
  addProduct: async (cartId: number, productId: number) => 
    fetch(`${API_BASE_URL}/Cart/${cartId}/product/${productId}`, { 
      method: "PUT", 
      headers: getHeaders() 
    }),

  // DELETE api/Cart/{idCart}/product/{idProd} - הסרה מהסל
  removeProduct: async (cartId: number, productId: number) => 
    fetch(`${API_BASE_URL}/Cart/${cartId}/product/${productId}`, { 
      method: "DELETE", 
      headers: getHeaders() 
    }),

  // DELETE api/Cart/{id} - ניקוי כל הסל
  // חפשי את clearCart בתוך cartApi ושני לזה:
  clearCart: async (cartId: number) => {
    const res = await fetch(`${API_BASE_URL}/Cart/${cartId}`, { 
      method: "DELETE", 
      headers: getHeaders() 
    });
    if (!res.ok) throw new Error("השרת נכשל במחיקת העגלה");
    return res;
  }
};





export const discountApi = {
  // GET api/Discount
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/Discount`);
    return res.json();
  },
  
  // POST api/Discount
  create: async (d: any) => 
    fetch(`${API_BASE_URL}/Discount`, { 
      method: "POST", 
      headers: getHeaders(), 
      body: JSON.stringify(d) 
    })
};

export const authApi = {
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST", // וודאי שזה POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  }
};