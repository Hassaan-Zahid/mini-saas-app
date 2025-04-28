import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            getUser();
        }
    }, [token]);

    const getUser = async () => {
        try {
            const { data } = await axios.get('/api/profile');
            setUser(data);
        } catch (error) {
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/login', { email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            return true;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/register', userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            return true;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, getUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
