import React from 'react';
import HeroSection from "../home/HeroSection";
import SectionCategory from "../home/SectionCategory";
import ProductList from "../products/ProductList";
import BannerOne from "../home/BannerOne";
import Services from "../home/Services";

function HomePage() {
  return (
    <>
        
            {/* Page Content */}
            <HeroSection/>
            <SectionCategory/>
            <ProductList heading="Grocery Items" type="Slider" category='groceries'/>
            <ProductList heading="Jewellery Items" type="Grid" category='womens-jewellery'/>
            <BannerOne/>
            <Services/>
            {/* Page Content */}
        
    </>
  )
}

export default HomePage