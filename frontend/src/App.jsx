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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// authentication 
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Forgot from './components/auth/ForgotPassword';
import ResetPassword from "./components/auth/ResetPassword"

import { Toaster } from 'react-hot-toast';

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

    return (
        <Router>
            <HeaderTop toggleMenu={toggleMenu} />
            <Navbar menuOpen={menuOpen} closeMenu={closeMenu} />
            
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
                {/* Add additional routes as needed */}
            </Routes>
            <ToastContainer />
            <FooterTop />
            <Toaster position="top-right" />
        </Router>
    );
}

export default App;