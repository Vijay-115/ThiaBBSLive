import api from "../utils/api"; // Import the centralized Axios instance

export const vendorRegister = async (userData, dispatch, navigate) => {
    try {
        console.log('vendorRegister',userData);
        const response = await api.post("/vendor/register", userData, {
        headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
        },
        });
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || "Registration failed");
    }
};

export const vendorRequest = async () => {
    try {
        const response = await api.get("/vendor/get-request");
        return response.data; // Returns userId and role if valid
    } catch (error) {
        localStorage.removeItem("token");
        return false;
    }
};

export const vendorApprove = async (vendorId) => {
    try {
        const response = await api.put(`/vendor/approve/${vendorId}`);
        return response.data; // Returns userId and role if valid
    } catch (error) {
        localStorage.removeItem("token");
        return false;
    }
};