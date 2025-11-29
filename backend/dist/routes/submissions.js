"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../data");
const router = express_1.default.Router();
// Helper to safely extract string query values
function getQueryString(value, fallback) {
    return typeof value === 'string' ? value : fallback;
}
router.post('/', (req, res, next) => {
    try {
        const { isValid, errors, normalized } = (0, data_1.validateSubmission)(req.body, data_1.formSchema);
        if (!isValid) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }
        const saved = (0, data_1.addSubmission)(normalized);
        res.status(201).json({
            id: saved.id,
            createdAt: saved.createdAt
        });
    }
    catch (err) {
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
        const result = (0, data_1.getPaginatedSubmissions)({ page, limit, sortDirection });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', (req, res, next) => {
    try {
        const submission = (0, data_1.getSubmissionById)(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
    }
    catch (err) {
        next(err);
    }
});
router.put('/:id', (req, res, next) => {
    try {
        const { isValid, errors, normalized } = (0, data_1.validateSubmission)(req.body, data_1.formSchema);
        if (!isValid) {
            return res.status(400).json({
                message: 'Validation failed',
                errors
            });
        }
        const updated = (0, data_1.updateSubmission)(req.params.id, normalized);
        if (!updated) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json({
            id: updated.id,
            createdAt: updated.createdAt
        });
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', (req, res, next) => {
    try {
        const deleted = (0, data_1.deleteSubmission)(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
