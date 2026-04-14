import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, X, ArrowLeft, Image as ImageIcon, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // משכנו גם את savings וגם את subtotal מה-Context כדי להציג פירוט מלא
  const { cart, removeItem, clearCart, fetchCart, finalTotal, savings, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  const products = cart?.products || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
          />
          
          {/* Sidebar Panel */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1a1c1e] shadow-2xl z-[101] flex flex-col border-l border-white/5"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1c1e]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00e676]/10 rounded-lg">
                  <ShoppingCart className="text-[#00e676]" size={24} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">הסל שלי</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="p-6 bg-white/[0.02] rounded-full">
                    <ShoppingCart size={48} strokeWidth={1} />
                  </div>
                  <p className="font-bold">הסל שלך ריק כרגע</p>
                </div>
              ) : (
                products.map((product, index) => (
                  <div 
                    key={`${product.id}-${index}`}
                    className="group bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="w-16 h-16 bg-black/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                      {product.img ? (
                        <img src={product.img} alt={product.description} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-700" size={24} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{product.description}</h4>
                      <p className="text-[#00e676] font-black mt-1">₪{product.price.toFixed(2)}</p>
                    </div>

                    <button 
                      onClick={() => removeItem(product.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary - כאן הוספנו את החיסכון */}
            {products.length > 0 && (
              <div className="p-6 bg-[#1a1c1e] border-t border-white/10 space-y-4">
                
                {/* פירוט מחירים רק אם יש חיסכון */}
                {savings > 0 && (
                  <div className="space-y-2 px-1 border-b border-white/5 pb-4 mb-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">מחיר ביניים:</span>
                      <span className="text-gray-300">₪{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-[#00e676] flex items-center gap-1">
                        <Tag size={14} /> חיסכון במבצעים:
                      </span>
                      <span className="text-[#00e676]">- ₪{savings.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center px-1">
                  <span className="text-gray-400 font-bold text-lg">סה"כ לתשלום:</span>
                  <div className="text-right">
                     <span className="text-3xl font-black text-[#00e676] block">₪{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => { navigate('/checkout'); onClose(); }} 
                    className="flex-[4] bg-[#00e676] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00c864] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,230,118,0.2)]"
                  >
                    מעבר לתשלום <ArrowLeft size={20}/>
                  </button>
                  <button 
                    onClick={() => clearCart()} 
                    className="flex-1 bg-white/5 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
                    title="רוקן סל"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;