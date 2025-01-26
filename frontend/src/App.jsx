import './common.css';
import './ProductSlider.css';
import './bannerOne.css';
import './SingleProduct.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HeaderTop from './components/layout/HeaderTop';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import FooterTop from './components/layout/FooterTop';
import SingleProductPage from './components/pages/SingleProductPage';
import ProductsCategoryPage from './components/pages/ProductsCategoryPage';
import CartPage from './components/pages/CartPage';

// authentication 
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Forgot from './components/auth/ForgotPassword';
import ResetPassword from "./components/auth/ResetPassword"

import { Toaster } from 'react-hot-toast';
import CheckoutPage from './components/pages/CheckoutPage';
import WishlistPage from './components/pages/WishlistPage';
import ProductsListPage from './components/pages/admin/ProductsListPage';


import AdminDashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import Orders from './components/admin/Orders';

function App() {  
    const [menuOpen, setMenuOpen] = useState(false);

    // Function to toggle menu
    const toggleMenu = () => {
        setMenuOpen(true);
    };

    // Function to close menu
    const closeMenu = () => {
        setMenuOpen(false);
    };

    const excludeHeaderFooterRoutes = ['/admin/dashboard', '/admin/products', '/admin/orders'];
    const shouldRenderHeaderFooter = !excludeHeaderFooterRoutes.includes(location.pathname);

    return (
        <Router>
            {shouldRenderHeaderFooter && <HeaderTop toggleMenu={toggleMenu} />}
            {shouldRenderHeaderFooter && <Navbar menuOpen={menuOpen} closeMenu={closeMenu} />}
            
            {/* Main Content */}
            <Routes>
                {/* Default Route */}
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<SingleProductPage />} />
                <Route path="/product/category/:category" element={<ProductsCategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<Forgot />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                {/* Add additional routes as needed */}   
                <Route path="/admin/dashboard" element={<AdminDashboard />} />             
                <Route path="/admin/products" element={<Products />} />             
                <Route path="/admin/orders" element={<Orders />} />     
                <Route path="/adminproduct" element={<ProductsListPage />} />
                {/* Add additional routes as needed */}
            </Routes>
            
            {shouldRenderHeaderFooter && <FooterTop />}
            <Toaster position="top-right" />
        </Router>
    );
}

export default App;