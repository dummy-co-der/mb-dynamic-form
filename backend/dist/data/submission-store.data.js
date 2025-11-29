"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubmission = addSubmission;
exports.getPaginatedSubmissions = getPaginatedSubmissions;
// @ts-ignore
const uuid_1 = require("uuid");
const submissions = [];
function addSubmission(payload) {
    const id = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    const record = {
        id,
        createdAt,
        data: payload
    };
    submissions.push(record);
    return record;
}
function getPaginatedSubmissions({ page = 1, limit = 10, sortDirection = 'desc' }) {
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
