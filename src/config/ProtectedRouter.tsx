import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthStatus } from '../redux/slices/authSlice';
import { Spin } from 'antd';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authStatus = useSelector(selectAuthStatus);

    // Opcional: Verificación adicional del token
    // const { verifyToken } = useAuthActions();
    // React.useEffect(() => { verifyToken() }, []);

    if (authStatus === 'loading') {
        return <Spin size="large" fullscreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;