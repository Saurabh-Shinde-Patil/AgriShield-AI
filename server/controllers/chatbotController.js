/**
 * Chatbot Controller
 * Processes natural-language farming queries using keyword matching.
 */
import { processQuery } from '../services/chatbotService.js';

/**
 * @desc    Process a chatbot query
 * @route   POST /api/chatbot
 * @access  Public
 */
export const handleChatbotQuery = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = processQuery(message);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    res.status(500).json({ success: false, error: 'Chatbot processing failed' });
  }
};
