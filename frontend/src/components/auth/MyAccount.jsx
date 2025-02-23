import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../../services/authService';

function MyAccount() {
    // const [userInfo, setUserInfo] = useState(null);
    const [userData, setUserData] = useState({
        shippingAddress: { street: "", city: "", state: "", zip: "", country: "" },
        paymentMethod: "COD",
    });
    useEffect(() => {   
    // const fetchUser = async () => {
    //     try {
    //         const user = await getUserInfo(); // Call the function correctly
    //         setUserInfo(user.userInfo);
    //         // console.log(userInfo.name);
    //     } catch (error) {
    //         console.error("Error fetching user info:", error);
    //     }
    // };
    // fetchUser();
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData);
    };
    return (
        <>
            <div className="input-box-form mt-[20px]">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap mx-[-12px]">
                        {/* First Name */}
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                            <div className="input-item mb-[24px]">
                                <label className="block text-[14px] font-medium text-secondary mb-[8px]">First Name *</label>
                                <input type="text" name="firstName" placeholder="Enter your First Name" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" value={userInfo.name ?? ''} required />
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
                                <input type="text" name="street" onChange={handleChange} value={userData.shippingAddress.street} placeholder="Address Line 1" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
                            </div>
                        </div>                                            

                        {/* Country Dropdown */}
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                            <div className="input-item mb-[24px]">
                                <label className="block text-[14px] font-medium text-secondary mb-[8px]">Country *</label>
                                <Select
                                    options={countries}
                                    value={countries.find(option => option.value === userData.shippingAddress.country)}
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
                                <label className="block text-[14px] font-medium text-secondary mb-[8px]">State *</label>
                                <Select
                                    options={states}
                                    value={states.find(option => option.value === userData.shippingAddress.state)}
                                    onChange={handleSelectChange}
                                    placeholder="Select Region/State"
                                    isSearchable
                                    className="w-full"
                                    name="state"
                                />
                            </div>
                        </div>

                        {/* City Dropdown */}
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                            <div className="input-item mb-[24px]">
                                <label className="block text-[14px] font-medium text-secondary mb-[8px]">City *</label>
                                <Select
                                    options={cities}
                                    value={cities.find(option => option.value === userData.shippingAddress.city)}
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
                                <input type="text" name="zip" onChange={handleChange} value={userData.shippingAddress.zip} placeholder="Post Code" className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]" required />
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
        </>
    )
}

export default MyAccount