const API_URL = 'http://localhost:5000/api';

export const sendChatRequest = async (action, text, options = {}) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, text, options })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};
