import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    user: any;
    token: string | null;
    login: (email: string, password: string, navigation: StackNavigationProp<RootStackParamList>) => void;
    register: (name: string, email: string, password: string, passwordConfirmation: string, navigation: StackNavigationProp<RootStackParamList>) => void;
    logout: (navigation: StackNavigationProp<RootStackParamList>) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {},
    register: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// @ts-ignore
export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getStoredToken = async () => {
            const storedToken = await SecureStore.getItemAsync('token');
            if (storedToken) {
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                getUser();
            }
        };
        getStoredToken();
    }, []);

    const getUser = async () => {
        try {
            const { data } = await axios.get('/api/profile');
            setUser(data);
        } catch (error) {
            console.log(error)
        }
    };

    const login = async (email: string, password: string, navigation: StackNavigationProp<RootStackParamList>) => {
        try {
            const { data } = await axios.post('api/login', { email, password });
            await SecureStore.setItemAsync('token', data?.token);
            setToken(data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            await getUser();

            navigation.reset({
                index: 0,
                routes: [{ name: 'ItemsList' }],
            });
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message
                || (error.response?.status === 401 ? 'Invalid email or password.' : 'Login failed. Please try again.');

            throw new Error(message);
        }
    };



    const register = async (name: string, email: string, password: string, passwordConfirmation: string, navigation: StackNavigationProp<RootStackParamList>) => {
        try {
            const { data } = await axios.post('/api/register', { name, email, password, password_confirmation: passwordConfirmation });
            await SecureStore.setItemAsync('token', data.token);
            setToken(data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            navigation.reset({
                index: 0,
                routes: [{ name: 'ItemsList' }],
            });
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const logout = (navigation: StackNavigationProp<RootStackParamList>) => {
        SecureStore.deleteItemAsync('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
