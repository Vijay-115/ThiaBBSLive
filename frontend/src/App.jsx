import './common.css'; 
import './ProductSlider.css'; 
import './bannerOne.css'; 
import './SingleProduct.css'; 
import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom"; 
import HeaderTop from './components/layout/HeaderTop'; 
import Navbar from './components/layout/Navbar'; 
import HomePage from './components/pages/HomePage'; 
import FooterTop from './components/layout/FooterTop'; 
import SingleProductPage from './components/pages/SingleProductPage'; 
import ProductsCategoryPage from './components/pages/ProductsCategoryPage'; 
import ProductsSubCategoryPage from './components/pages/ProductsSubCategoryPage'; 
import CartPage from './components/pages/CartPage';  
import Login from './components/auth/Login'; 
import Register from './components/auth/Register'; 
import Forgot from './components/auth/ForgotPassword'; 
import ResetPassword from "./components/auth/ResetPassword"; 
import { Toaster } from 'react-hot-toast'; 
import CheckoutPage from './components/pages/CheckoutPage'; 
import WishlistPage from './components/pages/WishlistPage'; 
import ProductsListPage from './components/pages/admin/ProductsListPage';   
import ProtectedRoute from './components/ProtectedRoute';  
import AdminDashboard from './components/admin/Dashboard'; 
import Products from './components/admin/Products'; 
import Categories from './components/admin/Categories'; 
import SubCategories from './components/admin/SubCategories'; 
import Orders from './components/admin/Orders';  
import MyAccount from './components/auth/MyAccount';
import Seller from './components/admin/Seller';
import Vendor from './components/admin/Vendor';


import SellerDashboard from './components/seller/Dashboard';
import SellerProducts from './components/seller/Products';
import SellerCategories from './components/seller/Categories';
import SellerSubCategories from './components/seller/SubCategories';
import SellerOrders from './components/seller/Orders';

const AdminRoutes = () => (
  <ProtectedRoute requiredRole="admin">
    <Outlet />
  </ProtectedRoute>
);
const SellerRoutes = () => (
  <ProtectedRoute requiredRole="seller">
    <Outlet />
  </ProtectedRoute>
);

// Main App Component
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldRenderHeaderFooter, setShouldRenderHeaderFooter] = useState(true);

  const location = useLocation(); // Hook to access current route

  const toggleMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const checkHeaderFooter = () => {
      const excludeHeaderFooterRoutes = ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/products/categories', '/admin/products/subcategories', '/admin/seller', '/admin/vendor', '/seller/dashboard', '/seller/products', '/seller/orders', '/seller/products/categories', '/seller/products/subcategories'];
      setShouldRenderHeaderFooter(!excludeHeaderFooterRoutes.includes(location.pathname));
    };

    checkHeaderFooter();
  }, [location.pathname]); // Update when the location changes

  return (
    <>
      {shouldRenderHeaderFooter && <HeaderTop toggleMenu={toggleMenu} />}
      {shouldRenderHeaderFooter && <Navbar menuOpen={menuOpen} closeMenu={closeMenu} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/product/category/:category" element={<ProductsCategoryPage />} />
        <Route path="/product/subcategory/:subcategory" element={<ProductsSubCategoryPage />} /> 
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/adminproduct" element={<ProductsListPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/admin" element={<AdminRoutes />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/subcategories" element={<SubCategories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="seller" element={<Seller />} />
          <Route path="vendor" element={<Vendor />} />
        </Route>
        <Route path="/seller" element={<SellerRoutes />}>
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/categories" element={<SellerCategories />} />
          <Route path="products/subcategories" element={<SellerSubCategories />} />
          <Route path="orders" element={<SellerOrders />} />
        </Route>
      </Routes>
      {shouldRenderHeaderFooter && <FooterTop />}
      <Toaster position="top-right" />
    </>
  );
}

// Router wrapper in index.js or App.js to ensure that useLocation works correctly
export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
