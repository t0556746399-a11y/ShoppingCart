import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Loader2 } from "lucide-react";
import { discountApi, productApi, Product } from "@/services/supabaseApi";
import { toast } from "sonner";

export const AdminDiscountModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    description: "",
    discountPercent: 0,
    productId: 0,
    numInDiscount: 1
  });

  useEffect(() => {
    if (isOpen) {
      productApi.getAll().then(setProducts).catch(() => toast.error("נכשל בטעינת מוצרים"));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productId === 0) return toast.error("אנא בחר מוצר");
    
    setLoading(true);
    try {
      await discountApi.create(formData);
      toast.success("המבצע נוסף בהצלחה!");
      onClose();
    } catch (error) {
      toast.error("שגיאה בהוספת המבצע");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-background w-full max-w-md p-6 rounded-2xl shadow-xl" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-primary"><Tag /> הוספת מבצע חדש</h2>
              <button onClick={onClose} className="hover:bg-secondary p-1 rounded-full"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">בחר מוצר:</label>
                <select 
                  className="w-full p-2 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  onChange={e => setFormData({...formData, productId: Number(e.target.value)})}
                  required
                >
                  <option value="">-- בחר מוצר מהרשימה --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.description} (₪{p.price})</option>
                  ))}
                </select>
              </div>

              <input type="text" placeholder="תיאור המבצע (למשל: מבצע קיץ)" className="w-full p-2 bg-secondary rounded-lg" 
                onChange={e => setFormData({...formData, description: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="אחוז הנחה" className="w-full p-2 bg-secondary rounded-lg" 
                  onChange={e => setFormData({...formData, discountPercent: Number(e.target.value)})} required />
                <input type="number" placeholder="כמות מינימום" className="w-full p-2 bg-secondary rounded-lg" 
                  onChange={e => setFormData({...formData, numInDiscount: Number(e.target.value)})} required />
              </div>

              <button disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "הפעל מבצע"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};