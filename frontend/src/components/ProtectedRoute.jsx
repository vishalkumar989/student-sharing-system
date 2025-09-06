import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    // Jab tak context loading state me hai, kuch na dikhao
    if (loading) {
        return null; // Ya ek loading spinner dikha sakte hain
    }

    // Agar token hai (user logged-in hai), toh page dikhao. Agar nahi, toh login page par bhej do.
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;