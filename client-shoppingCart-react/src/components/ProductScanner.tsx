import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ShoppingCart, Tag, Minus, Plus, AlertTriangle } from "lucide-react";
import { productApi, Product, getUserRole } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductScanner = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, discounts } = useCart();

  // בדיקת מבצע פעיל למוצר שנמצא
  const activeDiscount = useMemo(() => 
    foundProduct ? discounts.find(d => d.productId === foundProduct.id) : null
  , [foundProduct, discounts]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const product = await productApi.getByBarcode(query);
      if (product) {
        setFoundProduct(product);
        setQuantity(1);
      } else {
        toast.error("מוצר לא נמצא במערכת");
        setFoundProduct(null);
      }
    } catch {
      toast.error("שגיאה בתקשורת עם השרת");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async () => {
    if (!foundProduct) return;
    if (quantity > foundProduct.numInStock) {
      toast.error(`אין מספיק מלאי! זמין: ${foundProduct.numInStock}`);
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(foundProduct);
      }
      toast.success(`${quantity} יחידות נוספו לסל`);
      setFoundProduct(null);
      setQuery("");
    } catch {
      toast.error("שגיאה בהוספה לסל");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 pt-24 space-y-6" dir="rtl">
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-secondary/40 border border-white/10 p-3 rounded-xl outline-none focus:border-primary transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="סרוק ברקוד או הקלד שם..."
        />
        <button onClick={handleSearch} className="bg-primary text-black px-4 rounded-xl hover:opacity-90 transition-all">
          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {foundProduct && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-secondary/20 border border-white/10 p-4 rounded-[2rem] relative overflow-hidden backdrop-blur-md"
          >
            {activeDiscount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black animate-pulse">
                מבצע!
              </div>
            )}

            <div className="flex gap-4 items-center mb-5">
              <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 overflow-hidden shrink-0">
                <img src={foundProduct.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold leading-tight">{foundProduct.description}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary text-2xl font-black italic">
                    ₪{activeDiscount ? (foundProduct.price * (1 - activeDiscount.discountPercent/100)).toFixed(2) : foundProduct.price}
                  </span>
                  {activeDiscount && <span className="text-xs line-through text-red-400 opacity-60">₪{foundProduct.price}</span>}
                </div>
                <div className={`text-[10px] mt-1 font-bold ${foundProduct.numInStock < 5 ? 'text-orange-400' : 'text-gray-400'}`}>
                  מלאי זמין: {foundProduct.numInStock}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl mb-4 border border-white/5">
              <span className="text-xs pr-2 font-bold text-gray-400">כמות:</span>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-white/5 rounded-lg hover:bg-white/10">-</button>
                <span className="font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-white/5 rounded-lg hover:bg-white/10">+</button>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              disabled={foundProduct.numInStock <= 0}
              className="w-full py-4 bg-primary text-black font-black rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-20"
            >
              {foundProduct.numInStock > 0 ? <><ShoppingCart size={20} /> הוסף לסל</> : "אזל מהמלאי"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductScanner;