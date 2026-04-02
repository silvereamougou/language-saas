import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import AffiliationPage from './pages/AffiliationPage';
import ContactPage from './pages/ContactPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LegalNoticePage from './pages/LegalNoticePage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminProductViewPage from './pages/admin/AdminProductViewPage';

import { ThemeProvider } from './context/ThemeProvider';
import { ApiProvider } from './context/ApiContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

function App() {
  return (
    <ThemeProvider>
      <ApiProvider>
        <UserProvider>
          <CartProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/affiliation" element={<AffiliationPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/orders" element={<MyOrdersPage />} />
                    <Route path="/legal-notice" element={<LegalNoticePage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
                    <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                    <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
                    <Route path="/admin/products/:id" element={<AdminProductViewPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AdminAuthProvider>
          </CartProvider>
        </UserProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
