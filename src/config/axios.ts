import axios from "axios";
import { API_BASE_URL } from "./api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., logging, showing notifications)
    const message =
      error.response?.data?.message || "An unexpected error occurred";

    // You could potentially trigger a global alert or toast here
    console.error("API Error:", message);

    return Promise.reject(error);
  },
);

export default api;
