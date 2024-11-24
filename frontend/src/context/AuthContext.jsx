/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, [token]);

  const login = (newToken, userData) => {
    if (!newToken || !userData) {
      console.error("Missing token or user data in login function.");
      return;
    }

    setToken(newToken);
    localStorage.setItem("token", newToken);

    try {
      localStorage.setItem("user", JSON.stringify(userData)); // Ensure valid data
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
