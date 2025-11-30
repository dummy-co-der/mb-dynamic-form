import React from 'react';
import { useForm } from '@tanstack/react-form';
import { FormField, FormSchema } from '../api/types';
import { useFormSchema } from '../api/form';
import { useCreateSubmission, useUpdateSubmission } from '../api/submissions';
import { Alert } from '../components/alert';
import type { Submission } from '../api/types';

type ServerErrors = Record<string, string>;

function buildDefaultValues(schema: FormSchema): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};
    for (const field of schema.fields) {
        if (field.defaultValue !== undefined) {
            defaults[field.name] = field.defaultValue;
        } else {
            switch (field.type) {
                case 'switch':
                    defaults[field.name] = false;
                    break;
                case 'multi-select':
                    defaults[field.name] = [];
                    break;
                default:
                    defaults[field.name] = '';
            }
        }
    }
    return defaults;
}

interface FieldProps {
    fieldDef: FormField;
    error?: string;
    formField: any; // FieldApi
}

const FieldRenderer: React.FC<FieldProps> = ({ fieldDef, error, formField }) => {
    const commonLabel = (
        <label
            htmlFor={fieldDef.name}
            className="mb-1 block text-sm font-semibold text-slate-800"
        >
            {fieldDef.label}
            {fieldDef.required && <span className="ml-1 text-xs text-red-500">*</span>}
        </label>
    );

    const helpText = error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
    ) : (
        fieldDef.placeholder && (
            <p className="mt-1 text-xs text-slate-500">
                {fieldDef.placeholder}
            </p>
        )
    );

    const baseInputClasses =
        `block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm
         transition-all duration-150 focus:outline-none focus:ring-2
         bg-white
         ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-400/40'
            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-400/40'
        }`;

    let control: React.ReactNode = null;

    if (fieldDef.type === 'textarea') {
        control = (
            <textarea
                id={fieldDef.name}
                rows={4}
                className={baseInputClasses}
                value={formField.state.value ?? ''}
                onBlur={formField.handleBlur}
                onChange={(e) => formField.handleChange(e.target.value)}
            />
        );
    } else if (fieldDef.type === 'select') {
        control = (
            <select
                id={fieldDef.name}
                className={baseInputClasses}
                value={(formField.state.value as string) ?? ''}
                onBlur={formField.handleBlur}
                onChange={(e) => formField.handleChange(e.target.value)}
            >
                <option value="">Select</option>
                {fieldDef.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        );
    } else if (fieldDef.type === 'multi-select') {
        const selectedValues = (formField.state.value as string[]) ?? [];
        control = (
            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {fieldDef.options?.map((opt) => {
                        const isSelected = selectedValues.includes(opt.value);
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    const newValue = isSelected
                                        ? selectedValues.filter(v => v !== opt.value)
                                        : [...selectedValues, opt.value];
                                    formField.handleChange(newValue);
                                }}
                                onBlur={formField.handleBlur}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium
                                    transition-all duration-150
                                    border-2 cursor-pointer
                                    ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                                    }
                                    ${error
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-400/40'
                                        : ''
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-blue-400/40
                                `}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    } else if (fieldDef.type === 'switch') {
        control = (
            <button
                type="button"
                onClick={() => formField.handleChange(!formField.state.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full
                    transition-all duration-200 cursor-pointer
                    ${formField.state.value
                        ? 'bg-blue-600'
                        : 'bg-slate-300'
                    }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300
                        ${formField.state.value ? 'translate-x-5' : 'translate-x-1'}
                    `}
                />
            </button>
        );
    } else {
        let inputType = 'text';
        if (fieldDef.type === 'number') inputType = 'number';
        if (fieldDef.type === 'date') inputType = 'date';
        if (fieldDef.inputType) inputType = fieldDef.inputType;

        control = (
            <input
                id={fieldDef.name}
                type={inputType}
                className={baseInputClasses}
                value={formField.state.value ?? ''}
                onBlur={formField.handleBlur}
                onChange={(e) => formField.handleChange(e.target.value)}
            />
        );
    }

    return (
        <div className="space-y-1.5 w-full">
            {fieldDef.type !== 'switch' && commonLabel}
            {fieldDef.type === 'switch' ? (
                <div className="flex items-center gap-3">
                    {commonLabel}
                    {control}
                </div>
            ) : (
                control
            )}
            {helpText}
        </div>
    );
};

function checkFieldValid(fieldDef: FormField, value: unknown): boolean {
    if (fieldDef.required) {
        if (fieldDef.type === 'multi-select') {
            const arr = (value as string[]) ?? [];
            if (arr.length === 0) return false;
            if (fieldDef.validations?.minSelected && arr.length < fieldDef.validations.minSelected) {
                return false;
            }
        } else if (value === undefined || value === null || value === '') {
            return false;
        }
    }
    return true;
}

