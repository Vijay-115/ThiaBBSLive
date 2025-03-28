import React, { useState } from "react";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from "../../services/authService";

const Forgot = () => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
    
        try {
            await forgotPassword(email);
            toast.success("Password reset email sent");
        } catch (error) {
            toast.error(error.message || "Failed to send email");
        }
    };

    return (
        <>
            <div className="h-100 w-screen flex justify-center items-center dark:bg-gray-900 py-10">
                <div className="grid gap-8">
                    <div
                        id="back-div"
                        className="bg-gradient-to-r from-logoSecondary to-logoPrimary rounded-[26px] m-4"
                    >
                        <div
                            className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-5 2xl:p-5 lg:p-5 md:p-5 sm:p-2 m-2"
                        >
                            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-3xl text-center cursor-default">
                                Forgot Password
                            </h1>
                            <form  onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="mb-2  dark:text-gray-400 text-md">Email</label>
                                    <input
                                        id="email"
                                        className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full placeholder-gray-300"
                                        type="email"
                                        placeholder="example@abc.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="bg-gradient-to-r dark:text-gray-300 from-logoSecondary to-logoPrimary shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-logoPrimary hover:to-logoSecondary transition duration-300 ease-in-out"
                                    type="submit"
                                >
                                    SUBMIT
                                </button>
                            </form>
                            <div className="flex flex-col mt-4 items-center justify-center text-sm">
                                <h3 className="dark:text-gray-300">
                                    Don't have an account?
                                    <Link
                                        className="group text-primary transition-all duration-100 ease-in-out"
                                        to="/register"
                                    >
                                        <span
                                            className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out mx-2"
                                        >
                                            Sign Up
                                        </span>
                                    </Link>
                                </h3>
                            </div>
                            <div
                                id="third-party-auth"
                                className="flex items-center justify-center mt-5 flex-wrap"
                            >
                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px]"
                                        src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                                        alt="Google"
                                    />
                                </button>
                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px]"
                                        src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                                        alt="Linkedin"
                                    />
                                </button>
                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px] filter dark:invert"
                                        src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                                        alt="Github"
                                    />
                                </button>
                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px]"
                                        src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                                        alt="Facebook"
                                    />
                                </button>
                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px] dark:gray-100"
                                        src="https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/"
                                        alt="twitter"
                                    />
                                </button>

                                <button
                                    href="#"
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px]"
                                        src="https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/"
                                        alt="apple"
                                    />
                                </button>
                            </div>

                            <div
                                className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
                            >
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

export default Forgot;