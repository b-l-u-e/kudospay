import  { createContext, useState } from "react";

const AppContext = createContext();

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [notifications, setNotifications] = useState([]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const addNotification = (message) => {
        setNotifications((prev) => [...prev, message]);
    };

    const removeNotification = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AppContext.Provider
            value={{
                theme,
                toggleTheme,
                notifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
