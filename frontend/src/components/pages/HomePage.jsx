import React, { useEffect } from 'react';
import HeroSection from "../home/HeroSection";
import SectionCategory from "../home/SectionCategory";
import ProductList from "../products/ProductList";
import BannerOne from "../home/BannerOne";
import Services from "../home/Services";
import { useLocation } from 'react-router-dom';

function HomePage() {
  const location = useLocation();
  useEffect(() => {
      // Scroll to top whenever the route changes
      window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
        
            {/* Page Content */}
            <div className="homepahe bbscontainer">                
              <HeroSection/>
              <SectionCategory/>
              <ProductList heading="Grocery Items" type="Slider" category='groceries'/>
              <BannerOne/>
              <Services/>
            </div>
            {/* Page Content */}
        
    </>
  )
}

export default HomePage