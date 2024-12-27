import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CartPopup from "./CartPopup";
import { Link } from "react-router-dom";

function HeaderTop (props) {
const cartItems = useSelector((state) => state.cart.items);
const cartCount = Object.values(cartItems).length;
const wishItems = useSelector((state) => state.wishlist.items);
const wishCount = Object.values(wishItems).length;
const [cartPopup,setCartPopup] = useState(false);  
  return (
        <>
            <div className="top-header py-[10px] max-[991px]:py-[5px]">
                <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
                    <div className="flex flex-wrap w-full">
                        <div className="w-full px-[12px]">
                            <div className="inner-top-header flex justify-between items-center max-[767px]:flex-col">
                                <div className="cols bb-logo-detail flex max-[767px]:justify-between">
                                    {/* <!-- Header Logo Start --> */}
                                    <div className="header-logo flex items-center max-[575px]:justify-center">
                                        <Link to="/">
                                            {/* <img src="/img/logo/logo.png" alt="logo" className="light w-[125px] max-[991px]:w-[115px] block"/>
                                            <img src="/img/logo/logo-dark.png" alt="logo" className="dark w-[125px] max-[991px]:w-[115px] hidden"/> */}
                                            <img src="/img/logo/bbscartLogo.png" className="max-w-[150px]" alt="header logo" />
                                        </Link>
                                    </div>
                                    {/* <!-- Header Logo End --> */}
                                </div>
                                <div className="cols flex justify-center">
                                    <div className="header-search w-[600px] max-[1399px]:w-[500px] max-[1199px]:w-[400px] max-[991px]:w-full max-[991px]:min-w-[300px] max-[767px]:py-[15px] max-[480px]:min-w-[auto]">
                                        <form className="bb-btn-group-form flex relative max-[991px]:ml-[20px] max-[767px]:m-[0]" action="#">
                                            {/* <div className="inner-select border-r-[1px] border-solid border-[#eee] h-full px-[20px] flex items-center absolute top-[0] left-[0] max-[991px]:hidden">
                                                <div className="custom-select w-[100px] capitalize text-[#777] flex items-center justify-between transition-all duration-[0.2s] ease-in text-[14px] relative">
                                                    <select>
                                                        <option value="option1">vegetables</option>
                                                        <option value="option2">Cold Drinks</option>
                                                        <option value="option3">Fruits</option>
                                                        <option value="option4">Bakery</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                            <input className="form-control bb-search-bar bg-[#fff] block w-full min-h-[45px] h-[48px] py-[10px] pr-[10px] pl-[160px] max-[991px]:min-h-[40px] max-[991px]:h-[40px] max-[991px]:p-[10px] text-[14px] font-normal leading-[1] text-[#777] rounded-[10px] border-[1px] border-solid border-[#eee] tracking-[0.5px]" placeholder="Search products..." type="text"/>
                                            <button className="submit absolute top-[0] left-[auto] right-[0] flex items-center justify-center w-[45px] h-full bg-transparent text-[#555] text-[16px] rounded-[0] outline-[0] border-[0] padding-[0]" type="submit">
                                                <i className="ri-search-line text-[18px] leading-[12px] text-[#555]"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div className="cols bb-icons flex justify-center">
                                    <div className="bb-flex-justify max-[575px]:flex max-[575px]:justify-between">
                                        <div className="bb-header-buttons h-full flex justify-end items-center">
                                            <div className="bb-acc-drop relative">
                                                <a href="" className="bb-header-btn bb-header-user dropdown-toggle bb-user-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center whitespace-nowrap ml-[30px] max-[1199px]:ml-[20px] max-[767px]:ml-[0]" title="Account">
                                                    <div className="header-icon relative flex">
                                                        <svg className="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                            <path className="fill-[#6c7fd8]" d="M512.476 648.247c-170.169 0-308.118-136.411-308.118-304.681 0-168.271 137.949-304.681 308.118-304.681 170.169 0 308.119 136.411 308.119 304.681C820.594 511.837 682.645 648.247 512.476 648.247L512.476 648.247zM512.476 100.186c-135.713 0-246.12 109.178-246.12 243.381 0 134.202 110.407 243.381 246.12 243.381 135.719 0 246.126-109.179 246.126-243.381C758.602 209.364 648.195 100.186 512.476 100.186L512.476 100.186zM935.867 985.115l-26.164 0c-9.648 0-17.779-6.941-19.384-16.35-2.646-15.426-6.277-30.52-11.142-44.95-24.769-87.686-81.337-164.13-159.104-214.266-63.232 35.203-134.235 53.64-207.597 53.64-73.555 0-144.73-18.537-208.084-53.922-78 50.131-134.75 126.68-159.564 214.549 0 0-4.893 18.172-11.795 46.4-2.136 8.723-10.035 14.9-19.112 14.9L88.133 985.116c-9.415 0-16.693-8.214-15.47-17.452C91.698 824.084 181.099 702.474 305.51 637.615c58.682 40.472 129.996 64.267 206.966 64.267 76.799 0 147.968-23.684 206.584-63.991 124.123 64.932 213.281 186.403 232.277 329.772C952.56 976.901 945.287 985.115 935.867 985.115L935.867 985.115z" />
                                                        </svg>
                                                    </div>
                                                    <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                        <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap">Account</span>
                                                        <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750]  tracking-[0.03rem] whitespace-nowrap">Login</span>
                                                    </div>
                                                </a>
                                                <ul className="bb-dropdown-menu min-w-[150px] py-[10px] px-[5px] transition-all duration-[0.3s] ease-in-out mt-[25px] absolute z-[16] text-left opacity-[0] right-[auto] bg-[#fff] border-[1px] border-solid border-[#eee] block rounded-[10px]">
                                                    <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"><a className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]" href="register.html">Register</a></li>
                                                    <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"><a className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]" href="checkout.html">Checkout</a></li>
                                                    <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"><a className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-[#6c7fd8] leading-[22px] block w-full font-normal tracking-[0.03rem]" href="login.html">Login</a></li>
                                                </ul>
                                            </div>
                                            <a href="wishlist.html" className="bb-header-btn bb-wish-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]" title="Wishlist">
                                                <div className="header-icon relative flex">
                                                    <svg className="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="fill-[#6c7fd8]" d="M512 128l121.571556 250.823111 276.366222 39.111111-199.281778 200.504889L756.622222 896 512 769.536 267.377778 896l45.852444-277.617778-199.111111-200.504889 276.366222-39.111111L512 128m0-56.888889a65.962667 65.962667 0 0 0-59.477333 36.807111l-102.940445 213.703111-236.828444 35.214223a65.422222 65.422222 0 0 0-52.366222 42.979555 62.577778 62.577778 0 0 0 15.274666 64.967111l173.511111 173.340445-40.248889 240.355555a63.374222 63.374222 0 0 0 26.993778 62.577778 67.242667 67.242667 0 0 0 69.632 3.726222L512 837.290667l206.478222 107.605333a67.356444 67.356444 0 0 0 69.688889-3.726222 63.374222 63.374222 0 0 0 26.908445-62.577778l-40.277334-240.355556 173.511111-173.340444a62.577778 62.577778 0 0 0 15.246223-64.967111 65.422222 65.422222 0 0 0-52.366223-42.979556l-236.8-35.214222-102.968889-213.703111A65.848889 65.848889 0 0 0 512 71.111111z" fill="#364C58" />
                                                    </svg>
                                                </div>
                                                <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                    <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"><b className="bb-wishlist-count">{wishCount}</b> items</span>
                                                    <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750]  tracking-[0.03rem] whitespace-nowrap">Wishlist</span>
                                                </div>
                                            </a>
                                            <button onClick={()=> setCartPopup(true)} className="bb-header-btn bb-cart-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]" title="Cart">
                                                <div className="header-icon relative flex">
                                                    <svg className="svg-icon w-[30px] h-[30px] max-[1199px]:w-[25px] max-[1199px]:h-[25px] max-[991px]:w-[22px] max-[991px]:h-[22px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <path className="fill-[#6c7fd8]" d="M351.552 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C415.52 860.064 386.88 831.424 351.552 831.424L351.552 831.424 351.552 831.424zM799.296 831.424c-35.328 0-63.968 28.64-63.968 63.968 0 35.328 28.64 63.968 63.968 63.968 35.328 0 63.968-28.64 63.968-63.968C863.264 860.064 834.624 831.424 799.296 831.424L799.296 831.424 799.296 831.424zM862.752 799.456 343.264 799.456c-46.08 0-86.592-36.448-92.224-83.008L196.8 334.592 165.92 156.128c-1.92-15.584-16.128-28.288-29.984-28.288L95.2 127.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-32 32-32l40.736 0c46.656 0 87.616 36.448 93.28 83.008l30.784 177.792 54.464 383.488c1.792 14.848 15.232 27.36 28.768 27.36l519.488 0c17.696 0 32 14.304 32 31.968S880.416 799.456 862.752 799.456L862.752 799.456zM383.232 671.52c-16.608 0-30.624-12.8-31.872-29.632-1.312-17.632 11.936-32.928 29.504-34.208l433.856-31.968c15.936-0.096 29.344-12.608 31.104-26.816l50.368-288.224c1.28-10.752-1.696-22.528-8.128-29.792-4.128-4.672-9.312-7.04-15.36-7.04L319.04 223.84c-17.664 0-32-14.336-32-31.968 0-17.664 14.336-31.968 32-31.968l553.728 0c24.448 0 46.88 10.144 63.232 28.608 18.688 21.088 27.264 50.784 23.52 81.568l-50.4 288.256c-5.44 44.832-45.92 81.28-92 81.28L385.6 671.424C384.8 671.488 384 671.52 383.232 671.52L383.232 671.52zM383.232 671.52" />
                                                    </svg>
                                                    <span className="main-label-note-new"></span>
                                                </div>
                                                <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                    <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-[#3d4750] mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"><b className="bb-cart-count">{cartCount}</b> items</span>
                                                    <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-[#3d4750]  tracking-[0.03rem] whitespace-nowrap">Cart</span>
                                                </div>
                                            </button>
                                            <button onClick={props.toggleMenu} className="bb-toggle-menu md:hidden flex max-[991px]:ml-[20px]">
                                                <div className="header-icon">
                                                    <i className="ri-menu-3-fill text-[22px] text-[#6c7fd8]"></i>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CartPopup cartPopup={cartPopup} setCartPopup={setCartPopup}/>
        </>
  )
}

export default HeaderTop