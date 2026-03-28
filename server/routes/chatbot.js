const express = require('express');
const router = express.Router();
const { processQuery } = require('../services/chatbotService');

// POST /api/chatbot - Process chatbot query
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const result = processQuery(message);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Chatbot error' });
  }
});

module.exports = router;
