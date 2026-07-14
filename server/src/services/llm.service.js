const { OpenAI } = require('openai');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

// ENVIRONMENT VARIABLES: API keys are kept secure and loaded from the environment.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Main LLM interaction service
 * 
 * @param {Object} params
 * @param {string} params.provider - 'openai' | 'groq'
 * @param {string} params.model - The model ID (e.g. 'gpt-3.5-turbo', 'llama-3.1-8b-instant')
 * @param {string} params.systemPrompt - Role instruction for the AI
 * @param {string} params.userText - The user's input
 * @param {Array}  params.previousMessages - History of the conversation (Context Window)
 * @param {number} params.temperature - Controls randomness (0 to 1)
 * @param {number} params.maxTokens - Controls cost and output length
 * @param {boolean} params.stream - Whether to return a stream or a single response
 * @returns {Promise<any>}
 */
const generateResponse = async ({
  provider = 'openai',
  model,
  systemPrompt = 'You are a helpful assistant.',
  userText,
  previousMessages = [],
  temperature = 0.7,
  maxTokens = 1000,
  stream = false,
}) => {
  // MODEL SELECTION: Defaults based on provider
  if (!model) {
    model = provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-3.5-turbo';
  }

  // MESSAGES & SYSTEM PROMPT & CONTEXT WINDOW: 
  // We format the array with a system role, followed by previous context, and finally the new user text.
  const messages = [
    { role: 'system', content: systemPrompt },
    ...previousMessages,
    { role: 'user', content: userText }
  ];

  try {
    if (provider === 'groq') {
      const response = await groq.chat.completions.create({
        messages,
        model,
        temperature, // TEMPERATURE
        max_tokens: maxTokens, // TOKEN LIMITS
        stream, // STREAMING
      });

      return formatResponse(response, stream, provider);
    } 
    else if (provider === 'openai') {
      const response = await openai.chat.completions.create({
        messages,
        model,
        temperature, // TEMPERATURE
        max_tokens: maxTokens, // TOKEN LIMITS
        stream, // STREAMING
      });

      return formatResponse(response, stream, provider);
    } 
    else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    // ERROR HANDLING: Gracefully handle provider errors, rate limits, etc.
    console.error(`[LLM Service Error] ${provider} failed:`, error.message);
    
    if (error.status === 429) {
      throw new Error(`Rate limit exceeded for provider ${provider}. Please try again later.`);
    }

    // Pass the actual error message from the provider if available
    throw new Error(error.message || `Failed to generate response from ${provider}`);
  }
};

/**
 * Formats the response depending on if it's a stream or a standard completion.
 */
const formatResponse = (response, stream, provider) => {
  if (stream) {
    // Return the iterable stream for the controller to process
    return {
      isStream: true,
      stream: response,
      provider
    };
  } else {
    // COST AWARENESS: We capture token usage to understand pricing
    const usage = response.usage;
    const content = response.choices[0]?.message?.content || '';
    
    return {
      isStream: false,
      content,
      usage, // Include tokens used
      provider
    };
  }
};

module.exports = {
  generateResponse
};
