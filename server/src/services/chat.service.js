const llmService = require('./llm.service');

const processChat = async (options) => {
  return await llmService.generateResponse({
    ...options,
    systemPrompt: options.systemPrompt || 'You are a helpful and intelligent AI assistant.'
  });
};

const summarizeText = async (options) => {
  return await llmService.generateResponse({
    ...options,
    systemPrompt: 'You are an expert at summarizing text. Provide a concise, clear summary of the user\'s input.'
  });
};

const translateText = async (options, targetLanguage = 'Spanish') => {
  return await llmService.generateResponse({
    ...options,
    systemPrompt: `You are an expert translator. Translate the following text into ${targetLanguage}. Only return the translation, nothing else.`
  });
};

const fixGrammar = async (options) => {
  return await llmService.generateResponse({
    ...options,
    systemPrompt: 'You are a grammar and spell checker. Fix any errors in the text provided by the user. Do not change the meaning of the text.'
  });
};

module.exports = {
  processChat,
  summarizeText,
  translateText,
  fixGrammar
};
