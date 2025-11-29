import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { PaginatedSubmissions, Submission } from './types';

export function useSubmissions(
    page: number,
    limit: number,
    sortDirection: 'asc' | 'desc'
) {
    return useQuery<PaginatedSubmissions>({
        queryKey: ['submissions', page, limit, sortDirection],
        queryFn: async () => {
            const res = await api.get<PaginatedSubmissions>('/submissions', {
                params: { page, limit, sortDirection }
            });
            return res.data;
        },
        // @ts-expect-error: keepPreviousData is a valid option for useQuery, but types may be lagging
        keepPreviousData: true
    });
}

export function useCreateSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const res = await api.post('/submissions', payload);
            return res.data as { id: string; createdAt: string };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        }
    });
}

export function useSubmission(id: string | null) {
    return useQuery<Submission>({
        queryKey: ['submission', id],
        queryFn: async () => {
            const res = await api.get<Submission>(`/submissions/${id}`);
            return res.data;
        },
        enabled: !!id
    });
}

export function useUpdateSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
            const res = await api.put(`/submissions/${id}`, payload);
            return res.data as { id: string; createdAt: string };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            queryClient.invalidateQueries({ queryKey: ['submission'] });
        }
    });
}

export function useDeleteSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/submissions/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        }
    });
}
