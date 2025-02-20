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
        if (error.response?.status === 401 || error.response?.status === 400) {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

                    if (res.data.success) {
                        // Store new token
                        localStorage.setItem("token", res.data.accessToken);

                        // Retry the original request with the new token
                        error.config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
                        return api(error.config);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    localStorage.clear(); // Logout user on failure
                    window.location.href = "/login"; // Redirect to login
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
