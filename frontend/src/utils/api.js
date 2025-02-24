import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
});

// Add Authorization header for every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token expiration and refresh token logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

                    if (res.data.success) {
                        // Store new token
                        localStorage.setItem("token", res.data.accessToken);

                        // Retry the original request with the new token
                        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    
                    // Only clear token-related data instead of everything
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");

                    window.location.href = "/login"; // Redirect to login
                }
            }
            localStorage.clear();
        }

        return Promise.reject(error);
    }
);

export default api;