export function validateSubmission(
    data: Record<string, any>,
    schema: { fields: Array<any> }
) {
    const errors: Record<string, string> = {};
    const normalized: Record<string, any> = {};

    for (const field of schema.fields) {
        const raw = data[field.name];
        const cfg = field.validations || {};
        let value = raw;

        if (field.type === 'number' && raw !== undefined && raw !== null && raw !== '') {
            const num = Number(raw);
            if (Number.isNaN(num)) {
                errors[field.name] = 'Must be a number';
            } else {
                value = num;
                if (cfg.min !== undefined && num < cfg.min) {
                    errors[field.name] = `Must be at least ${cfg.min}`;
                }
                if (cfg.max !== undefined && num > cfg.max) {
                    errors[field.name] = `Must be at most ${cfg.max}`;
                }
            }
        }

        if (field.type === 'switch') {
            value = Boolean(raw);
        }

        if (field.type === 'multi-select') {
            if (raw === undefined || raw === null || raw === '') {
                value = [];
            } else if (!Array.isArray(raw)) {
                value = [raw];
            } else {
                value = raw;
            }

            // Validate minSelected
            if (cfg.minSelected !== undefined && value.length < cfg.minSelected) {
                errors[field.name] = `Please select at least ${cfg.minSelected} ${cfg.minSelected === 1 ? 'option' : 'options'}`;
            }
        }

        if (['text', 'textarea', 'date', 'select'].includes(field.type)) {
            if (typeof raw === 'string') {
                value = raw.trim();
            }

            if (cfg.minLength && value && value.length < cfg.minLength) {
                errors[field.name] = `Must be at least ${cfg.minLength} characters`;
            }

            if (cfg.maxLength && value && value.length > cfg.maxLength) {
                errors[field.name] = `Must be at most ${cfg.maxLength} characters`;
            }

            if (cfg.pattern && value) {
                const re = new RegExp(cfg.pattern);
                if (!re.test(value)) {
                    errors[field.name] = cfg.message || 'Invalid format';
                }
            }
        }

        if (field.required) {
            const isEmpty =
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0);

            if (isEmpty && !errors[field.name]) {
                errors[field.name] = 'This field is required';
            }
        }

        // For multi-select, use empty array instead of null if no value
        if (field.type === 'multi-select') {
            normalized[field.name] = value ?? [];
        } else {
            normalized[field.name] = value ?? null;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        normalized
    };
}
