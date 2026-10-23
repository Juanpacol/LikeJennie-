import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AccountPanelProvider } from "./context/AccountPanelContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SiteHeader from "./components/common/SiteHeader";
import Footer from "./components/common/Footer";
import FooterReveal from "./components/common/FooterReveal";
import { COLLECTIONS } from "./data/collections";
import CollectionFooter from "./components/common/CollectionFooter";
import ShopFooter from "./components/common/ShopFooter";
import SlimFooter from "./components/common/SlimFooter";
import CartDrawer from "./components/cart/CartDrawer";
import CartToast from "./components/cart/CartToast";
import BrandFrame from "./components/common/BrandFrame";
import SmoothScroll from "./components/common/SmoothScroll";
import AccountPanel from "./components/account/AccountPanel";
import Home from "./pages/public/Home";
import Catalog from "./pages/public/Catalog";
import Collection from "./pages/public/Collection";
import ProductDetail from "./pages/public/ProductDetail";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";

function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  // Catálogo y productos llevan su propio footer revelado (grises cálidos).
  const isShop =
    location.pathname === "/catalogo" ||
    location.pathname.startsWith("/productos/");
  const collectionSlug = location.pathname.match(
    /^\/colecciones\/([^/]+)/,
  )?.[1];
  const collection = COLLECTIONS[collectionSlug];
  const isDarkRoute =
    isLanding ||
    location.pathname === "/catalogo" ||
    location.pathname.startsWith("/colecciones/") ||
    location.pathname.startsWith("/productos/");

  return (
    <div
      className={`relative flex min-h-screen flex-col ${isDarkRoute ? "bg-[var(--stage-color,#000)]" : ""}`}
    >
      <SiteHeader overlay={isLanding} dark={isDarkRoute} />
      <main
        className={`relative z-10 flex-1 ${isDarkRoute ? "bg-black" : "bg-white"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/colecciones/:slug" element={<Collection />} />
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
      {/* Footer grande y revelado en la landing y en la tienda; en el resto, una franja delgada. */}
      {isLanding ? (
        <FooterReveal>
          <Footer />
        </FooterReveal>
      ) : collection ? (
        <FooterReveal key={collectionSlug}>
          <CollectionFooter slug={collectionSlug} collection={collection} />
        </FooterReveal>
      ) : isShop ? (
        <FooterReveal>
          <ShopFooter />
        </FooterReveal>
      ) : (
        <SlimFooter dark={isDarkRoute} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AccountPanelProvider>
          <BrowserRouter>
            <SmoothScroll />
            <BrandFrame />
            <AppLayout />
            <CartDrawer />
            <CartToast />
            <AccountPanel />
          </BrowserRouter>
        </AccountPanelProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
