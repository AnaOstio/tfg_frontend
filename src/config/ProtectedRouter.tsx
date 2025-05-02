import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('authToken');

    // aqui habra que hacer peticion de si sigue activo el token o no

    if (!token) {
        // Si no está autenticado, redirige al login
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;