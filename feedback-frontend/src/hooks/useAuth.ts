import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useToast } from './use-toast';

export interface User {
    id: number;
    email: string;
    name?: string;
    avatar?: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    avatar?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(authService.getCurrentUser());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.getToken()) {
                const userData = await authService.getProfile();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            toast({
                title: "Success",
                description: "Successfully logged in",
            });
            return response;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to login",
                variant: "destructive",
            });
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
        toast({
            title: "Success",
            description: "Successfully logged out",
        });
    };

    const updateProfile = async (data: UpdateProfileData) => {
        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
            return updatedUser;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
            throw error;
        }
    };

    const deleteAccount = async () => {
        try {
            await authService.deleteAccount();
            toast({
                title: "Success",
                description: "Account deleted successfully",
            });
            logout();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete account",
                variant: "destructive",
            });
            throw error;
        }
    };

    return {
        user,
        loading,
        login,
        logout,
        updateProfile,
        deleteAccount,
    };
};