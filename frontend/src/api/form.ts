import { useQuery } from '@tanstack/react-query';
import { FormSchema } from './types';
import { api } from './client';

export function useFormSchema() {
    return useQuery<FormSchema>({
        queryKey: ['form-schema'],
        queryFn: async () => {
            const res = await api.get<FormSchema>('/form-schema');
            return res.data;
        }
    });
}
