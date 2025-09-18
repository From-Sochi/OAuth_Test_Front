import {type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { authState } = useAuth();

    if (!authState.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};