import './common.css';
import './ProductSlider.css';
import './bannerOne.css';
import './SingleProduct.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderTop from './components/layout/HeaderTop';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import FooterTop from './components/layout/FooterTop';
import SingleProductPage from './components/pages/SingleProductPage';
import ProductsCategoryPage from './components/pages/ProductsCategoryPage';

function App() {  
    const [menuOpen, setMenuOpen] = useState(false);

    // Function to toggle menu
    const toggleMenu = () => {
        setMenuOpen(true);
    };
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
                {/* Add additional routes as needed */}
            </Routes>
            
            <FooterTop />
        </Router>
    );
}

export default App;