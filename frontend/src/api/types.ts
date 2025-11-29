export type FieldType =
    | 'text'
    | 'number'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'textarea'
    | 'switch';

export interface FormField {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    defaultValue?: unknown;
    inputType?: string;
    validations?: {
        minSelected?: number;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

export interface FormSchema {
    name: string;
    title: string;
    description?: string;
    fields: FormField[];
}

export interface Submission {
    id: string;
    createdAt: string;
    data: Record<string, unknown>;
}

export interface PaginatedSubmissions {
    data: Submission[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
