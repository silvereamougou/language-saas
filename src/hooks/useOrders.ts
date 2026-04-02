import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../context/ApiContext';
import { useUser } from '../context/UserContext';
import type { Order } from '../types';

export const useOrders = (emailOverride?: string) => {
    const { fetchOrders } = useApi();
    const { user } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const email = emailOverride || user?.email;

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchOrders();
            // Filter by the user's email if they are logged in and this is an admin override
            const filteredOrders = email ? data.filter(o => o.email === email) : data;
            setOrders(filteredOrders);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchOrders, email]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { orders, isLoading, error, refresh };
};

export const useMyOrders = () => {
    const { fetchMyOrders } = useApi();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchMyOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchMyOrders]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { orders, isLoading, error, refresh };
};
