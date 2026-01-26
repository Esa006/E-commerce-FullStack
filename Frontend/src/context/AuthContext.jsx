import React, { createContext, useState, useEffect } from "react";
import AuthApi from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

    // Function to update auth state (used during login)
    const login = (newToken, userData) => {
        localStorage.setItem("ACCESS_TOKEN", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    // Function to clear auth state (used during logout)
    const logout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("user");
        localStorage.removeItem("admin_token"); // Clean up admin token too
        setToken(null);
        setUser(null);
    };

    // Sync state across tabs using storage event
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "ACCESS_TOKEN") {
                if (e.newValue) {
                    setToken(e.newValue);
                    // Optionally fetch user if token changed in another tab
                    AuthApi.getUser().then(res => {
                        setUser(res.data);
                        localStorage.setItem("user", JSON.stringify(res.data));
                    }).catch(() => {
                        // If token is invalid or request fails
                    });
                } else {
                    // Token removed in another tab (logout)
                    setToken(null);
                    setUser(null);
                }
            }
            if (e.key === "user") {
                setUser(JSON.parse(e.newValue || "null"));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
