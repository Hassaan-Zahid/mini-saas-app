import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.10.22:8000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.message === 'Network Error') {
            error.response = {
                ...error.response,
                data: { message: 'Network Error - Please check your internet connection' },
                status: 503,
            };
        }

        if (error.response?.status === 401) {
        }

        return Promise.reject(error);
    }
);

export default api;