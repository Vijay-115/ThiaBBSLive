import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserInfo();
                setUserInfo(user.userInfo);
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!userInfo || userInfo.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
