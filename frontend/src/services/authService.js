import toast from "react-hot-toast";
import { logoutUser, setUser } from "../slice/authSlice";
import api from "../utils/api"; // Import the centralized Axios instance
// Register function
export const register = async (userData,dispatch,navigate) => {
    try {
        const response = await api.post("/auth/register", userData);
        if (response.status === 200 && response.data?.user) {
            const user = response.data.user;

            dispatch(setUser(user)); // ✅ Store user in Redux

            toast.success("Registration successful");

            navigate(user.role === "admin" ? "/admin/dashboard" : "/");

            return user;
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.msg || "Registration failed");
    }
};

// Login function
export const login = async (dispatch, email, password, navigate) => {
    try {
        const response = await api.post("/auth/login", { email, password }, { withCredentials: true });

        console.log("Login Response:", response); // ✅ Debugging

        if (response.status === 200 && response.data?.user) {
            const user = response.data.user;

            dispatch(setUser(user)); // ✅ Store user in Redux

            toast.success("Login successful");

            navigate(user.role === "admin" ? "/admin/dashboard" : "/");

            return user;
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Login Error:", error); // ✅ Debugging
        toast.error(error.response?.data?.message || "Login failed");
    }
};

// Logout function (removes token & blacklists it)
export const logout = async (dispatch) => {
    try {
        await api.post("/auth/logout");
        localStorage.clear();
        dispatch(logoutUser()); // ✅ Ensure Redux state is cleared
    } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        await api.post("/auth/forgot-password", { email });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to send email");
    }
};

// Reset Password
export const resetPassword = async (token, password) => {
    try {
        await api.post(`/auth/reset-password/${token}`, { password });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Password reset failed");
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    try {
        const response = await api.get("/auth/check-auth");
        return response.data; // Returns userId and role if valid
    } catch (error) {
        localStorage.removeItem("token");
        return false;
    }
};

// Check if user is authenticated
export const updateProfile = async (userData) => {
    try {
        const response = await api.put("/auth/update-profile", userData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; // Returns updated user data
    } catch (error) {
        console.error("Update Profile Error:", error.response?.data || error.message);
        return false;
    }
};



export const loadUser = () => async (dispatch) => {
    try {
        const response = await api.get("/auth/me", { withCredentials: true });

        console.log("User Data on Refresh:", response.data); // ✅ Debugging

        dispatch(setUser(response.data.user)); // ✅ Store user in Redux
    } catch (error) {
        console.error("Failed to load user:", error); // ✅ Debugging
        dispatch(logoutUser());
    }
};