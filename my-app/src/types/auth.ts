export interface User {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    role: 'user' | 'admin' | null;
}

export interface LoginFormData {
    role: 'user' | 'admin';
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    age?: number | undefined;
}