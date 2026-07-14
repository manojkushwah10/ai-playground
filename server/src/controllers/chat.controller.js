const chatService = require('../services/chat.service');

const handleChatRequest = async (req, res) => {
  try {
    const { action, text, provider, model, previousMessages, temperature, maxTokens, stream, targetLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    const options = {
      userText: text,
      provider,
      model,
      previousMessages,
      temperature,
      maxTokens,
      stream
    };

    let result;

    switch (action) {
      case 'chat':
        result = await chatService.processChat(options);
        break;
      case 'summarize':
        result = await chatService.summarizeText(options);
        break;
      case 'translate':
        result = await chatService.translateText(options, targetLanguage);
        break;
      case 'grammar_fix':
        result = await chatService.fixGrammar(options);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action provided' });
    }

    // Handle Streaming response
    if (result.isStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of result.stream) {
        // Handle provider specific chunk structures
        let content = '';
        if (result.provider === 'openai') {
          content = chunk.choices[0]?.delta?.content || '';
        } else if (result.provider === 'groq') {
          content = chunk.choices[0]?.delta?.content || '';
        }

        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    // Handle Standard JSON response
    return res.json({ 
      success: true, 
      data: result.content, 
      usage: result.usage,
      provider: result.provider 
    });

  } catch (error) {
    console.error('Error handling chat request:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  handleChatRequest
};
