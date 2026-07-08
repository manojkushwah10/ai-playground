import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '../ui';
import { sendChatRequest } from '../../services/api';
import { MessageSquare, AlignLeft, Languages, CheckCircle2, Send, Sparkles, User, Bot } from 'lucide-react';

const modes = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={16} /> },
  { id: 'summarize', label: 'Summarize', icon: <AlignLeft size={16} /> },
  { id: 'translate', label: 'Translate', icon: <Languages size={16} /> },
  { id: 'grammar_fix', label: 'Grammar', icon: <CheckCircle2 size={16} /> }
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
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-4 md:gap-6 transition-all duration-500 ease-out">
      {/* Header Area */}
      <div className="text-center mt-2 md:mt-4">
        <div className="flex justify-center items-center gap-2 mb-1 md:mb-2">
          <Sparkles className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Nexus AI
          </h1>
        </div>
        <p className="text-slate-400 text-xs md:text-sm">Your intelligent workspace for everything.</p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center mb-2 z-10 w-full px-2">
        <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-900/40 md:rounded-full rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-xl snap-x">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`
                flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-full transition-all duration-300 font-medium text-xs md:text-sm whitespace-nowrap snap-start flex-1 md:flex-none
                ${activeMode === mode.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 md:scale-105' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              {mode.icon}
              <span className={activeMode === mode.id ? 'block' : 'hidden md:block'}>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Translate Options */}
      {activeMode === 'translate' && (
        <div className="flex justify-center items-center gap-3 z-10 transition-all duration-300">
          <span className="text-sm text-slate-400 font-medium">Target Language:</span>
          <select 
            value={targetLanguage} 
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="
              bg-slate-800/60 border border-slate-700/50 text-slate-200 
              py-1.5 px-3 text-sm rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50
              backdrop-blur-sm
            "
            style={{ appearance: 'none', WebkitAppearance: 'none' }}
          >
            <option value="Spanish" className="bg-slate-800">Spanish</option>
            <option value="French" className="bg-slate-800">French</option>
            <option value="German" className="bg-slate-800">German</option>
            <option value="Hindi" className="bg-slate-800">Hindi</option>
            <option value="Japanese" className="bg-slate-800">Japanese</option>
          </select>
        </div>
      )}

      {/* Chat Area - Pure Tailwind Glassmorphism */}
      <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 md:rounded-[2rem] rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Subtle Shine Effect over the chat container */}
        <div className="absolute inset-0 pointer-events-none md:rounded-[2rem] rounded-2xl overflow-hidden hidden md:block">
          <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[pulse_8s_infinite]"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 gap-4 md:gap-6 flex flex-col relative z-10 scroll-smooth">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-500`}
            >
              <div className={`flex gap-2 md:gap-3 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <User className="text-white w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-md">
                      <Bot className="text-purple-400 w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`
                  px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-[1.25rem] leading-relaxed text-sm md:text-[0.95rem] shadow-md
                  ${msg.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-100 rounded-tl-sm'
                  }
                `}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex w-full justify-start transition-all duration-300">
              <div className="flex gap-2 md:gap-3 max-w-[95%] md:max-w-[85%] flex-row">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-md">
                    <Bot className="text-purple-400 w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
                <div className="px-4 py-3 md:px-5 md:py-4 rounded-2xl md:rounded-[1.25rem] rounded-tl-sm bg-slate-800/80 backdrop-blur-md border border-slate-700/50 flex items-center shadow-md">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl relative z-10">
          <div className="flex gap-2 md:gap-3 items-center max-w-3xl mx-auto">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter text to ${activeMode}...`}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
