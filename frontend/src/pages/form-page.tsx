import React from 'react';
import { useForm } from '@tanstack/react-form';
import { FormField, FormSchema } from '../api/types';
import { useFormSchema } from '../api/form';
import { useCreateSubmission } from '../api/submissions';

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
            className="mb-1 block text-sm font-semibold 
                       text-slate-800 dark:text-slate-200"
        >
            {fieldDef.label}
            {fieldDef.required && <span className="ml-1 text-xs text-red-500">*</span>}
        </label>
    );

    const helpText = error ? (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
    ) : (
        fieldDef.placeholder && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {fieldDef.placeholder}
            </p>
        )
    );

    const baseInputClasses =
        `block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm
         transition-all duration-150 focus:outline-none focus:ring-2
         bg-white dark:bg-slate-800 dark:text-slate-100
         ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-400/40'
            : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-400/40 dark:border-slate-700 dark:hover:border-slate-500'
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
    } else if (fieldDef.type === 'switch') {
        control = (
            <button
                type="button"
                onClick={() => formField.handleChange(!formField.state.value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full
                    transition-all duration-200
                    ${formField.state.value
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-600'
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

const FormInner: React.FC<{ schema: FormSchema }> = ({ schema }) => {
    const createSubmission = useCreateSubmission();
    const [serverErrors, setServerErrors] = React.useState<ServerErrors>({});
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

    const form = useForm({
        defaultValues: buildDefaultValues(schema),
        onSubmit: async ({ value }) => {
            setServerErrors({});
            setSuccessMessage(null);

            try {
                const result = await createSubmission.mutateAsync(value);
                setSuccessMessage(`Submission saved with ID: ${result.id}`);
                form.reset();
            } catch (err: any) {
                const apiErrors: ServerErrors = err?.response?.data?.errors ?? {};
                setServerErrors(apiErrors);
            }
        }
    });

    return (
        <div className="
            space-y-6 rounded-xl 
            bg-white dark:bg-slate-900 
            p-6 sm:p-8 
            shadow-lg 
            ring-1 ring-slate-200 dark:ring-slate-700
            transition
        ">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {schema.title}
                </h2>
                {schema.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {schema.description}
                    </p>
                )}
            </div>

            {successMessage && (
                <div className="rounded-lg border border-green-300 bg-green-50 
                                dark:bg-green-900/30 dark:border-green-700 
                                px-4 py-2 text-sm text-green-800 dark:text-green-300 shadow-sm">
                    {successMessage}
                </div>
            )}

            {createSubmission.isError && !Object.keys(serverErrors).length && (
                <div className="rounded-lg border border-red-300 bg-red-50 
                                dark:bg-red-900/30 dark:border-red-700
                                px-4 py-2 text-sm text-red-800 dark:text-red-300 shadow-sm">
                    Something went wrong while submitting. Please try again.
                </div>
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
                    <form.Field key={fieldDef.name} name={fieldDef.name}>
                        {(fieldField: any) => (
                            <FieldRenderer
                                fieldDef={fieldDef}
                                formField={fieldField}
                                error={serverErrors[fieldDef.name]}
                            />
                        )}
                    </form.Field>
                ))}

                <div className="flex items-center gap-3 pt-3">
                    <button
                        type="submit"
                        disabled={createSubmission.isPending}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 
                                   text-sm font-medium text-white shadow-md 
                                   hover:bg-blue-700 active:bg-blue-800 
                                   disabled:opacity-60 disabled:cursor-not-allowed 
                                   transition-all duration-150"
                    >
                        {createSubmission.isPending ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const FormPage: React.FC = () => {
    const { data: schema, isLoading, isError } = useFormSchema();

    if (isLoading) {
        return <p className="text-sm text-slate-600 dark:text-slate-300 animate-pulse">Loading form...</p>;
    }

    if (isError || !schema) {
        return (
            <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load form schema. Please try again later.
            </p>
        );
    }

    return (
        <>
            <FormInner schema={schema} />
        </>
    );
};
