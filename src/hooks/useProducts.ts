import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { useApi } from '../context/ApiContext';

export const useProducts = (status?: string) => {
    const { fetchProducts, deleteProduct } = useApi();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchProducts(status);
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchProducts, status]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const removeProduct = async (id: string) => {
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return { products, isLoading, error, refresh, removeProduct };
};

export const useProduct = (id: string | undefined) => {
    const { fetchProduct } = useApi();
    const [product, setProduct] = useState<(Product & { versions: any[] }) | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!id || id === 'undefined') {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await fetchProduct(id);
            setProduct(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [fetchProduct, id]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { product, isLoading, error, refresh };
};
