import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '../ui';
import { sendChatRequest } from '../../services/api';
import { MessageSquare, AlignLeft, Languages, CheckCircle2, Send, Loader2 } from 'lucide-react';

const modes = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} /> },
  { id: 'summarize', label: 'Summarize', icon: <AlignLeft size={18} /> },
  { id: 'translate', label: 'Translate', icon: <Languages size={18} /> },
  { id: 'grammar_fix', label: 'Grammar Fix', icon: <CheckCircle2 size={18} /> }
];

export const AIChatApp = () => {
  const [activeMode, setActiveMode] = useState('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const options = activeMode === 'translate' ? { targetLanguage } : {};
      const response = await sendChatRequest(activeMode, userMessage, options);
      
      if (response.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error communicating with the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 gap-6 animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #a855f7, #6366f1)', WebkitBackgroundClip: 'text' }}>
          AI Workspace
        </h1>
        <p className="text-secondary text-sm">Select a tool and start interacting</p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2 flex-wrap">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              activeMode === mode.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
            style={activeMode === mode.id ? { background: 'var(--primary-color)' } : { background: 'rgba(255,255,255,0.05)' }}
          >
            {mode.icon}
            <span className="font-medium text-sm">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Translate Options */}
      {activeMode === 'translate' && (
        <div className="flex justify-center items-center gap-2 animate-fade-in">
          <span className="text-sm text-secondary">Target Language:</span>
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="glass-input !w-auto !py-1 !px-2 text-sm"
          >
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Hindi">Hindi</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
      )}

      {/* Chat Area */}
      <div className="glass-panel flex-1 flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-6 gap-4 flex flex-col">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 rounded-br-none text-white shadow-md' 
                    : 'bg-white/10 rounded-bl-none border border-white/5 shadow-sm'
                }`}
                style={msg.role === 'user' ? { background: 'var(--primary-color)' } : {}}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-sm text-secondary">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter text to ${activeMode}...`}
              className="flex-1 !rounded-full !px-6"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="!rounded-full !px-6"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
