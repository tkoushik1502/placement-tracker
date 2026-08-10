import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// =========================
// Handle Authentication Errors
// =========================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // Token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;