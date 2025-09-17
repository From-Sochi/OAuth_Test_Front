import React, { createContext, useContext, useEffect, useState } from 'react';
import localforage from 'localforage';
import {type AuthState, type User } from '../types/auth';

interface AuthContextType {
    authState: AuthState;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        role: null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await localforage.getItem<User>('currentUser');
                if (user) {
                    setAuthState({
                        isAuthenticated: true,
                        user,
                        role: user.role,
                    });
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            }
        };

        checkAuth();
    }, []);

    const login = async (userData: User) => {
        try {
            await localforage.setItem('currentUser', userData);
            setAuthState({
                isAuthenticated: true,
                user: userData,
                role: userData.role,
            });
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const logout = async () => {
        try {
            await localforage.removeItem('currentUser');
            setAuthState({
                isAuthenticated: false,
                user: null,
                role: null,
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};