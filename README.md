# Nexus AI (AI Playground)

A modern, full-stack AI chat application built to explore and demonstrate core Large Language Model (LLM) concepts.

This project provides a beautiful, ChatGPT-like UI (built with React and Tailwind CSS) connected to a robust Node.js backend that seamlessly switches between multiple AI providers like OpenAI and Groq.

## ✨ Features & LLM Concepts Demonstrated

1. **Messages & Context Window**: Maintains conversation history for context-aware responses.
2. **System Prompts**: Dynamically injects instructions based on the selected mode (Chat, Summarize, Translate, Grammar Fix).
3. **Model Selection**: Switch instantly between providers (OpenAI, Groq) and models (GPT-3.5, GPT-4o, Llama 3.1, Mixtral).
4. **Temperature Control**: Adjust the creativity/randomness of the AI responses via a UI slider.
5. **Token Limits**: Control the maximum output tokens to manage costs and length.
6. **Streaming**: Real-time Server-Sent Events (SSE) stream the AI's response to the client for a smooth typing effect.
7. **Cost Awareness**: Displays token usage badges on messages (when streaming is disabled) to monitor API consumption.
8. **Error Handling**: Gracefully handles rate limits, decommissioned models, and API errors, surfacing clear messages to the user.
9. **Environment Variables**: Securely manages sensitive API keys on the backend.
10. **State Persistence**: Saves your provider, model, and parameter preferences in the browser's `localStorage`.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, `openai`, `groq-sdk`
- **Architecture**: Client-Server architecture communicating via REST APIs and Server-Sent Events (SSE).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- API Keys from [OpenAI](https://platform.openai.com/) and/or [Groq](https://console.groq.com/)

### Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone https://github.com/manojkushwah10/ai-playground.git
   cd ai-playground
   ```

2. **Install dependencies**:

   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `server/` directory and add your API keys:
   ```env
   OPENAI_API_KEY="sk-your-openai-api-key"
   GROQ_API_KEY="gsk_your-groq-api-key"
   PORT=5001
   ```

### Running the App

You can start both the frontend and backend simultaneously from the root directory using:

```bash
npm run dev
```

- **Frontend**: Opens at `http://localhost:5173`
- **Backend**: Runs on `http://localhost:5001` (Port 5001 is used to avoid conflicts with macOS AirPlay receiver on port 5000).

## 🎨 UI/UX

The application features a premium, glassmorphism aesthetic with a full-screen layout.

- **Top Bar**: Mode selector (Chat, Summarize, etc.) and Settings toggle.
- **Settings Drawer**: Configure AI parameters on the fly.
- **Chat Interface**: Clean, centered chat bubbles with floating sticky input.

## 🤝 Contributing

Feel free to open issues or submit pull requests for any bug fixes or feature enhancements!
