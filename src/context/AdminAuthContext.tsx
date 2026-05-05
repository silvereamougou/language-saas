import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AdminAuthContextType {
    isAdminAuthenticated: boolean;
    loginAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    registerAdmin: (username: string, password: string, secret: string) => Promise<{ success: boolean; error?: string }>;
    logoutAdmin: () => void;
    adminToken: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

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

    const getApiBase = () => {
        let base = import.meta.env.VITE_API_URL || 'https://language-saas.onrender.com/api';
        base = base.replace(/\/+$/, ''); // Remove trailing slashes

        // Auto-fix if user forgot /api suffix in production env
        if (!base.endsWith('/api') && !base.includes('localhost')) {
            base += '/api';
        }

        return base;
    };

    const API_BASE = getApiBase();
    console.log('🛡️ Admin Auth API Base:', API_BASE);

    const loginAdmin = async (username: string, password: string) => {
        console.log('Attempting login at:', `${API_BASE}/admin/login`);
        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (res.ok && data.token) {
                setAdminToken(data.token);
                return { success: true };
            }
            return { success: false, error: data.error || 'Login failed' };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, error: 'Network error or server down' };
        }
    };

    const registerAdmin = async (username: string, password: string, secret: string) => {
        console.log('Attempting register at:', `${API_BASE}/admin/register`);
        try {
            const res = await fetch(`${API_BASE}/admin/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, secret }),
            });
            const data = await res.json();

            if (res.ok) {
                return { success: true };
            }
            return { success: false, error: data.error || 'Registration failed' };
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, error: 'Network error or server down' };
        }
    };

    const logoutAdmin = () => {
        setAdminToken(null);
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, loginAdmin, registerAdmin, logoutAdmin, adminToken }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    return context;
};
