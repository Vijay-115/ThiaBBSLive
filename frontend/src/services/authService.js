import api from "../utils/api"; // Import the centralized Axios instance

// Register function
export const register = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.msg || "Registration failed");
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
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

        await api.post("/auth/logout");
        localStorage.clear();
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