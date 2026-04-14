import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, ShoppingBag, User, Loader2, Tag, Receipt } from 'lucide-react';
import { productApi } from '@/services/api'; 
import { toast } from 'sonner';

const CheckoutPage: React.FC = () => {
  const { cart, finalTotal, savings, subtotal, clearCart, fetchCart, discounts } = useCart(); 
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [frozenCart, setFrozenCart] = useState<any>(null);

  // שמירת נתוני העגלה לקבלה הסופית לפני שהיא נמחקת
  useEffect(() => {
    if (cart?.products?.length > 0 && !isProcessing && !isCompleted) {
      setFrozenCart({
        products: [...cart.products],
        subtotal, savings, finalTotal
      });
    }
  }, [cart, subtotal, savings, finalTotal, isProcessing, isCompleted]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || !cart.products?.length) return;

    setIsProcessing(true);
    try {
      // 1. עדכון מלאי בשרת
      await Promise.all(cart.products.map(item => productApi.updateStock(item.id, -1)));

      // 2. ניקוי העגלה (מול ה-API וה-Context)
      await clearCart(); 

      setIsCompleted(true);
      toast.success("התשלום בוצע בהצלחה!");
    } catch (error) {
      toast.error("שגיאה בביצוע התשלום");
    } finally {
      setIsProcessing(false);
    }
  };

  // מסך קבלה (Success)
  if (isCompleted && frozenCart) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white text-black p-10 rounded-[3rem] max-w-md w-full shadow-2xl font-mono text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#00e676]" />
          <CheckCircle2 size={70} className="text-[#00e676] mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-2 italic uppercase">Order Complete</h2>
          <p className="text-gray-400 text-[10px] mb-8 border-b pb-4">SmartCart Digital Receipt</p>
          
          <div className="text-right text-xs space-y-3 mb-8">
            {frozenCart.products.map((p: any, i: number) => (
              <div key={i} className="flex justify-between border-b border-dotted border-gray-200 pb-2">
                <span>{p.description}</span>
                <span>₪{p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-right mb-6">
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>סכום ביניים:</span>
              <span>₪{frozenCart.subtotal.toFixed(2)}</span>
            </div>
            {frozenCart.savings > 0 && (
              <div className="flex justify-between text-[10px] text-[#00e676] font-bold">
                <span>נחסך במבצעים:</span>
                <span>-₪{frozenCart.savings.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-4xl font-black border-t-2 pt-4 border-black">
            <span>TOTAL</span>
            <span>₪{frozenCart.finalTotal.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-black text-white py-4 rounded-2xl font-black mt-10 hover:bg-gray-900 transition-all"
          >
            חזרה לחנות
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pt-24" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 italic">
        
        {/* צד שמאל: טופס תשלום */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">Checkout</h1>
            <p className="text-[#00e676] font-bold not-italic tracking-widest text-xs">SECURE PAYMENT GATEWAY</p>
          </div>

          <form onSubmit={handlePay} className="space-y-4 not-italic font-sans">
            <div className="group relative">
              <User className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={20} />
              <input required type="text" placeholder="שם בעל הכרטיס" className="w-full bg-[#151719] border border-white/5 rounded-2xl py-5 pr-14 outline-none focus:border-[#00e676]/50 focus:bg-[#1a1c1e] transition-all" />
            </div>

            <div className="group relative">
              <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00e676] transition-colors" size={20} />
              <input required type="text" placeholder="מספר כרטיס אשראי" className="w-full bg-[#151719] border border-white/5 rounded-2xl py-5 pr-14 outline-none focus:border-[#00e676]/50 focus:bg-[#1a1c1e] transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <input required type="text" placeholder="MM/YY" className="bg-[#151719] border border-white/5 rounded-2xl py-5 text-center outline-none focus:border-[#00e676]/50 transition-all" />
               <input required type="text" placeholder="CVV" className="bg-[#151719] border border-white/5 rounded-2xl py-5 text-center outline-none focus:border-[#00e676]/50 transition-all" />
            </div>

            <button 
              disabled={isProcessing || !cart?.products?.length} 
              className="w-full bg-[#00e676] text-black font-black py-6 rounded-[2rem] text-2xl flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,230,118,0.15)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-20 mt-4"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : `PAY ₪${finalTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* צד ימין: סיכום הזמנה מעוצב */}
        <div className="bg-[#151719] rounded-[3.5rem] p-10 border border-white/5 h-fit shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00e676]" />
          
          <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-[#00e676] italic tracking-tighter uppercase">
            <Receipt className="text-[#00e676]" /> Order Summary
          </h3>

          {/* רשימת מוצרים עם סקרולר מעוצב */}
          <div className="space-y-3 mb-10 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
            {cart?.products?.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={index} 
                className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded bg-black flex items-center justify-center text-[10px] text-[#00e676] font-mono border border-white/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-bold text-gray-300 tracking-tight">{item.description}</span>
                </div>
                <span className="font-black text-white">₪{item.price.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>

          {/* לוגיקת המבצעים המפורטת */}
          {savings > 0 && (
            <div className="mb-10 space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-[0.2em]">Active Discounts</p>
              {Array.from(new Set(cart?.products?.map(p => p.id))).map(productId => {
                const product = cart?.products?.find(p => p.id === productId);
                const qty = cart?.products?.filter(p => p.id === productId).length || 0;
                const disc = discounts.find(d => d.productId === productId);
                
                if (disc && qty >= disc.numInDiscount) {
                  const timesApplied = Math.floor(qty / disc.numInDiscount);
                  const savedOnProduct = (product!.price * (disc.discountPercent / 100)) * (timesApplied * disc.numInDiscount);
                  
                  return (
                    <motion.div 
                      key={productId}
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center bg-[#00e676]/5 border border-[#00e676]/10 p-4 rounded-2xl group hover:border-[#00e676]/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#00e676] p-1.5 rounded-lg text-black">
                          <Tag size={14} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#00e676] uppercase tracking-tight">{disc.description}</p>
                          <p className="text-[10px] text-gray-500 font-bold italic">מומש {timesApplied} פעמים על {product?.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#00e676]">-₪{savedOnProduct.toFixed(2)}</span>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* חישובים סופיים */}
          <div className="space-y-4 pt-8 border-t border-white/10 italic">
            <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>₪{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="pt-6 mt-4 border-t border-white/5">
              <div className="flex justify-between items-end tracking-tighter uppercase">
                <div className="space-y-1">
                   <span className="text-gray-500 font-black text-xs block tracking-[0.3em]">TOTAL DUE</span>
                   <span className="text-6xl font-black text-[#00e676] leading-none drop-shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                     <span className="text-2xl mr-1 italic">₪</span>{finalTotal.toFixed(2)}
                   </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* רקע דקורטיבי */}
          <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-[150px] font-black italic pointer-events-none select-none tracking-tighter">
            CART
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;