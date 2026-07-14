import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Select, Slider, Toggle } from '../ui';
import { sendChatRequest, streamChatRequest } from '../../services/api';
import { MessageSquare, AlignLeft, Languages, CheckCircle2, Send, Sparkles, User, Bot, Settings2 } from 'lucide-react';

const modes = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={16} /> },
  { id: 'summarize', label: 'Summarize', icon: <AlignLeft size={16} /> },
  { id: 'translate', label: 'Translate', icon: <Languages size={16} /> },
  { id: 'grammar_fix', label: 'Grammar', icon: <CheckCircle2 size={16} /> }
];

const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'groq', label: 'Groq' }
];

const modelOptions = {
  openai: [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4o', label: 'GPT-4o' }
  ],
  groq: [
    { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
    { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B' },
    { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' }
  ]
};

export const AIChatApp = () => {
  const [activeMode, setActiveMode] = useState('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  
  const [provider, setProvider] = useState(() => localStorage.getItem('ai_provider') || 'openai');
  const [model, setModel] = useState(() => localStorage.getItem('ai_model') || 'gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(() => {
    const saved = localStorage.getItem('ai_temperature');
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [maxTokens, setMaxTokens] = useState(() => {
    const saved = localStorage.getItem('ai_maxTokens');
    return saved !== null ? parseInt(saved, 10) : 1000;
  });
  const [isStreaming, setIsStreaming] = useState(() => {
    const saved = localStorage.getItem('ai_isStreaming');
    return saved !== null ? saved === 'true' : false;
  });
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_model', model);
    localStorage.setItem('ai_temperature', temperature);
    localStorage.setItem('ai_maxTokens', maxTokens);
    localStorage.setItem('ai_isStreaming', isStreaming);
  }, [provider, model, temperature, maxTokens, isStreaming]);

  useEffect(() => {
    const isValidModel = modelOptions[provider].some(m => m.value === model);
    if (!isValidModel) {
      setModel(modelOptions[provider][0].value);
    }
  }, [provider, model]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const previousMessages = messages.filter(m => !m.usageInfo).map(m => ({
      role: m.role,
      content: m.content
    }));

    const options = {
      provider,
      model,
      temperature,
      maxTokens,
      previousMessages,
      ...(activeMode === 'translate' && { targetLanguage })
    };

    try {
      if (isStreaming) {
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        
        await streamChatRequest(
          activeMode, 
          userMessage, 
          options, 
          (chunk) => {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              lastMsg.content += chunk;
              return newMessages;
            });
          },
          () => setIsLoading(false),
          (err) => {
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1].content = err.message || 'Error during streaming.';
              return newMsgs;
            });
            setIsLoading(false);
          }
        );
      } else {
        const response = await sendChatRequest(activeMode, userMessage, options);
        if (response.success) {
          setMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: response.data,
              usageInfo: response.usage ? `Tokens: ${response.usage.total_tokens}` : null 
            }
          ]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: error.message || 'Error communicating with the server.' }]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/60 backdrop-blur-xl relative">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/80 sticky top-0 z-20 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />
          <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Nexus AI
          </h1>
        </div>

        {/* Mode Selector - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto overflow-x-auto no-scrollbar gap-2 px-4 justify-center">
          <div className="flex bg-slate-900/40 rounded-full border border-slate-700/50 backdrop-blur-md p-1">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`
                  flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 font-medium text-xs md:text-sm whitespace-nowrap
                  ${activeMode === mode.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/25' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-purple-400 transition-colors bg-slate-800/50 rounded-full border border-slate-700/50 hover:bg-slate-700/50 flex items-center justify-center gap-2"
          >
            <Settings2 size={18} />
            <span className="hidden md:block text-sm font-medium pr-1">{provider} / {model}</span>
          </button>
        </div>
      </div>

      {/* Mode Selector - Mobile Fallback */}
      <div className="md:hidden flex w-full overflow-x-auto no-scrollbar gap-2 p-2 border-b border-slate-700/50 bg-slate-900/40">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`
              flex items-center justify-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-xs whitespace-nowrap flex-1
              ${activeMode === mode.id 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                : 'text-slate-400 bg-slate-800/40'
              }
            `}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Overlay Drawer */}
      {showSettings && (
        <div className="absolute right-0 md:right-4 top-16 md:top-20 z-30 w-full md:w-96 p-4 bg-slate-900 border-b md:border border-slate-700/80 md:rounded-2xl shadow-2xl flex flex-col gap-5 animate-in slide-in-from-top-2 md:slide-in-from-right-2 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-semibold text-slate-200 text-sm">Model Configuration</h3>
            <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-slate-300 text-xs font-bold px-2 py-1 bg-slate-800 rounded">Close</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Provider & Model</span>
            <div className="flex gap-2">
              <Select 
                value={provider} 
                onChange={e => setProvider(e.target.value)} 
                options={providerOptions} 
                className="flex-1"
              />
              <Select 
                value={model} 
                onChange={e => setModel(e.target.value)} 
                options={modelOptions[provider]} 
                className="flex-[2]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Slider 
              label="Temperature (Creativity)"
              min="0" max="1" step="0.1" 
              value={temperature} 
              onChange={e => setTemperature(parseFloat(e.target.value))} 
            />
            <div className="flex items-center justify-between">
              <Toggle 
                label="Stream Response" 
                checked={isStreaming} 
                onChange={e => setIsStreaming(e.target.checked)} 
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Tokens:</span>
                <input 
                  type="number" 
                  value={maxTokens} 
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs w-20 text-slate-200 outline-none focus:border-purple-500 text-right"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto w-full relative scroll-smooth flex flex-col">
        {/* Translate options banner if needed */}
        {activeMode === 'translate' && (
          <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 p-2 flex justify-center items-center gap-3 w-full shadow-sm">
            <span className="text-sm text-slate-400 font-medium">Target Language:</span>
            <Select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              options={[
                {value: 'Spanish', label: 'Spanish'},
                {value: 'French', label: 'French'},
                {value: 'German', label: 'German'},
                {value: 'Hindi', label: 'Hindi'},
                {value: 'Japanese', label: 'Japanese'}
              ]}
              className="py-1"
            />
          </div>
        )}

        <div className="flex-1 w-full flex flex-col items-center">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`w-full border-b ${msg.role === 'user' ? 'bg-transparent border-transparent' : 'bg-slate-800/30 border-slate-800/50'}`}
            >
              <div className="max-w-3xl mx-auto flex gap-4 md:gap-6 p-4 md:p-6 md:py-8 w-full">
                
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <User className="text-white w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center shadow-md">
                      <Bot className="text-white w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
                  <div className="text-[0.95rem] md:text-base leading-relaxed text-slate-200">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {/* Token Usage Badge */}
                  {msg.usageInfo && (
                    <span className="text-[10px] text-slate-500 font-mono self-start mt-2 border border-slate-700/50 bg-slate-900/30 px-2 py-0.5 rounded-md">
                      {msg.usageInfo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && !isStreaming && (
            <div className="w-full border-b bg-slate-800/30 border-slate-800/50">
              <div className="max-w-3xl mx-auto flex gap-4 md:gap-6 p-4 md:p-6 md:py-8 w-full">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center shadow-md">
                    <Bot className="text-white w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 pt-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Spacer block at the bottom so latest messages aren't hidden behind the input area */}
          <div ref={messagesEndRef} className="h-32 md:h-40 w-full flex-shrink-0"></div>
        </div>
      </div>

      {/* Input Area Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto relative group">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Send a message to ${activeMode}...`}
            className="w-full bg-slate-800/90 border border-slate-700 pr-16 shadow-2xl focus:bg-slate-800 placeholder-slate-500 rounded-2xl"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="!p-2 md:!p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 shadow-md"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </Button>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] md:text-xs text-slate-500">
            Nexus AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
};
