import api from "./api";

// Mock user for offline demo fallback
const MOCK_USERS = [
    {
        id: "usr-001",
        name: "Rajesh Sharma",
        email: "admin@trainpulse.gov.in",
        role: "ADMIN",
        phone: "+91 98765 43210"
    },
    {
        id: "usr-002",
        name: "Priya Patel",
        email: "passenger@trainpulse.com",
        role: "PASSENGER",
        phone: "+91 98123 45678"
    }
];

export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        if (response.data && response.data.token) {
            localStorage.setItem("trainpulse_token", response.data.token);
            localStorage.setItem("trainpulse_user", JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.warn("Backend API unavailable. Using mock auth service fallback.", error.message);
        
        // Mock authentication validation
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === credentials.email.toLowerCase()) || {
            id: `usr-${Date.now()}`,
            name: credentials.email.split("@")[0].toUpperCase(),
            email: credentials.email,
            role: credentials.email.includes("admin") ? "ADMIN" : "PASSENGER",
            phone: "+91 99999 88888"
        };
        
        const mockResponse = {
            token: `mock-jwt-token-${Date.now()}`,
            user: user,
            message: "Login successful (Mock Mode)"
        };

        localStorage.setItem("trainpulse_token", mockResponse.token);
        localStorage.setItem("trainpulse_user", JSON.stringify(mockResponse.user));

        return mockResponse;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.warn("Backend API unavailable. Using mock registration fallback.", error.message);
        const newUser = {
            id: `usr-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            role: userData.role || "PASSENGER",
            phone: userData.phone || "+91 90000 11111"
        };
        
        const mockToken = `mock-jwt-token-${Date.now()}`;
        localStorage.setItem("trainpulse_token", mockToken);
        localStorage.setItem("trainpulse_user", JSON.stringify(newUser));
        
        return {
            token: mockToken,
            user: newUser,
            message: "User registered successfully"
        };
    }
};

export const logoutUser = () => {
    localStorage.removeItem("trainpulse_token");
    localStorage.removeItem("trainpulse_user");
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("trainpulse_user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};
