import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { cartApi, discountApi, Product, Discount, Cart } from "@/services/api";
import { toast } from "sonner";

export interface CartContextType {
  cart: Cart | null;
  discounts: Discount[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  subtotal: number;
  savings: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const fetchCart = async () => {
    try {
      const [cartData, discountData] = await Promise.all([
        cartApi.getMyCart(),
        discountApi.getAll()
      ]);
      setCart(cartData);
      setDiscounts(discountData);
    } catch (err) { console.error("Error fetching cart:", err); }
  };

  useEffect(() => { fetchCart(); }, []);

  const totals = useMemo(() => {
    if (!cart?.products) return { subtotal: 0, savings: 0, finalTotal: 0 };
    let sub = 0;
    let save = 0;
    const counts: any = {};
    cart.products.forEach(p => {
      sub += p.price;
      counts[p.id] = (counts[p.id] || 0) + 1;
    });
    Object.keys(counts).forEach(pid => {
      const pId = Number(pid);
      const qty = counts[pId];
      const disc = discounts.find(d => d.productId === pId);
      const price = cart.products?.find(p => p.id === pId)?.price || 0;
      if (disc && qty >= disc.numInDiscount) {
        const times = Math.floor(qty / disc.numInDiscount);
        save += (price * (disc.discountPercent / 100)) * (times * disc.numInDiscount);
      }
    });
    return { subtotal: sub, savings: save, finalTotal: sub - save };
  }, [cart, discounts]);

  // פונקציית המחיקה המתוקנת
  const clearCart = async () => {
    if (!cart?.id) return;

    try {
      // 1. קריאה לשרת (שעכשיו יש לו HttpDelete מתאים!)
      await cartApi.clearCart(cart.id);
      
      // 2. איפוס ה-State המקומי מיד כדי שה-UI יתנקה
      setCart(null); 
      
      // 3. טעינה מחדש מהשרת כדי לקבל עגלה ריקה ונקייה
      await fetchCart();
      
    } catch (err) {
      console.error("המחיקה נכשלה:", err);
      toast.error("לא הצלחנו לרוקן את העגלה");
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, discounts, fetchCart, clearCart,
      subtotal: totals.subtotal,
      savings: totals.savings,
      finalTotal: totals.finalTotal,
      addItem: async (p) => { if(cart) { await cartApi.addProduct(cart.id, p.id); await fetchCart(); } },
      removeItem: async (productId) => { if(cart) { await cartApi.removeProduct(cart.id, productId); await fetchCart(); } },
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};