import db from './database';
// @ts-ignore
import { v4 as uuid } from 'uuid';
import { formSchema } from './schema.data';

export interface Submission {
    id: string;
    createdAt: string;
    data: any;
}

// Type for raw DB row
interface DbRow {
    id: string;
    createdAt: string;
    data: string; // always stored as JSON string in DB
}

export function addSubmission(payload: any): Submission {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const dataStr = JSON.stringify(payload);

    db.prepare('INSERT INTO submissions (id, createdAt, data) VALUES (?, ?, ?)')
        .run(id, createdAt, dataStr);

    return { id, createdAt, data: payload };
}

export function getPaginatedSubmissions({ page = 1, limit = 10, sortDirection = 'desc' }) {
    const offset = (page - 1) * limit;

    // explicitly type rows as DbRow[]
    const rows = db.prepare(`
        SELECT * FROM submissions
        ORDER BY createdAt ${sortDirection.toUpperCase()}
        LIMIT ? OFFSET ?
    `).all(limit, offset) as DbRow[];

    const total = (db.prepare('SELECT COUNT(*) AS count FROM submissions').get() as { count: number }).count;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        data: rows.map((r) => ({ ...r, data: JSON.parse(r.data) })),
        page,
        limit,
        total,
        totalPages
    };
}

export function getSubmissionById(id: string): Submission | null {
    const row = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id) as DbRow | undefined;
    if (!row) return null;
    return { ...row, data: JSON.parse(row.data) };
}

export function updateSubmission(id: string, payload: any): Submission | null {
    const dataStr = JSON.stringify(payload);
    const info = db.prepare('UPDATE submissions SET data = ? WHERE id = ?').run(dataStr, id);
    if (info.changes === 0) return null;
    return getSubmissionById(id);
}

export function deleteSubmission(id: string): boolean {
    const info = db.prepare('DELETE FROM submissions WHERE id = ?').run(id);
    return info.changes > 0;
}

export { formSchema };
