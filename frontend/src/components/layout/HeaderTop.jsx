import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartPopup from "./CartPopup";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { loadUser, logout } from "../../services/authService";
import { fetchCartItems } from "../../slice/cartSlice";
import axios from "axios";

function HeaderTop(props) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    // Load user details on mount
    useEffect(() => {
        if(isAuthenticated){
            dispatch(loadUser());
        }
    }, [dispatch]);
    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = Object.values(cartItems).length;
    const wishItems = useSelector((state) => state.wishlist.items);
    const wishCount = Object.values(wishItems).length;
    const [cartPopup, setCartPopup] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout(dispatch);
            toast.success("Successfully Logged Out");

            // Redirect to home page
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Logout Failed");
        }
    };

    const userRole = user?.role;

    const roleDashboardRoutes = {
        admin: "/admin/dashboard",
        seller: "/seller/dashboard",
        agent: "/agent/dashboard",
        customer: "/customer/dashboard",
        franchise: "/franchise/dashboard",
        territory_head: "/territory/dashboard",
    };

    const dashboardPath = userRole && roleDashboardRoutes[userRole];

    return (
        <>
            <div className="top-header py-[10px] max-[991px]:py-[5px] bbscontainer">
                <div className="flex flex-wrap justify-between relative items-center">
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
                                            <input className="form-control bb-search-bar bg-[#fff] block w-full min-h-[45px] h-[48px] py-[10px] pr-[10px] max-[991px]:min-h-[40px] max-[991px]:h-[40px] max-[991px]:p-[10px] text-[14px] font-normal leading-[1] text-[#777] rounded-[10px] border-[1px] border-solid border-[#eee] tracking-[0.5px]" placeholder="Search products..." type="text" />
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
                                                <div className="bb-header-btn bb-header-user dropdown-toggle bb-user-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center whitespace-nowrap ml-[30px] max-[1199px]:ml-[20px] max-[767px]:ml-[0] group" title="Account">
                                                    <div className="header-icon relative flex">
                                                        <img src="/img/header/profile.png" alt="profile" className="w-[35px] h-[35px] relative -right-1" />
                                                    </div>
                                                    <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                        {!isAuthenticated ? (
                                                            <>
                                                                <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-secondary mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap">Account</span>
                                                                <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-secondary  tracking-[0.03rem] whitespace-nowrap">Login</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-secondary mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap">Welcome!</span>
                                                                <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-secondary  tracking-[0.03rem] whitespace-nowrap">{user?.name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <ul className="hidden absolute top-[33px] bg-white z-50 rounded-[10px] group-hover:block shadow-md p-3">
                                                        {!isAuthenticated ? (
                                                            <>
                                                                <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-secondary font-light leading-[28px] tracking-[0.03rem]">
                                                                    <Link to="/register" className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full font-normal tracking-[0.03rem] mb-2">
                                                                        Register
                                                                    </Link>
                                                                </li>
                                                                <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-secondary font-light leading-[28px] tracking-[0.03rem]">
                                                                    <Link to="/login" className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full font-normal tracking-[0.03rem]">
                                                                        Login
                                                                    </Link>
                                                                </li>
                                                            </>
                                                        ) : (
                                                            <li className="py-[4px] px-[15px] m-[0] font-Poppins text-[15px] text-secondary font-light leading-[28px] tracking-[0.03rem]">
                                                                <Link to="/my-account" className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full font-normal tracking-[0.03rem] mb-2">
                                                                    Profile
                                                                </Link>
                                                                {dashboardPath && (
                                                                    <Link
                                                                        to={dashboardPath}
                                                                        className="dropdown-item transition-all duration-300 ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full font-normal tracking-[0.03rem] mb-2"
                                                                    >
                                                                        Dashboard
                                                                    </Link>
                                                                )}
                                                                <Link to="/checkout" className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full font-normal tracking-[0.03rem] mb-2">
                                                                    Checkout
                                                                </Link>
                                                                <button onClick={handleLogout} className="dropdown-item transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] hover:text-primary leading-[22px] block w-full text-left font-normal tracking-[0.03rem]">
                                                                    Logout
                                                                </button>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                            <Link to="/wishlist" className="bb-header-btn bb-wish-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]" title="Wishlist">
                                                <div className="header-icon relative flex">
                                                    <img src="/img/header/heart.png" alt="profile" className="w-[35px] h-[35px] relative -right-1" />
                                                </div>
                                                <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                    <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-secondary mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"><b className="bb-wishlist-count">{wishCount}</b> items</span>
                                                    <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-secondary  tracking-[0.03rem] whitespace-nowrap">Wishlist</span>
                                                </div>
                                            </Link>
                                            <button onClick={() => { setCartPopup(true); dispatch(fetchCartItems()); console.log(cartPopup) }} className="bb-header-btn bb-cart-toggle transition-all duration-[0.3s] ease-in-out relative flex w-[auto] items-center ml-[30px] max-[1199px]:ml-[20px]" title="Cart">
                                                <div className="header-icon relative flex">
                                                    <img src="/img/header/cart.png" alt="profile" className="w-[35px] h-[35px] relative -right-2" />
                                                    <span className="main-label-note-new"></span>
                                                </div>
                                                <div className="bb-btn-desc flex flex-col ml-[10px] max-[1199px]:hidden">
                                                    <span className="bb-btn-title font-Poppins transition-all duration-[0.3s] ease-in-out text-[12px] leading-[1] text-secondary mb-[4px] tracking-[0.6px] capitalize font-medium whitespace-nowrap"><b className="bb-cart-count">{cartCount}</b> items</span>
                                                    <span className="bb-btn-stitle font-Poppins transition-all duration-[0.3s] ease-in-out text-[14px] leading-[16px] font-semibold text-secondary  tracking-[0.03rem] whitespace-nowrap">Cart</span>
                                                </div>
                                            </button>
                                            <button onClick={props.toggleMenu} className="bb-toggle-menu md:hidden flex max-[991px]:ml-[20px]">
                                                <div className="header-icon">
                                                    <i className="ri-menu-3-fill text-[22px] text-primary"></i>
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
            <CartPopup cartPopup={cartPopup} setCartPopup={setCartPopup} />
        </>
    )
}

export default HeaderTop