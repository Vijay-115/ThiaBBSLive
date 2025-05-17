/*import React, { useEffect, useState, useRef } from 'react';
import NavItems from "./NavItems"

function Navbar({ menuOpen, closeMenu }) {


  const offers = [
    '2% Instant Discount on HDFC Credit Cards Only',
    'No Wastage (VA) On Gold Coin'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <>
      <nav className='navbar'>
        <div className='md:bg-slate-100 w-full py-2 px-4'>
          <NavItems menuOpen={menuOpen} closeMenu={closeMenu} />
        </div>
      </nav>
      <div className="w-full bg-[#cf1717] text-white py-2 text-center overflow-hidden">
        <ul className="offer-msg list-none m-0 p-0">
          <li key={currentIndex} className="bounce-text text-sm font-medium text-gray-800">
            {offers[currentIndex]}
          </li>
        </ul>
      </div>
      <style>
        {`
            .bounce-text {
                animation: bounceIn 0.6s ease-in-out;
            }

            @keyframes bounceIn {
                0% {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                50% {
                    transform: translateY(10%);
                    opacity: 1;
                }
                100% {
                    transform: translateY(0);
                }
            }
        `}
      </style>
    </>
  )
}

export default Navbar*/


import React, { useState, useEffect } from 'react';

// Simple mobile detection hook (since we're skipping useIsMobile)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const jewelryData = [
  {
    id: 'jewelry-1',
    title: 'Jewelry',
    submenu: [
      {
        id: 'category-1',
        title: 'Rings',
        description: 'Handcrafted rings for every occasion',
        items: [
          { id: 'rings-1', title: 'Engagement Rings', link: '#', hasChildren: true },
          { id: 'rings-2', title: 'Wedding Bands', link: '#', hasChildren: true },
          { id: 'rings-3', title: 'Diamond Rings', link: '#' },
          { id: 'rings-4', title: 'Gemstone Rings', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'category-2',
        title: 'Necklaces',
        description: 'Elegant necklaces for any style',
        items: [
          { id: 'necklaces-1', title: 'Pendants', link: '#', hasChildren: true },
          { id: 'necklaces-2', title: 'Chokers', link: '#' },
          { id: 'necklaces-3', title: 'Gold Chains', link: '#' },
          { id: 'necklaces-4', title: 'Diamond Necklaces', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'category-3',
        title: 'Earrings',
        description: 'Beautiful earrings for every occasion',
        items: [
          { id: 'earrings-1', title: 'Studs', link: '#', hasChildren: true },
          { id: 'earrings-2', title: 'Hoops', link: '#' },
          { id: 'earrings-3', title: 'Drops', link: '#' },
          { id: 'earrings-4', title: 'Chandeliers', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1635767798638-3665a153ee1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'collections-1',
    title: 'Collections',
    submenu: [
      {
        id: 'collection-1',
        title: 'Seasonal',
        items: [
          { id: 'seasonal-1', title: 'Summer Glow', link: '#' },
          { id: 'seasonal-2', title: 'Winter Frost', link: '#' },
          { id: 'seasonal-3', title: 'Spring Bloom', link: '#' },
          { id: 'seasonal-4', title: 'Autumn Gold', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1616661412974-5d152a521b3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'collection-2',
        title: 'Exclusive',
        items: [
          { id: 'exclusive-1', title: 'Limited Edition', link: '#' },
          { id: 'exclusive-2', title: 'Signature Series', link: '#' },
          { id: 'exclusive-3', title: 'Designer Collaborations', link: '#' },
          { id: 'exclusive-4', title: 'Artisan Crafted', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

const groceryData = [
  {
    id: 'grocery-1',
    title: 'Groceries',
    submenu: [
      {
        id: 'food-1',
        title: 'Fresh Produce',
        description: 'Fresh and organic produce for your daily needs',
        items: [
          { id: 'fresh-1', title: 'Fruits', link: '#', hasChildren: true },
          { id: 'fresh-2', title: 'Vegetables', link: '#', hasChildren: true },
          { id: 'fresh-3', title: 'Herbs', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'food-2',
        title: 'Dairy & Eggs',
        description: 'Fresh dairy products from local farms',
        items: [
          { id: 'dairy-1', title: 'Milk', link: '#' },
          { id: 'dairy-2', title: 'Cheese', link: '#' },
          { id: 'dairy-3', title: 'Yogurt', link: '#' },
          { id: 'dairy-4', title: 'Eggs', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'food-3',
        title: 'Bakery',
        description: 'Freshly baked goods every day',
        items: [
          { id: 'bakery-1', title: 'Bread', link: '#' },
          { id: 'bakery-2', title: 'Pastries', link: '#' },
          { id: 'bakery-3', title: 'Cakes', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    id: 'specialty-1',
    title: 'Specialty',
    submenu: [
      {
        id: 'specialty-cat-1',
        title: 'Organic',
        items: [
          { id: 'organic-1', title: 'Organic Produce', link: '#' },
          { id: 'organic-2', title: 'Organic Dairy', link: '#' },
          { id: 'organic-3', title: 'Organic Pantry', link: '#' },
          { id: 'organic-4', title: 'Organic Snacks', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'specialty-cat-2',
        title: 'International',
        items: [
          { id: 'international-1', title: 'Asian', link: '#' },
          { id: 'international-2', title: 'Mediterranean', link: '#' },
          { id: 'international-3', title: 'Latin American', link: '#' },
          { id: 'international-4', title: 'European', link: '#' },
        ],
        image: 'https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
];

// Basic utility className toggle
const cn = (...classes) => classes.filter(Boolean).join(' ');

const MegaMenu = ({ menuType }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const isMobile = useIsMobile();
  const menuData = menuType === 'jewelry' ? jewelryData : groceryData;

  return (
    <nav className="relative bg-white shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-4 md:space-x-10 py-4">
          {menuData.map((item) => (
            <li
              key={item.id}
              className="megamenu-item group"
              onMouseEnter={() => !isMobile && setActiveMenu(item.id)}
              onMouseLeave={() => !isMobile && setActiveMenu(null)}
              onClick={() =>
                isMobile && setActiveMenu(activeMenu === item.id ? null : item.id)
              }
            >
              <div className="flex items-center space-x-1 text-black hover:text-red-500 font-medium transition-colors cursor-pointer">
                <span>{item.title}</span>
                <span className="text-xs">&#9662;</span> {/* Down arrow symbol */}
              </div>

              {item.submenu && (
                <div
                  className={cn(
                    "megamenu-content absolute left-0 w-full bg-white z-10",
                    activeMenu === item.id ? "block" : "hidden"
                  )}
                >
                  <div className="container mx-auto p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                      {item.submenu.map((submenu) => (
                        <div key={submenu.id} className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex flex-col md:flex-row items-start gap-4">
                            {submenu.image && (
                              <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={submenu.image}
                                  alt={submenu.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1 text-black">
                                {submenu.title}
                              </h3>
                              {submenu.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {submenu.description}
                                </p>
                              )}
                              <ul className="space-y-2">
                                {submenu.items.map((subItem) => (
                                  <li
                                    key={subItem.id}
                                    className="text-gray-700 hover:text-red-500 transition-colors"
                                  >
                                    <a href={subItem.link} className="flex items-center py-1">
                                      <span>{subItem.title}</span>
                                      {subItem.hasChildren && (
                                        <span className="text-xs ml-1">&#9656;</span> 
                                      )}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MegaMenu;
