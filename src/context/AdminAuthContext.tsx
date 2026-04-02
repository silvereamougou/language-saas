import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
    isAdminAuthenticated: boolean;
    loginAdmin: (password: string) => Promise<boolean>;
    logoutAdmin: () => void;
    adminToken: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// In production, this should hit an API endpoint that validates a backend hashed password or JWT.

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [adminToken, setAdminToken] = useState<string | null>(() => {
        return localStorage.getItem('admin_jwt_token');
    });

    const isAdminAuthenticated = !!adminToken;

    useEffect(() => {
        if (adminToken) {
            localStorage.setItem('admin_jwt_token', adminToken);
        } else {
            localStorage.removeItem('admin_jwt_token');
        }
    }, [adminToken]);

    const loginAdmin = async (password: string) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (res.ok && data.token) {
                setAdminToken(data.token);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Login error:', err);
            return false;
        }
    };

    const logoutAdmin = () => {
        setAdminToken(null);
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, loginAdmin, logoutAdmin, adminToken }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    return context;
};
