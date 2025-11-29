// @ts-ignore
import { v4 as uuid } from 'uuid';

interface Submission {
    id: string;
    createdAt: string;
    data: any;
}

const submissions: Submission[] = [];

export function addSubmission(payload: any): Submission {
    const id: string = uuid();
    const createdAt: string = new Date().toISOString();

    const record = {
        id,
        createdAt,
        data: payload
    };

    submissions.push(record);
    return record;
}

export function getPaginatedSubmissions({ page = 1, limit = 10, sortDirection = 'desc' }) {
    const sorted = [...submissions].sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        data: sorted.slice(start, end),
        page,
        limit,
        total,
        totalPages
    };
}

export function getSubmissionById(id: string): Submission | null {
    return submissions.find(s => s.id === id) || null;
}

export function updateSubmission(id: string, payload: any): Submission | null {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
        return null;
    }

    submissions[index] = {
        ...submissions[index],
        data: payload
    };

    return submissions[index];
}

export function deleteSubmission(id: string): boolean {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
        return false;
    }

    submissions.splice(index, 1);
    return true;
}
