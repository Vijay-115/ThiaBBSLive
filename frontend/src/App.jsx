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
                {/* Add additional routes as needed */}
            </Routes>
            <ToastContainer />
            <FooterTop />
        </Router>
    );
}

export default App;