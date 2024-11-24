import  useAuthContext  from "../hooks/useAuthContext";

const useAuth = () => {
    const { user, token, login, logout } = useAuthContext();

    return {
        isAuthenticated: !!user,
        user,
        token,
        login,
        logout,
        
    };
};

export default useAuth;
