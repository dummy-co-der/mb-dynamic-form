"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formSchema = void 0;
exports.addSubmission = addSubmission;
exports.getPaginatedSubmissions = getPaginatedSubmissions;
exports.getSubmissionById = getSubmissionById;
exports.updateSubmission = updateSubmission;
exports.deleteSubmission = deleteSubmission;
const database_1 = __importDefault(require("./database"));
// @ts-ignore
const uuid_1 = require("uuid");
const schema_data_1 = require("./schema.data");
Object.defineProperty(exports, "formSchema", { enumerable: true, get: function () { return schema_data_1.formSchema; } });
function addSubmission(payload) {
    const id = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    const dataStr = JSON.stringify(payload);
    database_1.default.prepare('INSERT INTO submissions (id, createdAt, data) VALUES (?, ?, ?)')
        .run(id, createdAt, dataStr);
    return { id, createdAt, data: payload };
}
function getPaginatedSubmissions({ page = 1, limit = 10, sortDirection = 'desc' }) {
    const offset = (page - 1) * limit;
    // explicitly type rows as DbRow[]
    const rows = database_1.default.prepare(`
        SELECT * FROM submissions
        ORDER BY createdAt ${sortDirection.toUpperCase()}
        LIMIT ? OFFSET ?
    `).all(limit, offset);
    const total = database_1.default.prepare('SELECT COUNT(*) AS count FROM submissions').get().count;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
        data: rows.map((r) => ({ ...r, data: JSON.parse(r.data) })),
        page,
        limit,
        total,
        totalPages
    };
}
function getSubmissionById(id) {
    const row = database_1.default.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
    if (!row)
        return null;
    return { ...row, data: JSON.parse(row.data) };
}
function updateSubmission(id, payload) {
    const dataStr = JSON.stringify(payload);
    const info = database_1.default.prepare('UPDATE submissions SET data = ? WHERE id = ?').run(dataStr, id);
    if (info.changes === 0)
        return null;
    return getSubmissionById(id);
}
function deleteSubmission(id) {
    const info = database_1.default.prepare('DELETE FROM submissions WHERE id = ?').run(id);
    return info.changes > 0;
}
