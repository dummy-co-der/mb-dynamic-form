"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubmission = addSubmission;
exports.getPaginatedSubmissions = getPaginatedSubmissions;
exports.getSubmissionById = getSubmissionById;
exports.updateSubmission = updateSubmission;
exports.deleteSubmission = deleteSubmission;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const uuid_1 = require("uuid");
// Path to your JSON file
const dataFilePath = path_1.default.join('/tmp', 'submissions.json');
let submissions = [];
function loadSubmissions() {
    if (!fs_1.default.existsSync(dataFilePath)) {
        submissions = [];
        saveSubmissions();
        return;
    }
    try {
        const jsonData = fs_1.default.readFileSync(dataFilePath, 'utf-8').trim();
        if (jsonData === '') {
            // Empty file, initialize empty array
            submissions = [];
            saveSubmissions();
        }
        else {
            submissions = JSON.parse(jsonData);
        }
    }
    catch (error) {
        console.error('Error parsing JSON file, initializing empty submissions:', error);
        submissions = [];
        saveSubmissions();
    }
}
// Save current submissions array to JSON file
function saveSubmissions() {
    fs_1.default.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2), 'utf-8');
}
// Initialize data on import
loadSubmissions();
function addSubmission(payload) {
    const id = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    const record = {
        id,
        createdAt,
        data: payload
    };
    submissions.push(record);
    saveSubmissions(); // persist on add
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
function getSubmissionById(id) {
    return submissions.find(s => s.id === id) || null;
}
function updateSubmission(id, payload) {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
        return null;
    }
    submissions[index] = {
        ...submissions[index],
        data: payload
    };
    saveSubmissions(); // persist on update
    return submissions[index];
}
function deleteSubmission(id) {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
        return false;
    }
    submissions.splice(index, 1);
    saveSubmissions(); // persist on delete
    return true;
}
