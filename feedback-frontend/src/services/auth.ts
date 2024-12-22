import axios from 'axios';
import { User, UpdateProfileData } from '../hooks/useAuth';

const API_URL = 'http://localhost:3000/api';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    name?: string;
    avatar?: string;
}

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const authService = {
    async login(data: LoginData) {
        const response = await axios.post(`${API_URL}/users/login`, data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async register(data: RegisterData) {
        const response = await axios.post(`${API_URL}/users/register`, data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    async getProfile() {
        const response = await axios.get(`${API_URL}/users/profile`, getAuthHeader());
        return response.data;
    },

    async updateProfile(data: UpdateProfileData) {
        const response = await axios.put(
            `${API_URL}/users/profile`,
            data,
            getAuthHeader()
        );
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    async deleteAccount() {
        await axios.delete(`${API_URL}/users/profile`, getAuthHeader());
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    }
};