const FormInner: React.FC<{ schema: FormSchema; editSubmission?: Submission | null }> = ({ schema, editSubmission }) => {
    const createSubmission = useCreateSubmission();
    const updateSubmission = useUpdateSubmission();
    const [serverErrors, setServerErrors] = React.useState<ServerErrors>({});
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const isEditMode = !!editSubmission;

    const form = useForm({
        defaultValues: editSubmission?.data as Record<string, unknown> || buildDefaultValues(schema),
        onSubmit: async ({ value }) => {
            setServerErrors({});
            setSuccessMessage(null);

            try {
                if (isEditMode && editSubmission) {
                    await updateSubmission.mutateAsync({ id: editSubmission.id, payload: value });
                    setSuccessMessage(`Submission updated successfully!`);
                    sessionStorage.removeItem('editSubmission');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    const result = await createSubmission.mutateAsync(value);
                    setSuccessMessage(`Submission saved with ID: ${result.id}`);
                    form.reset();
                }
            } catch (err: any) {
                const apiErrors: ServerErrors = err?.response?.data?.errors ?? {};
                setServerErrors(apiErrors);
            }
        }
    });

    const [formValues, setFormValues] = React.useState<Record<string, unknown>>(form.state.values);
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const subscription = form.store.subscribe(() => {
            setFormValues(form.state.values);
            // Collect errors from fieldMeta
            const errors: Record<string, string> = {};
            Object.keys(form.state.fieldMeta).forEach(fieldName => {
                const meta = form.state.fieldMeta[fieldName];
                if (meta?.errors && meta.errors.length > 0) {
                    errors[fieldName] = meta.errors[0];
                }
            });
            setFieldErrors(errors);
        });
        return () => subscription();
    }, [form]);

    // Check if form is valid
    const isFormValid = React.useMemo(() => {
        if (Object.keys(fieldErrors).length > 0) {
            return false;
        }

        // Check if all required fields are valid
        for (const fieldDef of schema.fields) {
            if (!checkFieldValid(fieldDef, formValues[fieldDef.name])) {
                return false;
            }
        }
        return true;
    }, [formValues, fieldErrors, schema]);

    const isSubmitting = createSubmission.isPending || updateSubmission.isPending;
    const isSubmitDisabled = !isFormValid || isSubmitting;

    return (
        <div className="
            space-y-6 rounded-xl 
            bg-white
            p-6 sm:p-8 
            shadow-lg 
            ring-1 ring-slate-200
            transition
        ">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">
                    {schema.title}
                </h2>
                {schema.description && (
                    <p className="text-sm text-slate-600">
                        {schema.description}
                    </p>
                )}
            </div>

            {successMessage && <Alert type="success" message={successMessage} />}

            {(createSubmission.isError || updateSubmission.isError) && !Object.keys(serverErrors).length && (
                <Alert type="error" message="Something went wrong while submitting. Please try again." />
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                {schema.fields.map((fieldDef) => (
                    <form.Field
                        key={fieldDef.name}
                        name={fieldDef.name}
                        validators={{
                            onChange: ({ value }) => {
                                // Required field validation
                                if (fieldDef.required) {
                                    if (fieldDef.type === 'multi-select') {
                                        const arr = (value as string[]) ?? [];
                                        if (arr.length === 0) {
                                            return 'This field is required';
                                        }
                                    } else if (value === undefined || value === null || value === '') {
                                        return 'This field is required';
                                    }
                                }

                                // Multi-select minSelected validation
                                if (fieldDef.type === 'multi-select' && fieldDef.validations?.minSelected) {
                                    const arr = (value as string[]) ?? [];
                                    const min = fieldDef.validations.minSelected;
                                    if (arr.length < min) {
                                        return `Please select at least ${min} ${min === 1 ? 'option' : 'options'}`;
                                    }
                                }

                                return undefined;
                            }
                        }}
                    >
                        {(fieldField: any) => {
                            const validationError = fieldField.state.meta.errors?.[0];
                            const error = serverErrors[fieldDef.name] || validationError;
                            return (
                                <FieldRenderer
                                    fieldDef={fieldDef}
                                    formField={fieldField}
                                    error={error}
                                />
                            );
                        }}
                    </form.Field>
                ))}

                <div className="flex items-center gap-3 pt-3">
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 
                                   text-sm font-medium text-white shadow-md 
                                   hover:bg-blue-700 active:bg-blue-800 
                                   disabled:opacity-60 disabled:cursor-not-allowed 
                                   transition-all duration-150 cursor-pointer"
                    >
                        {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update' : 'Submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const FormPage: React.FC = () => {
    const { data: schema, isLoading, isError } = useFormSchema();
    const [editSubmission, setEditSubmission] = React.useState<Submission | null>(null);

    React.useEffect(() => {
        const editData = sessionStorage.getItem('editSubmission');
        if (editData) {
            try {
                const submission = JSON.parse(editData) as Submission;
                setEditSubmission(submission);
            } catch (e) {
                console.error('Failed to parse edit submission data', e);
                sessionStorage.removeItem('editSubmission');
            }
        }
    }, []);

    if (isLoading) {
        return <p className="text-sm text-slate-600 animate-pulse">Loading form...</p>;
    }

    if (isError || !schema) {
        return (
            <p className="text-sm text-red-600">
                Failed to load form schema. Please try again later.
            </p>
        );
    }

    return <FormInner schema={schema} editSubmission={editSubmission} />;
};
