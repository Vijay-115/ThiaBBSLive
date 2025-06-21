import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/ProductService';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';

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

const MegaMenu = ({ menuType }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const isMobile = useIsMobile();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = null;
        if (user && user.role === 'seller') {
          response = await ProductService.getCategorySellerID(user._id);
        } else if (user && user.role === 'admin') {
          response = await ProductService.getCategories();
        } else if (user && user.role === 'user') {
          response = await ProductService.getCategoriesNearbySeller();
        } else {
          response = await ProductService.getCategories();
        }
        setDynamicCategories(response || []);
      } catch (error) {
        setDynamicCategories([]);
      }
    };
    fetchCategories();
  }, [user]);

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

  const fullMenuData = [
    {
      id: 'grocery-1',
      title: 'Groceries',
      submenu: dynamicCategories.length > 0
        ? dynamicCategories.map((cat) => ({
            id: cat._id,
            title: cat.name,
            description: cat.description || '',
            items: (cat.subcategories || []).map((sub) => ({
              id: sub._id,
              title: sub.name,
              link: `/product/subcategory/${sub._id}`
            })),
            image: cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          }))
        : [
            // fallback static
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
          ],
    },
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
          image: 'https://images.unsplash.com/photo-1651328905475-16882e198d54',
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

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <>
      {/* Offer Banner */}
      <div className="w-full bg-[#cf1717] text-white py-2 text-center overflow-hidden">
        <ul className="offer-msg list-none m-0 p-0">
          <li key={currentIndex} className="bounce-text text-sm font-medium text-white">
            {offers[currentIndex]}
          </li>
        </ul>
      </div>
      {/* Main Navbar */}
      <nav className="relative bg-white shadow-md border-b border-gray-100 z-30">
        <div className="container mx-auto px-2 flex items-center justify-between">
          {/* Hamburger for mobile */}
          <button
            className="lg:hidden p-2 text-[#cf1717] focus:outline-none"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {/* Desktop Menu */}
          <ul className="hidden lg:flex overflow-x-auto no-scrollbar justify-center space-x-2 lg:space-x-8 py-2 w-full">
            {fullMenuData.map((item) => (
              <li
                key={item.id}
                className="relative group flex-shrink-0"
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-md font-semibold text-gray-800 hover:bg-[#f7eaea] hover:text-[#cf1717] transition',
                    activeMenu === item.id ? 'bg-[#f7eaea] text-[#cf1717]' : ''
                  )}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === item.id}
                >
                  <span>{item.title}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {/* Desktop MegaMenu - use portal for top layer */}
                {activeMenu === item.id && item.submenu && ReactDOM.createPortal(
                  <div
                    className="fixed left-0 top-0 w-full h-full z-[9999] pointer-events-none"
                    style={{}}
                  >
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-40 w-[95vw] max-w-5xl bg-white border border-[#cf1717] rounded-xl shadow-2xl p-6 flex flex-col pointer-events-auto"
                      style={{ minWidth: '320px' }}
                      onMouseEnter={() => setActiveMenu(item.id)}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                        {item.submenu.map((submenu) => (
                          <div key={submenu.id} className="flex-1 min-w-[180px] max-w-xs">
                            <div className="mb-2 border-b border-[#cf1717] pb-1">
                              <h3 className="text-base font-bold text-[#cf1717] mb-0.5">{submenu.title}</h3>
                            </div>
                            <ul className="space-y-1 mt-2">
                              {submenu.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <a
                                    href={subItem.link}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-[#cf1717]/10 hover:text-[#cf1717] transition group"
                                  >
                                    <span className="inline-block w-2 h-2 rounded-full bg-[#cf1717] opacity-60 group-hover:opacity-100"></span>
                                    <span>{subItem.title}</span>
                                    {subItem.hasChildren && (
                                      <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    )}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Mobile Sidebar */}
      {isMobile && mobileSidebarOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setMobileSidebarOpen(false)}></div>
          {/* Sidebar */}
          <div className="relative w-80 max-w-full h-full bg-white shadow-2xl border-r border-[#cf1717] flex flex-col animate-slideInLeft">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[#cf1717] text-2xl z-10"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex-1 overflow-y-auto pt-8 pb-4 px-4">
              <ul className="space-y-2">
                {fullMenuData.map((item) => (
                  <li key={item.id}>
                    <button
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-md font-semibold text-gray-800 hover:bg-[#f7eaea] hover:text-[#cf1717] transition',
                        activeSidebarMenu === item.id ? 'bg-[#f7eaea] text-[#cf1717]' : ''
                      )}
                      onClick={() => setActiveSidebarMenu(activeSidebarMenu === item.id ? null : item.id)}
                    >
                      <span>{item.title}</span>
                      <svg className={cn('w-4 h-4 ml-2 transition-transform', activeSidebarMenu === item.id ? 'rotate-90' : '')} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {activeSidebarMenu === item.id && item.submenu && (
                      <div className="pl-4 mt-1 border-l-2 border-[#cf1717]">
                        {item.submenu.map((submenu) => (
                          <div key={submenu.id} className="mb-2">
                            <h3 className="text-base font-bold text-[#cf1717] mb-1 mt-2">{submenu.title}</h3>
                            <ul className="space-y-1">
                              {submenu.items.map((subItem) => (
                                <li key={subItem.id}>
                                  <a
                                    href={subItem.link}
                                    className="block py-1.5 text-sm text-gray-700 hover:text-[#cf1717]"
                                  >
                                    {subItem.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style>{`
        .bounce-text {
          animation: bounceIn 0.6s ease-in-out;
        }
        @keyframes bounceIn {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(10%); opacity: 1; }
          100% { transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; background: #f7eaea; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cf1717; border-radius: 8px; }
        @media (max-width: 1023px) {
          .animate-slideInLeft { animation: slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1) both; }
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        }
      `}</style>
    </>
  );
};

export default MegaMenu;
