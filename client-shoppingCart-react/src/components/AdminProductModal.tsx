import React, { useState, useRef } from "react";
import { productApi } from "@/services/supabaseApi";
import { toast } from "sonner";
import { X, Upload, PackagePlus, ImageIcon } from "lucide-react";

const AdminProductModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    numInStock: "",
    img: "" // כאן תישמר התמונה בפורמט Base64
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // פונקציה להפיכת קובץ תמונה למחרוזת Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // הגבלה ל-2MB כדי לא להכביד על ה-DB
        toast.error("התמונה גדולה מדי. אנא בחר קובץ קטן מ-2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.img) {
      toast.error("אנא בחר תמונה למוצר");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        description: formData.description,
        price: parseFloat(formData.price),
        numInStock: parseInt(formData.numInStock),
        img: formData.img // שולח את מחרוזת התמונה לשרת
      };

      await productApi.add(productData);
      
      toast.success("המוצר נוסף בהצלחה!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("שגיאה בשמירת המוצר. וודא שאתה מחובר כמנהל.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1c1e] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PackagePlus className="text-[#00e676]" />
            <h2 className="text-xl font-bold text-white">הוספת מוצר חדש</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* תיאור */}
          <input
            type="text"
            placeholder="תיאור המוצר"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#00e676] outline-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />

          {/* מחיר ומלאי */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="מחיר"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#00e676] outline-none"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="כמות במלאי"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#00e676] outline-none"
              value={formData.numInStock}
              onChange={e => setFormData({...formData, numInStock: e.target.value})}
              required
            />
          </div>

          {/* העלאת תמונה */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00e676] transition-all overflow-hidden min-h-[120px]"
          >
            {formData.img ? (
              <img src={formData.img} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            ) : (
              <Upload className="text-gray-500" />
            )}
            <span className="text-sm text-gray-400 relative z-10 font-medium">
              {formData.img ? "החלף תמונה" : "לחץ להעלאת תמונה"}
            </span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* כפתור שמירה */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00e676] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#00e676]/20"
          >
            {loading ? "שומר מוצר במערכת..." : "שמור מוצר"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;