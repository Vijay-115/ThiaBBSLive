import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../slice/orderSlice';
import Select from "react-select";
import toast from "react-hot-toast";
import { removeFromCart } from '../../slice/cartSlice';

function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const cartTotal = Object.values(cartItems).reduce(
        (total, item) => total + (item.quantity * item.product.price || 0),
        0
      ).toFixed(2);
    const deliveryCharge = 0;
    const { loading, order, error } = useSelector((state) => state.order);

    const [orderData, setOrderData] = useState({
        userId: "", // Dynamic user ID
        products: cartItems,
        totalAmount: cartTotal,
        shippingAddress: { street: "", city: "", state: "", zip: "", country: "" },
        paymentMethod: "COD",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            shippingAddress: { ...prevData.shippingAddress, [name]: value },
        }));
        console.log(orderData);
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setOrderData((prevData) => ({
            ...prevData,
            shippingAddress: { ...prevData.shippingAddress, [name]: selectedOption.value },
        }));
        console.log(orderData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(orderData);
    
        dispatch(placeOrder(orderData))
            .then((response) => {
                console.log("Dispatch Response:", response);
                if (response.payload?.success) {
                    Object.values(cartItems).forEach((item) => {
                        console.log(item);
                        dispatch(removeFromCart(item.product._id));  // ✅ Fix: Dispatch for each item
                    });    
                    toast.success("Order placed successfully!");
                    navigate("/");
                } else {
                    toast.error(response.payload?.message || "Failed to place order.");
                }
            })
            .catch((error) => {
                toast.error("Something went wrong. Please try again.");
                console.error("Order Error:", error);
            });
    };
    

    const cityOptions = [
        { value: "city1", label: "City 1" },
        { value: "city2", label: "City 2" },
        { value: "city3", label: "City 3" },
        { value: "city4", label: "City 4" },
    ];

    const countryOptions = [
        { value: "country1", label: "Country 1" },
        { value: "country2", label: "Country 2" },
        { value: "country3", label: "Country 3" },
        { value: "country4", label: "Country 4" },
    ];

    const regionOptions = [
        { value: "region1", label: "Region/State 1" },
        { value: "region2", label: "Region/State 2" },
        { value: "region3", label: "Region/State 3" },
        { value: "region4", label: "Region/State 4" },
    ];

    useEffect(() => {
        console.log("cartTotal:", cartTotal); // Debugging
    }, [cartItems]);

    const location = useLocation();

    useEffect(() => {
        // Scroll to top whenever the route changes
        window.scrollTo(0, 0);
    }, [location]);


    useEffect(() => {
        window.scrollTo({
            top: 0, // Scroll to the top
            behavior: 'smooth', // Enables smooth scrolling
        });
    }, []);    
      
    return (
        <>
            <section className="section-checkout bbscontainer pt-[50px] max-[1199px]:pt-[35px]">
                <div className="flex flex-wrap justify-between relative items-center">
                    <div className="flex flex-wrap w-full mb-[-24px]">
                        <div className="min-[992px]:w-[33.33%] w-full px-[12px] mb-[24px]">
                            <div className="bb-checkout-sidebar mb-[-24px]">
                                <div className="checkout-items border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px] mb-[24px] aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                                    <div className="sub-title mb-[12px]">
                                        <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-secondary">summary</h4>
                                    </div>
                                    <div className="checkout-summary mb-[20px] border-b-[1px] border-solid border-[#eee]">
                                        <ul className="mb-[20px]">
                                            <li className="flex justify-between leading-[28px] mb-[8px]">
                                                <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">sub-total</span>
                                                <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">$56</span>
                                            </li>
                                            <li className="flex justify-between leading-[28px] mb-[8px]">
                                                <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">Delivery Charges</span>
                                                <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">$56</span>
                                            </li>
                                            <li className="flex justify-between leading-[28px] mb-[8px]">
                                                <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">Coupon Discount</span>
                                                <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-secondary">
                                                    <a href="" className="apply drop-coupon font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#ff0000]">Apply Coupon</a>
                                                </span>
                                            </li>
                                            <li className="flex justify-between leading-[28px]">
                                                <div className="coupon-down-box w-full">
                                                    <form method="post" className="relative">
                                                        <input className="bb-coupon w-full p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]" type="text" placeholder="Enter Your coupon Code" name="bb-coupon" required=""/>
                                                        <button className="bb-btn-2 transition-all duration-[0.3s] ease-in-out my-[8px] mr-[8px] flex justify-center items-center absolute right-[0] top-[0] bottom-[0] font-Poppins leading-[28px] tracking-[0.03rem] py-[2px] px-[12px] text-[13px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-secondary" type="submit">Apply</button>
                                                    </form>
                                                </div>
                                            </li>                                    
                                        </ul>
                                    </div>
                                    <div className="bb-checkout-pro mb-[-24px]">
                                    {cartItems && Object.keys(cartItems).length > 0 ? (
                                        Object.values(cartItems).map(({ product, quantity }) => (
                                            <div key={product._id} className="pro-items p-[15px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] flex mb-[24px] max-[420px]:flex-col">
                                                <div className="image mr-[15px] max-[420px]:mr-[0] max-[420px]:mb-[15px]">
                                                    <img src={import.meta.env.VITE_API_URL+''+product.product_img ?? ''} alt="new-product-1" className="max-w-max w-[100px] h-[100px] border-[1px] border-solid border-[#eee] rounded-[20px] max-[1399px]:h-[80px] max-[1399px]:w-[80px]"/>
                                                </div>
                                                <div className="items-contact">
                                                    <h4 className="text-[16px]"><Link to={`/product/${product._id}`} className="font-Poppins tracking-[0.03rem] text-[15px] font-medium leading-[18px] text-secondary">{product.name}</Link></h4>
                                                    <span className="bb-pro-rating flex">
                                                        {
                                                            Array.from({ length: 5 }).map((_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`ri-star-fill float-left text-[15px] mr-[3px] ${
                                                                index < product.rating ? 'text-[#e7d52e]' : 'text-[#777]'
                                                                }`}
                                                            ></i>
                                                            ))
                                                        }
                                                    </span>
                                                    <div className="inner-price flex items-center justify-left mb-[4px]">
                                                        <span className="new-price font-Poppins text-secondary font-semibold leading-[26px] tracking-[0.02rem] text-[15px]">{product.price}</span>
                                                        <span className="old-price ml-[10px] font-Poppins text-[#777] font-semibold leading-[26px] tracking-[0.02rem] text-[15px]"> * {quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ): (
                                        <div className="w-full text-center">
                                            <h3 className="font-Poppins mt-5 text-[16px] text-secondary">Your cart is empty.</h3>
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="checkout-items border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px] mb-[24px] aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                    <div className="sub-title mb-[12px]">
                                        <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-secondary">Delivery Method</h4>
                                    </div>
                                    <div className="checkout-method mb-[24px]">
                                        <span className="details font-Poppins leading-[26px] tracking-[0.02rem] text-[15px] font-medium text-secondary">Please select the preferred shipping method to use on this
                                            order.</span>
                                        <div className="bb-del-option flex mt-[12px] max-[480px]:flex-col">
                                            <div className="inner-del w-[50%] max-[480px]:w-full max-[480px]:mb-[8px]">
                                                <span className="bb-del-head font-Poppins leading-[26px] tracking-[0.02rem] text-[15px] font-semibold text-secondary">Free Shipping</span>
                                                <div className="radio-itens">
                                                    <input type="radio" id="rate1" name="rate" className="w-full text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]" />
                                                    <label for="rate1" className="relative pl-[26px] cursor-pointer leading-[16px] inline-block text-secondary tracking-[0]">Rate - $0 .00</label>
                                                </div>
                                            </div>
                                            <div className="inner-del w-[50%] max-[480px]:w-full">
                                                <span className="bb-del-head font-Poppins leading-[26px] tracking-[0.02rem] text-[15px] font-semibold text-secondary">Flat Rate</span>
                                                <div className="radio-itens">
                                                    <input type="radio" id="rate2" name="rate" className="w-full text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"/>
                                                    <label for="rate2" className="relative pl-[26px] cursor-pointer leading-[16px] inline-block text-secondary tracking-[0]">Rate - $5.00</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="about-order">
                                        <h5 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[12px] text-[15px] font-medium text-secondary">Add Comments About Your Order</h5>
                                        <textarea name="your-commemt" placeholder="Comments" className="w-full h-[100px] p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"></textarea>
                                    </div>
                                </div>
                                <div className="checkout-items border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px] mb-[24px] aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
                                    <div className="sub-title mb-[12px]">
                                        <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-secondary">Payment Method</h4>
                                    </div>
                                    <div className="checkout-method mb-[24px]">
                                        <span className="details font-Poppins leading-[26px] tracking-[0.02rem] text-[15px] font-medium text-secondary">Please select the preferred shipping method to use on this
                                            order.</span>
                                        <div className="bb-del-option mt-[12px] flex max-[480px]:flex-col">
                                            <div className="inner-del w-[50%] max-[480px]:w-full">
                                                <div className="radio-itens">
                                                    <input type="radio" id="Cash1" name="radio-itens" className="w-full p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"/>
                                                    <label for="Cash1" className="relative pl-[26px] cursor-pointer leading-[16px] inline-block text-secondary tracking-[0]">Cash On Delivery</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="about-order">
                                        <h5 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[12px] text-[15px] font-medium text-secondary">Add Comments About Your Order</h5>
                                        <textarea name="your-commemt" placeholder="Comments" className="w-full h-[100px] p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="min-[992px]:w-[66.66%] w-full px-[12px] mb-[24px]">
                            <div className="bb-checkout-contact border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px] aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                                <div className="main-title mb-[20px]">
                                    <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-secondary">New Customer</h4>
                                </div>
                                <label className="inner-title font-Poppins leading-[26px] tracking-[0.02rem] mb-[6px] text-[16px] inline-block font-medium text-secondary">Checkout Options</label>
                                <div className="checkout-radio flex mb-[10px] max-[480px]:flex-col">
                                    <div className="radio-itens mr-[20px]">
                                        <input type="radio" id="del1" name="account" className="w-auto mr-[2px] p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]" />
                                        <label for="del1" className="text-[14px] font-normal text-secondary relative pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]">Register Account</label>
                                    </div>
                                    <div className="radio-itens">
                                        <input type="radio" id="del2" name="account" className="w-auto mr-[2px] p-[10px] text-[14px] font-normal text-secondary border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"/>
                                        <label for="del2" className="text-[14px] font-normal text-secondary relative pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]">Guest Account</label>
                                    </div>
                                </div>
                                <p className="font-Poppins leading-[28px] tracking-[0.03rem] mb-[16px] text-[14px] font-light text-secondary">By creating an account you will be able to shop faster, be up to date on an order's status,
                                    and keep track of the orders you have previously made.</p>
                                <div className="inner-button mb-[20px]">
                                    <a href="" className="bb-btn-2 inline-block items-center justify-center check-btn transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-secondary">Continue</a>
                                </div>
                                <div className="main-title mb-[20px]">
                                    <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-secondary">Billing Details</h4>
                                </div>
                                <div className="checkout-radio flex mb-[10px] max-[480px]:flex-col">
                                    <div className="radio-itens mr-[20px]">
                                        <input type="radio" id="address1" name="address" className="w-auto mr-[2px] p-[10px]" />
                                        <label for="address1" className="relative font-normal text-[14px] text-secondary pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]">I want to use an existing address</label>
                                    </div>
                                    <div className="radio-itens">
                                        <input type="radio" id="address2" name="address" className="w-auto mr-[2px] p-[10px]"/>
                                        <label for="address2" className="relative font-normal text-[14px] text-secondary pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]">I want to use new address</label>
                                    </div>
                                </div>
                                <div className="input-box-form mt-[20px]">
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex flex-wrap mx-[-12px]">
                                            {/* First Name */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">First Name *</label>
                                                    <input type="text" name="firstName" placeholder="Enter your First Name" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
                                                </div>
                                            </div>

                                            {/* Last Name */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">Last Name *</label>
                                                    <input type="text" name="lastName" placeholder="Enter your Last Name" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">Address *</label>
                                                    <input type="text" name="street" onChange={handleChange} value={orderData.shippingAddress.street} placeholder="Address Line 1" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
                                                </div>
                                            </div>

                                            {/* City Dropdown */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">City *</label>
                                                    <Select
                                                        options={cityOptions}
                                                        value={cityOptions.find(option => option.value === orderData.shippingAddress.city)}
                                                        onChange={handleSelectChange}
                                                        placeholder="Select City"
                                                        isSearchable
                                                        className="w-full"
                                                        name="city"
                                                    />
                                                </div>
                                            </div>

                                            {/* Post Code */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">Post Code *</label>
                                                    <input type="text" name="zip" onChange={handleChange} value={orderData.shippingAddress.zip} placeholder="Post Code" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
                                                </div>
                                            </div>

                                            {/* Country Dropdown */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">Country *</label>
                                                    <Select
                                                        options={countryOptions}
                                                        value={countryOptions.find(option => option.value === orderData.shippingAddress.country)}
                                                        onChange={handleSelectChange}
                                                        placeholder="Select Country"
                                                        isSearchable
                                                        className="w-full"
                                                        name="country"
                                                    />
                                                </div>
                                            </div>

                                            {/* Region/State Dropdown */}
                                            <div className="min-[992px]:w-[50%] w-full px-[12px]">
                                                <div className="input-item mb-[24px]">
                                                    <label className="block text-[14px] font-medium text-secondary mb-[8px]">Region/State *</label>
                                                    <Select
                                                        options={regionOptions}
                                                        value={regionOptions.find(option => option.value === orderData.shippingAddress.state)}
                                                        onChange={handleSelectChange}
                                                        placeholder="Select Region/State"
                                                        isSearchable
                                                        className="w-full"
                                                        name="state"
                                                    />
                                                </div>
                                            </div>

                                            {/* Place Order Button */}
                                            <div className="w-full px-[12px]">
                                                <div className="input-button">
                                                    <button type="submit" className="bb-btn-2 inline-block py-[10px] px-[25px] text-[14px] font-medium text-white bg-[#6c7fd8] rounded-[10px] hover:bg-transparent hover:border-[#3d4750] hover:text-secondary border">
                                                        Place Order
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 
        </>
    );
}

export default CheckoutPage;