const chatService = require('../services/chat.service');

const handleChatRequest = async (req, res) => {
  try {
    const { action, text, options } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    let result = '';

    switch (action) {
      case 'chat':
        result = await chatService.processChat(text);
        break;
      case 'summarize':
        result = await chatService.summarizeText(text);
        break;
      case 'translate':
        result = await chatService.translateText(text, options?.targetLanguage);
        break;
      case 'grammar_fix':
        result = await chatService.fixGrammar(text);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action provided' });
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error handling chat request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  handleChatRequest
};
