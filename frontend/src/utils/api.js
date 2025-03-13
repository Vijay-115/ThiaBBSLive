import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensure cookies are sent with requests
});

// Handle token expiration and refresh token logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 408 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop

            try {
                // Send request to refresh token endpoint
                await api.post("/auth/refresh-token");

                // Retry original request (cookies automatically included)
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                
                // Redirect to login if refresh fails
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
