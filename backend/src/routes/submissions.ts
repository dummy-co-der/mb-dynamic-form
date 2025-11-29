import express from 'express';
import { addSubmission, formSchema, getPaginatedSubmissions, validateSubmission, getSubmissionById, updateSubmission, deleteSubmission } from '../data';

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

router.get('/:id', (req, res, next) => {
    try {
        const submission = getSubmissionById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', (req, res, next) => {
    try {
        const { isValid, errors, normalized } = validateSubmission(req.body, formSchema);

        if (!isValid) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }

        const updated = updateSubmission(req.params.id, normalized);
        if (!updated) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.json({
            id: updated.id,
            createdAt: updated.createdAt
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', (req, res, next) => {
    try {
        const deleted = deleteSubmission(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
