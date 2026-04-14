import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, User, LogOut, LogIn, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getUserRole } from "@/services/supabaseApi";

const TopBar = ({ onCartClick, onLoginClick }: { onCartClick: () => void; onLoginClick: () => void }) => {
  const { cart } = useCart();
  const { isAuthenticated, userName, logout } = useAuth();
  const userRole = getUserRole();

  const itemsCount = cart?.products?.length || 0;
  const totalPrice = cart?.sum || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 glass-surface border-b border-white/10 flex items-center px-5 overflow-hidden">
      {/* שמאל: יוזר */}
      <div className="flex-1 flex justify-start z-10 gap-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-xl">
              <span className="text-xs font-bold truncate max-w-[80px]">{userName}</span>
              <button onClick={logout} className="hover:text-red-400 transition-colors">
                <LogOut size={14} />
              </button>
            </div>
            {userRole === 'Admin' && (
              <button 
                onClick={() => window.location.href = '/admin'}
                className="flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-xl hover:bg-purple-500/20 transition-colors"
                title="פאנל ניהול"
              >
                <Settings size={14} className="text-purple-500" />
              </button>
            )}
          </>
        ) : (
          <button onClick={onLoginClick} className="text-xs font-bold bg-secondary px-4 py-2 rounded-xl">
            התחברות
          </button>
        )}
      </div>

      {/* מרכז: לוגו - תמיד באמצע בלי קשר לצדדים */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <h1 className="text-xl font-black italic tracking-tighter">
          <span className="text-[#00e676]">SMART</span>CART
        </h1>
      </div>

      {/* ימין: עגלה */}
      <div className="flex-1 flex justify-end z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCartClick}
          className="flex items-center gap-3 bg-[#00e676]/10 px-4 py-2 rounded-xl border border-[#00e676]/20"
        >
          {itemsCount > 0 && (
            <span className="text-sm font-black text-[#00e676] tabular-nums">
              ₪{totalPrice.toFixed(2)}
            </span>
          )}
          <div className="relative">
            <ShoppingCart size={20} className="text-[#00e676]" />
            {itemsCount > 0 && (
              <div className="absolute -top-3 -right-3 w-5 h-5 bg-[#00e676] text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
                {itemsCount}
              </div>
            )}
          </div>
        </motion.button>
      </div>
    </header>
  );
};

export default TopBar;