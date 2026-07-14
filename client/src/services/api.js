const API_URL = 'http://localhost:5001/api';

export const sendChatRequest = async (action, text, options = {}) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Spread the options into the body as the controller expects them flat
      body: JSON.stringify({ action, text, ...options })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};

export const streamChatRequest = async (action, text, options = {}, onChunk, onDone, onError) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, text, ...options, stream: true })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              done = true;
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.content) {
                  onChunk(parsed.content);
                }
              } catch (e) {
                console.error('Error parsing SSE chunk', e, dataStr);
              }
            }
          }
        }
      }
    }
    onDone();
  } catch (error) {
    console.error('Stream API Request Failed:', error);
    onError(error);
  }
};
