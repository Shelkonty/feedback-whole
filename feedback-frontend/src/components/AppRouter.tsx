import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import FeedbackList from './features/feedback/FeedbackList';
import Layout from './layout/Layout';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Layout>{children}</Layout>;
};

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <FeedbackList />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRouter;