import express from 'express';
import { formSchema } from '../data';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json(formSchema);
});

export default router;
