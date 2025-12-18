import express from 'express';
import { analyzeFinances } from '../controllers/aiController.js';

const router = express.Router();

router.get('/analyze/:userId', analyzeFinances);

export default router;
