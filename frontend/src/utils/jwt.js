import jwtDecode from "jwt-decode"


export const decodeToken = (token) => {
    if (!token || typeof token !== "string") {
        console.error("Invalid token: Token is undefined or not a string.");
        return null;
    }
    try {
        return jwtDecode(token); // Ensure jwt-decode is properly imported
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
