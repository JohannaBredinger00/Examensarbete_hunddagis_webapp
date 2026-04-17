import React, { createContext, useContext, useState } from "react";
import { User } from '../types/types';
import { authAPI } from "../services/api";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await authAPI.register(name, email, password);
            await login(email, password); // Logga in direkt efter registrering
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
