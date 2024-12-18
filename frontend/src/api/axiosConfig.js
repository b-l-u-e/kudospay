import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "https://kudospay.onrender.com/api/v1", // Proxy ensures requests are sent to backend
  headers: {
    "Cache-Control": "no-cache", // Prevent caching
    Pragma: "no-cache", // For backward compatibility
    Expires: "0", // Expire immediately
  },
});

// Add an interceptor to include token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
