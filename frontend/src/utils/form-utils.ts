import { FormSchema } from '../api/types';

export function buildDefaultValues(schema: FormSchema): Record<string, unknown> {
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


