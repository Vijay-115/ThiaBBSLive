import React, { useState } from 'react';
import { Link } from "react-router-dom"; // Import Link for navigation

function NavItems({menuOpen,closeMenu}) {

const [heading,setHeading] = useState('');
const [subHeading,setSubHeading] = useState('');
console.log('NavmenuOpen',menuOpen);

const menuItems = [
    {
        label: "Home",
        url: "/",
        dropdown: [],
    },
    {
        label: "Groceries",
        url: "/product/category/groceries",
        dropdown: [
        {
            label: "Fruits & Vegetables",
            url: "/groceries/fruits-vegetables",
            subDropdown: [
            { label: "Fresh Fruits", url: "/groceries/fruits-vegetables/fruits" },
            { label: "Fresh Vegetables", url: "/groceries/fruits-vegetables/vegetables" },
            ],
        },
        {
            label: "Beverages",
            url: "/groceries/beverages",
            subDropdown: [
            { label: "Juices", url: "/groceries/beverages/juices" },
            { label: "Soft Drinks", url: "/groceries/beverages/soft-drinks" },
            ],
        },
        {
            label: "Snacks",
            url: "/groceries/snacks",
            subDropdown: [
            { label: "Chips", url: "/groceries/snacks/chips" },
            { label: "Cookies", url: "/groceries/snacks/cookies" },
            ],
        },
        ],
    },
    {
        label: "Jewelry",
        url: "/product/category/womens-jewellery",
        dropdown: [
        {
            label: "Gold",
            url: "/jewelry/gold",
            subDropdown: [
            { label: "Necklaces", url: "/jewelry/gold/necklaces" },
            { label: "Earrings", url: "/jewelry/gold/earrings" },
            ],
        },
        {
            label: "Silver",
            url: "/jewelry/silver",
            subDropdown: [
            { label: "Bracelets", url: "/jewelry/silver/bracelets" },
            { label: "Rings", url: "/jewelry/silver/rings" },
            ],
        },
        {
            label: "Diamonds",
            url: "/jewelry/diamonds",
            subDropdown: [
            { label: "Rings", url: "/jewelry/diamonds/rings" },
            { label: "Pendants", url: "/jewelry/diamonds/pendants" },
            ],
        },
        ],
    },
    {
        label: "Offers",
        url: "/offers",
        dropdown: [],
    },
    {
        label: "Contact Us",
        url: "/contact",
        dropdown: [],
    },
];
      

  return (
    <>
        <div className={`nav-items-sec md:justify-center absolute ${menuOpen ? 'left-0' : 'left-[-100%]'} top-0 bottom-0 md:left-0 pt-20  md:pt-0 pl-10 md:pl-0 m-auto md:relative md flex flex-col md:flex-row md:flex-wrap md:gap-10 gap-y-3 bg-slate-100 w-[300px] md:w-full h-full z-30 ease-in-out duration-300`}>
            <button className='absolute top-5 right-5' onClick={() => closeMenu()}>
                <i className="text-2xl text-red-600 md:hidden ri-close-circle-line"></i>
            </button>
            {
                menuItems.map((menu,index) => 
                menu.dropdown.length === 0 
                    ? <div key={index} className='nav-items'>
                        <Link to={menu.url} className="no-underline">
                            <span className='hover:text-blue-500 transition ease-in-out delay-100' >{menu.label}</span>
                        </Link>
                      </div> 
                    : <div key={index} className='nav-items dropdown group relative'>
                        <Link to={menu.url} className="no-underline">
                        <span 
                        onClick={() => {
                            heading !== menu.label ? setHeading(menu.label) : setHeading('');
                            setSubHeading('');
                            }
                        } 
                        className='hover:text-blue-500 transition ease-in-out delay-100' >
                        {menu.label}
                        <i className={`ri-arrow-drop-${heading !== menu.label ? 'down' : 'up'}-line`}></i>
                        </span>
                        </Link>
                        <div className='hidden md:block bg-blue-500 border-t rounded-2xl opacity-0 invisible h-0 group-hover:h-[20px] group-hover:opacity-[1] group-hover:visible absolute top-[25px] z-[4] w-full transition ease-in-out delay-150'></div>                        
                        <div className={`hidded md:grid dropdown-item bg-white rounded-2xl shadow-md md:p-5 absolute top-[35px] left-[-30px] z-10 opacity-0 invisible h-0 md:group-hover:h-auto md:group-hover:opacity-[1] md:group-hover:visible transition ease-in-out delay-100`} 
                        style={{ minWidth: `${25 * menu.dropdown.length}vH`, gridTemplateColumns: 'repeat('+menu.dropdown.length+',auto)' }}>
                            {
                                menu.dropdown.map((submenu,index) => 
                                    submenu.subDropdown.length === 0 
                                    ? <div key={index} className='dropdown nav-items'>
                                        <Link to={submenu.url} className="no-underline">
                                        <span className='font-quicksand font-bold text-sm' >{submenu.label}</span>
                                        </Link>
                                        </div> 
                                    : <div key={index} className='sub-dropdown nav-items group'>
                                        <Link to={submenu.url} className="no-underline"><span className='font-quicksand font-bold text-sm' >{submenu.label}</span></Link>
                                        <div className='sub-dropdown-item'>
                                            {
                                                submenu.subDropdown.map((sitems,index) =>
                                                    <div key={index}>
                                                        <Link to={submenu.url} className="no-underline"><span className='text-xs' >{sitems.label}</span></Link>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        </div>
                                )
                            }
                        </div>
                        {/* Mobile Links */}
                        <div className={`
                            ${heading === menu.label ? 'md:hidden' : 'hidden'}    
                        `}>
                        {
                            menu.dropdown.map((submenu,index) => 
                                submenu.subDropdown.length === 0 
                                ? <div key={index} className='dropdown nav-items'>
                                    <span className='font-quicksand font-bold text-xs pl-3' >{submenu.label}</span>
                                    </div> 
                                : <div key={index} className='sub-dropdown nav-items my-2'>
                                    <span onClick={() => subHeading !== submenu.label ? setSubHeading(submenu.label) : setSubHeading('')} className='font-quicksand font-bold text-xs pl-3' >{submenu.label}
                                    <i className={`ri-arrow-drop-${subHeading !== submenu.label ? 'down' : 'up'}-line`}></i>
                                    </span>
                                    <div className={`sub-dropdown-item 
                                          ${subHeading === submenu.label ? 'md:hidden' : 'hidden'}  
                                    `}>
                                        {
                                            submenu.subDropdown.map((sitems,index) =>
                                                <div key={index}>
                                                    <span className='text-xs pl-6' >{sitems.label}</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                    </div>
                            )
                        }
                        </div>
                      </div>
                )
            }
        </div>
    </>
  )
}

export default NavItems