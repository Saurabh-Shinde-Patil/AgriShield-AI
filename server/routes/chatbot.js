import express from 'express';
import { processQuery } from '../controllers/chatbotController.js';

const router = express.Router();

// POST /api/chatbot - Process chatbot query
router.post('/', processQuery);

export default router;
