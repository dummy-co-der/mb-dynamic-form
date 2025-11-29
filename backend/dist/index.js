"use strict";
// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import formSchemaRouter from './routes/formSchema.js';
// import submissionsRouter from './routes/submissions.js';
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));
// app.get('/', (_req, res) => {
//   res.json({ status: 'ok' });
// });
// app.use('/api/form-schema', formSchemaRouter);
// app.use('/api/submissions', submissionsRouter);
// // 404
// app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' });
// });
// // Error handler
// app.use((err, _req, res, _next) => {
//   console.error(err);
//   res.status(err.status || 500).json({
//     message: err.message || 'Internal server error'
//   });
// });
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/", (req, res) => {
    res.json({ message: "Backend is running in TypeScript!" });
});
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
