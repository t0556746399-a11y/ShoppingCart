import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductScanner from "@/components/ProductScanner";
import CartSidebar from "@/components/CartSidebar";
import TopBar from "@/components/TopBar";
import LoginModal from "@/components/LoginModal";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ShoppingBag, Scan, Sparkles } from "lucide-react";

const ScannerPageContent = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-scanner/3 blur-3xl" />
      </div>

      <TopBar onCartClick={() => setCartOpen(true)} onLoginClick={() => setLoginOpen(true)} />

      <main className="relative pt-24 pb-12 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4"
          >
            <Scan className="w-3.5 h-3.5" />
            סורק חכם
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
            קניות <span className="text-primary">חכמות</span> יותר
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            חפש מוצרים, הוסף לעגלה וראה כמה חסכת — בדיוק כמו הסורק בחנות
          </p>
        </motion.div>

        {/* Scanner */}
        <ProductScanner />

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex justify-center gap-6"
        >
          {[
            { icon: Scan, label: "חיפוש מהיר", desc: "מצא כל מוצר" },
            { icon: Sparkles, label: "מבצעים חיים", desc: "הנחות אוטומטיות" },
            { icon: ShoppingBag, label: "עגלה חכמה", desc: "סיכום חיסכון" },
          ].map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="p-3 rounded-xl bg-secondary">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">{feat.label}</span>
              <span className="text-xs text-muted-foreground">{feat.desc}</span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

const Index = () => (
  <AuthProvider>
    <CartProvider>
      <ScannerPageContent />
    </CartProvider>
  </AuthProvider>
);

export default Index;
