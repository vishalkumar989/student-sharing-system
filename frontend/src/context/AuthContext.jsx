import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Context ko create karo
const AuthContext = createContext();

// Custom hook banana taaki context ko use karna aasan ho jaaye
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Provider Component banao
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Hum user ki details bhi store karenge
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                // Agar token hai, toh user ki details fetch karo
                // Note: Iske liye backend me ek naya route banana padega
                // Abhi ke liye hum bas token check kar rahe hain
                setUser({ loggedIn: true }); // Dummy user object
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        loading,
        login,
        logout
    };

    // 3. Provider se value ko pass karo
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
