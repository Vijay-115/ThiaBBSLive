import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../services/authService';

const ProtectedRoute = ({ requiredRole }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    // Load user details on mount
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    // ✅ Show a loading state while fetching user data
    if (loading) {
        return <div>Loading...</div>; // Replace with a proper loader
    }

    // ✅ Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // ✅ Redirect unauthorized users
    if (user && requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;