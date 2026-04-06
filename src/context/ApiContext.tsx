import React, { createContext, useContext, type ReactNode } from 'react';
import type { Product, Order } from '../types';

interface ApiContextType {
    fetchProducts: (status?: string) => Promise<Product[]>;
    fetchProduct: (id: string) => Promise<Product & { versions: any[] }>;
    saveProduct: (product: Partial<Product>, id?: string) => Promise<Product>;
    deleteProduct: (id: string) => Promise<void>;
    createOrder: (order: Partial<Order>) => Promise<Order>;
    createManualOrder: (order: any) => Promise<Order>;
    fetchOrders: () => Promise<Order[]>;
    fetchMyOrders: () => Promise<Order[]>;
    addVersion: (productId: string, version: any) => Promise<any>;
    generateDownloadToken: (productId: string) => Promise<{ token: string }>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const getApiBase = () => {
    let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    base = base.replace(/\/+$/, ''); // Remove trailing slashes

    // Auto-fix if user forgot /api suffix in production env
    if (!base.endsWith('/api') && !base.includes('localhost')) {
        base += '/api';
    }

    return base;
};

const API_BASE = getApiBase();
console.log('🌐 API connected to:', API_BASE);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const fetchProducts = async (status?: string) => {
        const url = status ? `${API_BASE}/products?status=${status}` : `${API_BASE}/products`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    };

    const fetchProduct = async (id: string) => {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    };

    const getAuthHeaders = (isJson = true) => {
        const token = localStorage.getItem('admin_jwt_token');
        const headers: Record<string, string> = {};
        if (isJson) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const saveProduct = async (product: Partial<Product>, id?: string) => {
        const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(product),
        });
        if (!res.ok) throw new Error('Failed to save product');
        return res.json();
    };

    const deleteProduct = async (id: string) => {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(false)
        });
        if (!res.ok) throw new Error('Failed to delete product');
    };

    const getCustomerAuthHeaders = (isJson = true) => {
        const token = localStorage.getItem('customer_jwt_token');
        const headers: Record<string, string> = {};
        if (isJson) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const createOrder = async (order: Partial<Order>) => {
        const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: getCustomerAuthHeaders(),
            body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error('Failed to create order');
        return res.json();
    };

    const createManualOrder = async (orderData: any) => {
        const res = await fetch(`${API_BASE}/admin/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData),
        });
        if (!res.ok) throw new Error('Failed to create manual order');
        return res.json();
    };

    const fetchOrders = async () => {
        // Admin uses this, so it should use admin getAuthHeaders()
        const res = await fetch(`${API_BASE}/orders`, {
            headers: getAuthHeaders(false)
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    };

    const fetchMyOrders = async () => {
        const res = await fetch(`${API_BASE}/my-orders`, {
            headers: getCustomerAuthHeaders(false)
        });
        if (!res.ok) throw new Error('Failed to fetch my orders');
        return res.json();
    };

    const addVersion = async (productId: string, version: any) => {
        const res = await fetch(`${API_BASE}/products/${productId}/versions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(version),
        });
        if (!res.ok) throw new Error('Failed to add version');
        return res.json();
    };

    const generateDownloadToken = async (productId: string) => {
        const res = await fetch(`${API_BASE}/downloads/generate-token`, {
            method: 'POST',
            headers: getCustomerAuthHeaders(),
            body: JSON.stringify({ productId })
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to generate token');
        }
        return res.json();
    };

    return (
        <ApiContext.Provider value={{
            fetchProducts,
            fetchProduct,
            saveProduct,
            deleteProduct,
            createOrder,
            createManualOrder,
            fetchOrders,
            fetchMyOrders,
            addVersion,
            generateDownloadToken
        }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) throw new Error('useApi must be used within an ApiProvider');
    return context;
};
