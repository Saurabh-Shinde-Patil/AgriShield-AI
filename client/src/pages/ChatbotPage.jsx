import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { chatbotQuery } from '../services/api';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '🌱 Namaste! I\'m AgriShield AI, your farming assistant. Ask me anything about pest control, crop diseases, weather effects, or farming practices. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const suggestions = [
    'How to control pests in rice?',
    'What diseases affect tomato?',
    'When should I spray pesticides?',
    'Organic pest control methods',
    'Weather impact on crops',
    'Cotton pest management'
  ];

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg, timestamp: new Date() }]);
    setLoading(true);

    try {
      const result = await chatbotQuery(msg);
      setMessages(prev => [...prev, { role: 'bot', text: result.response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    }
    setLoading(false);
  }

  function formatText(text) {
    // Convert markdown-like formatting
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="block text-white mt-2">{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.startsWith('•')) return <li key={i} className="ml-4 text-sm">{line.substring(1)}</li>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm">{line.substring(2)}</li>;
      return <span key={i} className="block">{line}</span>;
    });
  }

  return (
    <div className="pt-20 pb-12 max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white mb-1">🤖 AgriBot Assistant</h1>
        <p className="text-slate-400 mb-6">Ask anything about farming, pest control, or crop diseases</p>
      </motion.div>

      <div className="glass-card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Messages */}
        <div ref={chatRef} className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 130px)' }}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-300 rounded-bl-sm'
              }`}>
                {msg.role === 'bot' && <div className="text-xs text-primary-400 font-semibold mb-1">🌱 AgriBot</div>}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{formatText(msg.text)}</div>
                <div className="text-xs opacity-50 mt-2 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-t border-slate-700/50 overflow-x-auto">
          <div className="flex gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                className="flex-none px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-primary-400 hover:border-primary-500/50 transition-all cursor-pointer whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex gap-3">
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your farming question..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="btn-glow px-6 py-3 rounded-xl text-white font-semibold border-none cursor-pointer disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
