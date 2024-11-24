import API from "./axiosConfig";

// Login
export const loginUser = (credentials) => API.post("/auth/login", credentials);

// Register
// export const registerUser = (data) => API.post("/auth/register", data);

// Register with a token (for staff or teamPool)
export const registerWithToken = (token, userData) => 
    API.post(`/auth/registerWithToken?token=${token}`, userData);

export const generateHederaAccount = async (initialBalance = 10) => {
    try {
        const response = await API.post("/hedera/generate-account", { initialBalance });
        return response.data.accountData;
    } catch (error) {
        console.error("Error generating Hedera account:", error.response?.data || error.message);
        throw error;
    }
};
