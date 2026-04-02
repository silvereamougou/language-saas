import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    name: string;
    isLoggedIn: boolean;
}

interface UserContextType {
    user: User | null;
    requestOtp: (name: string, email: string) => Promise<boolean>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
    logout: () => void;
    customerToken: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user_session');
        return saved ? JSON.parse(saved) : null;
    });

    const [customerToken, setCustomerToken] = useState<string | null>(() => {
        return localStorage.getItem('customer_jwt_token');
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user_session', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_session');
        }

        if (customerToken) {
            localStorage.setItem('customer_jwt_token', customerToken);
        } else {
            localStorage.removeItem('customer_jwt_token');
        }
    }, [user, customerToken]);

    const requestOtp = async (name: string, email: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            return res.ok;
        } catch {
            return false;
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                setCustomerToken(data.token);
                setUser({ name: data.user.name, email: data.user.email, isLoggedIn: true });
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setCustomerToken(null);
    };

    return (
        <UserContext.Provider value={{ user, requestOtp, verifyOtp, logout, customerToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
