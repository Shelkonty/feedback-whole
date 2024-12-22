import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export { api };