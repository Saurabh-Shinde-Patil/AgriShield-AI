import { processQuery as chatbotProcessQuery } from '../services/chatbotService.js';

// @desc    Process chatbot query
// @route   POST /api/chatbot
// @access  Public
export const processQuery = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const result = chatbotProcessQuery(message);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Chatbot error' });
  }
};
