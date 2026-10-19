import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AccountPanelProvider } from "./context/AccountPanelContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import AccountPanel from "./components/account/AccountPanel";
import Home from "./pages/public/Home";
import Catalog from "./pages/public/Catalog";
import ProductDetail from "./pages/public/ProductDetail";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isDarkRoute =
    isLanding || location.pathname === "/catalogo" || location.pathname.startsWith("/productos/");

  return (
    <div className={`flex min-h-screen flex-col ${isDarkRoute ? "bg-black" : ""}`}>
      {!isLanding && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/productos/:slug" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AccountPanelProvider>
          <BrowserRouter>
            <AppLayout />
            <CartDrawer />
            <AccountPanel />
          </BrowserRouter>
        </AccountPanelProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
