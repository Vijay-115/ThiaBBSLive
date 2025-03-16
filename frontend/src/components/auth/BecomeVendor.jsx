import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from "../../services/authService";
import { useDispatch } from "react-redux";

const BecomeVendor = () => {
    const [vendorData, setVendorData] = useState({
        name: '', email: '', phone: '', password: '',
        pincode: '', country: '', state: '', city: '', taluk: '',
        address: '', gst: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateVendor = () => {
        let formErrors = {};
        if (!vendorData.name) formErrors.name = "Name is required";
        if (!vendorData.email) formErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(vendorData.email)) formErrors.email = "Invalid email";
        if (!vendorData.phone) formErrors.phone = "Phone is required";
        if (!vendorData.password) formErrors.password = "Password is required";
        else if (vendorData.password.length < 6) formErrors.password = "At least 6 characters";
        if (!vendorData.pincode) formErrors.pincode = "Pincode is required";
        if (!vendorData.country) formErrors.country = "Country is required";
        if (!vendorData.state) formErrors.state = "State is required";
        if (!vendorData.city) formErrors.city = "City is required";
        if (!vendorData.taluk) formErrors.taluk = "Taluk is required";
        if (!vendorData.address) formErrors.address = "Address is required";
        if (!vendorData.gst) formErrors.gst = "GST Number is required";

        return formErrors;
    };

    const handleChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    };

    const handleVendorSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateVendor();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors and try again.");
            return;
        }

        try {
            const response = await register(vendorData, dispatch, navigate);
        } catch (error) {
            toast.error(error.message || "Vendor registration failed. Try again.");
        }
    };

    return (
        <>
            <div className="h-100 w-screen flex justify-center items-center dark:bg-gray-900 py-10">
                <div className="grid gap-8">
                    <div id="back-div" className="bg-gradient-to-r from-logoSecondary to-logoPrimary rounded-[26px] m-4">
                        <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-5 2xl:p-5 lg:p-5 md:p-5 sm:p-2 m-2">
                            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-3xl text-center cursor-default">
                                Become a Vendor
                            </h1>
                            <form className="grid grid-cols-2 gap-6" onSubmit={handleVendorSubmit}>
                                {Object.entries(vendorData).map(([key, value]) => (
                                    <div key={key} className="col-span-1">
                                        <label htmlFor={key} className="mb-2 dark:text-gray-400 text-md capitalize">{key.replace('_', ' ')}</label>
                                        <input
                                            id={key}
                                            name={key}
                                            type={key === "password" ? "password" : "text"}
                                            placeholder={`Enter ${key}`}
                                            className={`border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full placeholder-gray-300 ${errors[key] ? 'border-red-700' : ''}`}
                                            onChange={handleChange}
                                            value={value}
                                        />
                                        {errors[key] && <div className="text-red-800">{errors[key]}</div>}
                                    </div>
                                ))}
                                <div className="col-span-2">
                                    <button className="bg-gradient-to-r dark:text-gray-300 from-logoSecondary to-logoPrimary shadow-lg mt-6 p-3 text-white rounded-lg w-full hover:scale-105 hover:from-logoPrimary hover:to-logoSecondary transition duration-300 ease-in-out" type="submit">
                                        REGISTER AS VENDOR
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-col mt-4 items-center justify-center text-sm">
                                <h3 className="dark:text-gray-300">
                                    Already have an account?
                                    <Link className="group text-primary transition-all duration-100 ease-in-out" to="/login">
                                        <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out mx-2">
                                            Sign In
                                        </span>
                                    </Link>
                                </h3>
                            </div>

                            <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                                <p className="cursor-default">
                                    By signing in, you agree to our
                                    <a
                                        className="group text-primary transition-all duration-100 ease-in-out"
                                        href="/terms-of-use"
                                    >
                                        <span
                                            className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out mx-1"
                                        >
                                            Terms
                                        </span>
                                    </a>
                                    and
                                    <a
                                        className="group text-primary transition-all duration-100 ease-in-out"
                                        href="/privacy-policy"
                                    >
                                        <span
                                            className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out mx-1"
                                        >
                                            Privacy Policy
                                        </span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeVendor;