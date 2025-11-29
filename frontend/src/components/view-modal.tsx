import React from 'react';
import { Submission } from '../api/types';
import { FormSchema } from '../api/types';

interface ViewModalProps {
    submission: Submission | null;
    schema: FormSchema | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ViewModal: React.FC<ViewModalProps> = ({ submission, schema, isOpen, onClose }) => {
    if (!isOpen || !submission || !schema) return null;

    const data = submission.data as Record<string, unknown>;

    const getFieldValue = (fieldName: string, fieldType: string): string => {
        const value = data[fieldName];

        if (value === undefined || value === null || value === '') {
            return '-';
        }

        if (fieldType === 'multi-select') {
            const arr = value as string[];
            if (Array.isArray(arr) && arr.length > 0) {
                // Find labels for the values
                const fieldDef = schema.fields.find(f => f.name === fieldName);
                if (fieldDef?.options) {
                    const labels = arr.map(val => {
                        const option = fieldDef.options?.find(opt => opt.value === val);
                        return option?.label || val;
                    });
                    return labels.join(', ');
                }
                return arr.join(', ');
            }
            return '-';
        }

        if (fieldType === 'switch') {
            return value ? 'Yes' : 'No';
        }

        if (fieldType === 'date') {
            try {
                return new Date(value as string).toLocaleDateString();
            } catch {
                return String(value);
            }
        }

        return String(value);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Submission Details</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {schema.fields.map((field) => (
                            <div key={field.name} className="border-b border-slate-100 pb-3 last:border-0">
                                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                                    {field.label}
                                </div>
                                <div className="text-sm text-slate-800">
                                    {getFieldValue(field.name, field.type)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                            Created At
                        </div>
                        <div className="text-sm text-slate-800">
                            {new Date(submission.createdAt).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-600 text-white text-sm font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

