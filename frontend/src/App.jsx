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
import BecomeVendor from './components/auth/BecomeVendor'; 
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
import VendorRequest from './components/admin/VendorRequest';
import BecomeAgent from './components/auth/BecomeAgent'; 
import BecomeFranchiseHead from './components/auth/BecomeFranchiseHead'; 
import BecomeTerritoryHead from './components/auth/BecomeTerritoryHead'; 
import CustomerOrders from './components/auth/Orders'; 

import AboutPage from './components/pages/AboutPage';
import TermsOfUse from './components/pages/TermsOfUse';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import CancellationPolicy from './components/pages/CancellationPolicy';
import ShippingPolicy from './components/pages/ShippingPolicy';
import RefundPolicy from './components/pages/RefundPolicy';
import ExchangePolicy from './components/pages/ExchangePolicy';
import BuybackPolicy from './components/pages/BuybackPolicy';
import BankCashbackPolicy from './components/pages/BankCashbackPolicy';
import ContactUs from './components/pages/ContactUs';

import SellerDashboard from './components/seller/Dashboard';
import SellerProducts from './components/seller/Products';
import SellerCategories from './components/seller/Categories';
import SellerSubCategories from './components/seller/SubCategories';
import SellerOrders from './components/seller/Orders';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './services/authService';
import { fetchCartItems } from './slice/cartSlice';
import { fetchWishlistItems } from './slice/wishlistSlice';

import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";

// Main App Component
function App() {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const excludeRoutes = ['/login', '/register'];

    if (!excludeRoutes.includes(location.pathname)) {
      // if(isAuthenticated){
        dispatch(loadUser());
      // }
      dispatch(fetchCartItems());
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, location.pathname]); // Re-run when location changes

  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldRenderHeaderFooter, setShouldRenderHeaderFooter] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const checkHeaderFooter = () => {
      const excludeHeaderFooterRoutes = ['/admin/dashboard', '/admin/products', '/admin/orders', '/admin/products/categories', '/admin/products/subcategories', '/admin/seller', '/admin/vendor', '/seller/dashboard', '/seller/products', '/seller/orders', '/seller/products/categories', '/seller/products/subcategories', '/admin/vendor-request'];
      setShouldRenderHeaderFooter(!excludeHeaderFooterRoutes.includes(location.pathname));
    };

    checkHeaderFooter();
  }, [location.pathname]); // Update when the location changes

  const AdminRoutes = () => <ProtectedRoute requiredRole="admin" />;
  const SellerRoutes = () => <ProtectedRoute requiredRole="seller" />;

  return (
    <>
      {shouldRenderHeaderFooter && <HeaderTop toggleMenu={toggleMenu} />}
      {shouldRenderHeaderFooter && <Navbar menuOpen={menuOpen} closeMenu={closeMenu} />}
      <ScrollToTopOnRouteChange /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/product/category/:category" element={<ProductsCategoryPage />} />
        <Route path="/product/subcategory/:subcategory" element={<ProductsSubCategoryPage />} /> 
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/become-a-vendor" element={<BecomeVendor />} />
        <Route path="/become-a-agent" element={<BecomeAgent />} />
        <Route path="/become-a-territory-head" element={<BecomeTerritoryHead />} />
        <Route path="/become-a-franchise-head" element={<BecomeFranchiseHead />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/adminproduct" element={<ProductsListPage />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />
        <Route path="/buyback-policy" element={<BuybackPolicy />} />
        <Route path="/bank-cashback-policy" element={<BankCashbackPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/orders" element={<CustomerOrders />} />
        

         {/* ✅ Admin Routes */}
         <Route path="/admin" element={<AdminRoutes />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/categories" element={<Categories />} />
            <Route path="products/subcategories" element={<SubCategories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="seller" element={<Seller />} />
            <Route path="vendor" element={<Vendor />} />
            <Route path="vendor-request" element={<VendorRequest />} />            
        </Route>

        {/* ✅ Seller Routes */}
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
