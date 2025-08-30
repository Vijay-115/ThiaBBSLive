import axios from "axios";
import { getGuestKey, ensureGuestKey } from "../utils/guestKey";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/",
  withCredentials: true,
});
// If you use token-based auth, attach it here:
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token"); // adjust your key
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
instance.interceptors.request.use((config) => {
  // Attach pincode header if known
  const pin = localStorage.getItem("deliveryPincode");
  if (pin) config.headers["X-Pincode"] = pin;

  // Attach stable guest key for anonymous users
  ensureGuestKey();
  const gk = getGuestKey();
  if (gk) config.headers["X-Guest-Key"] = gk;

  // Auth header (if you already set elsewhere, keep it there)
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;
