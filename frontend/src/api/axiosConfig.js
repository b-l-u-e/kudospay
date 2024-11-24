import axios from "axios";

// Create Axios instance
const API = axios.create({
    baseURL: "http://localhost:5000/api/v1", // Proxy ensures requests are sent to backend
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
