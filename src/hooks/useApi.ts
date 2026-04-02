import { useState, useEffect, useCallback } from 'react';

// Generic API hook for future backend integration
// Replace BASE_URL with your actual API endpoint

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface UseApiOptions {
    immediate?: boolean;
}

interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useApi<T>(
    endpoint: string,
    options: UseApiOptions = { immediate: true }
): UseApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        if (options.immediate) {
            fetchData();
        }
    }, [fetchData, options.immediate]);

    return { data, loading, error, refetch: fetchData };
}

// POST/PUT/PATCH/DELETE mutator hook
interface UseMutationReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    mutate: (payload: P) => Promise<T | null>;
}

export function useMutation<T, P = unknown>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): UseMutationReturn<T, P> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(
        async (payload: P): Promise<T | null> => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BASE_URL}${endpoint}`, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                setData(result);
                return result;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [endpoint, method]
    );

    return { data, loading, error, mutate };
}

export default useApi;
