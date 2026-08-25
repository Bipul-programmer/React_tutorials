import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const existingToken = localStorage.getItem("trainpulse_token");
        const existingUser = getCurrentUser();
        
        if (existingToken && existingUser) {
            setToken(existingToken);
            setUser(existingUser);
        } else {
            // Default demo user if none logged in so the app displays active user state
            const defaultDemoUser = {
                id: "usr-demo",
                name: "Rajesh Sharma",
                email: "admin@trainpulse.gov.in",
                role: "ADMIN",
                phone: "+91 98765 43210"
            };
            setUser(defaultDemoUser);
            setToken("mock-jwt-token-default");
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await loginUser(credentials);
            setUser(data.user);
            setToken(data.token);
            setLoading(false);
            return { success: true, user: data.user };
        } catch (error) {
            setLoading(false);
            return { success: false, message: error.message || "Login failed" };
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await registerUser(userData);
            setUser(data.user);
            setToken(data.token);
            setLoading(false);
            return { success: true, user: data.user };
        } catch (error) {
            setLoading(false);
            return { success: false, message: error.message || "Registration failed" };
        }
    };

    const logout = () => {
        logoutUser();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isAdmin: user?.role === "ADMIN",
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
