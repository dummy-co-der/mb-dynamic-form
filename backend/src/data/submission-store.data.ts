import fs from 'fs';
import path from 'path';
// @ts-ignore
import { v4 as uuid } from 'uuid';

interface Submission {
    id: string;
    createdAt: string;
    data: any;
}

// Path to your JSON file
const dataFilePath = path.join(__dirname, 'submissions.json');
let submissions: Submission[] = [];

function loadSubmissions() {
    if (!fs.existsSync(dataFilePath)) {
        submissions = [];
        saveSubmissions();
        return;
    }

    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf-8').trim();
        if (jsonData === '') {
            // Empty file, initialize empty array
            submissions = [];
            saveSubmissions();
        } else {
            submissions = JSON.parse(jsonData);
        }
    } catch (error) {
        console.error('Error parsing JSON file, initializing empty submissions:', error);
        submissions = [];
        saveSubmissions();
    }
}

// Save current submissions array to JSON file
function saveSubmissions() {
    fs.writeFileSync(dataFilePath, JSON.stringify(submissions, null, 2), 'utf-8');
}

// Initialize data on import
loadSubmissions();

export function addSubmission(payload: any): Submission {
    const id: string = uuid();
    const createdAt: string = new Date().toISOString();

    const record = {
        id,
        createdAt,
        data: payload
    };

    submissions.push(record);
    saveSubmissions(); // persist on add
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
    saveSubmissions(); // persist on update

    return submissions[index];
}

export function deleteSubmission(id: string): boolean {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
        return false;
    }

    submissions.splice(index, 1);
    saveSubmissions(); // persist on delete
    return true;
}