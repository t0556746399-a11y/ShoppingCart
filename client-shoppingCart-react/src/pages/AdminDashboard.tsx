import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PackagePlus, Tag, LogOut, Settings, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserRole } from "@/services/supabaseApi";
import AdminProductModal from "@/components/AdminProductModal";
import { AdminDiscountModal } from "@/components/AdminDiscountModal";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { userName, logout } = useAuth();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalDiscounts: 0
  });

  useEffect(() => {
    // Check if user is admin
    const role = getUserRole();
    if (role !== 'Admin') {
      toast.error('אין לך הרשאות מנהל');
      window.location.href = '/';
      return;
    }

    // Load stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { productApi, discountApi } = await import('@/services/supabaseApi');
      const products = await productApi.getAll();
      const discounts = await discountApi.getAll();
      
      setStats({
        totalProducts: products.length,
        totalDiscounts: discounts.length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleProductAdded = () => {
    loadStats();
    toast.success('המוצר נוסף בהצלחה!');
  };

  const handleDiscountAdded = () => {
    loadStats();
    toast.success('ההנחה נוספה בהצלחה!');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-scanner/3 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">פאנל ניהול</h1>
            <span className="text-sm text-gray-400">שלום, {userName}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              חזור לחנות
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              התנתק
            </button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">סה"כ מוצרים</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <PackagePlus className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">סה"כ הנחות</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalDiscounts}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Tag className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <button
            onClick={() => setProductModalOpen(true)}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-right hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <PackagePlus className="w-6 h-6 text-blue-500" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">הוסף מוצר חדש</h3>
            <p className="text-gray-400 text-sm">הוסף מוצר למערכת עם תמונה, מחיר ומלאי</p>
          </button>

          <button
            onClick={() => setDiscountModalOpen(true)}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-right hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                <Tag className="w-6 h-6 text-green-500" />
              </div>
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">הוסף הנחה חדשה</h3>
            <p className="text-gray-400 text-sm">צור מבצע חדש עבור מוצרים קיימים</p>
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            פעולות מהירות
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-3 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              ניהול מוצרים
            </button>
            <button className="p-3 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              ניהול הנחות
            </button>
            <button className="p-3 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              דוחות
            </button>
            <button className="p-3 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              הגדרות
            </button>
          </div>
        </motion.div>
      </main>

      {/* Modals */}
      {productModalOpen && (
        <AdminProductModal
          onClose={() => setProductModalOpen(false)}
          onSuccess={handleProductAdded}
        />
      )}
      
      <AdminDiscountModal
        isOpen={discountModalOpen}
        onClose={() => setDiscountModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;
