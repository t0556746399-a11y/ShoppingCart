import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./components/CheckoutPage";
import { Toaster } from "@/components/ui/sonner";

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        {/* דף הבית */}
        <Route path="/" element={<Index />} />

        {/* דף ניהול - רק למנהלים */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* דף התשלום - נתיב ספציפי */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* דף 404 - חייב להיות אחרון */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="top-center" richColors />
  </>
);

export default App;