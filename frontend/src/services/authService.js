import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update with your backend URL

// Register function
export const register = async (userData) => {
    try {
        await axios.post(`${API_URL}/api/auth/register`, userData);
    } catch (error) {
        throw new Error(error.response?.data?.msg || "Registration failed");
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

// Logout function (removes token & blacklists it)
export const logout = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await axios.post(
            `${API_URL}/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.clear(); // Clears all stored user data
    } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
    }
};

// ForgotPassword function
export const forgotPassword = async (email) => {
    try {
        await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to send email");
    }
};

// ResetPassword function
export const resetPassword = async (token, password) => {
    try {
        await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Password reset failed");
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const response = await axios.get(`${API_URL}/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Returns userId and role if valid
    } catch (error) {
        localStorage.removeItem("token");
        return false;
    }
};
