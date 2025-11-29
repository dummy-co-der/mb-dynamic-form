import express from 'express';
import { addSubmission, formSchema, getPaginatedSubmissions, validateSubmission } from '../data';

const router = express.Router();

// Helper to safely extract string query values
function getQueryString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

router.post('/', (req, res, next) => {
    try {
        const { isValid, errors, normalized } = validateSubmission(req.body, formSchema);

        if (!isValid) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        const saved = addSubmission(normalized);

        res.status(201).json({
            id: saved.id,
            createdAt: saved.createdAt
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', (req, res, next) => {
    try {
        // Safely get and parse page + limit
        const page = parseInt(getQueryString(req.query.page, '1'), 10);
        const limit = parseInt(getQueryString(req.query.limit, '10'), 10);

        // Safely handle sortDirection
        const sortDirectionRaw = getQueryString(req.query.sortDirection, 'desc');
        const sortDirection = sortDirectionRaw === 'asc' ? 'asc' : 'desc';

        const result = getPaginatedSubmissions({ page, limit, sortDirection });
        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
