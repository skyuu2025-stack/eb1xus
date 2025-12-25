
import React, { useState, useRef, useEffect } from 'react';
import { createChat } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  // Fixed: Added missing 'const' keyword to chatRef.
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    if (!chatRef.current) {
      chatRef.current = createChat();
    }

    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'My apologies, I am momentarily indisposed.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'I encountered an issue with the telegraph lines. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 lg:bottom-8 right-4 lg:right-8 z-[100]">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-96 bg-white border-2 border-[#A68966]/30 shadow-2xl flex flex-col h-[400px] lg:h-[500px] animate-in slide-in-from-bottom-8 duration-500 overflow-hidden rounded-sm">
          {/* Header */}
          <div className="p-4 bg-[#141E30] border-b border-[#A68966]/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-xl font-serif text-[#A68966] font-bold">E</span>
              </div>
              <div>
                <p className="text-xs font-serif text-[#F9F7F2] uppercase tracking-widest">Sovereign Concierge</p>
                <p className="text-[8px] text-[#A68966] font-bold uppercase tracking-[0.2em]">EB1X US Registry</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#A68966] hover:text-[#F9F7F2] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar bg-[#F9F7F2]/50">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <p className="text-xs font-serif italic text-[#141E30]">"How may I assist you with EB1X US?"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 lg:p-4 text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-[#141E30] text-[#F9F7F2] border border-[#A68966]/20' 
                  : 'bg-white text-[#141E30] font-serif italic border border-[#A68966]/10 shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 lg:p-4 border border-[#A68966]/10 shadow-sm flex gap-2">
                  <div className="w-1 h-1 bg-[#A68966] rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-[#A68966] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-[#A68966] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 lg:p-4 bg-white border-t border-[#A68966]/10 flex gap-2">
            <input 
              type="text" 
              className="flex-1 text-xs font-medium tracking-wide bg-slate-50 border border-slate-200 p-2.5 lg:p-3 outline-none focus:border-[#A68966] transition-colors"
              placeholder="State your inquiry..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-[#141E30] text-[#F9F7F2] px-3 lg:px-4 py-2 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest border border-[#A68966] hover:bg-[#1B3022] transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 lg:w-16 lg:h-16 bg-[#141E30] border-2 border-[#A68966] shadow-2xl flex items-center justify-center group hover:bg-[#1B3022] transition-all duration-500 rounded-sm"
      >
        <svg className="w-6 h-6 lg:w-8 lg:h-8 text-[#A68966] transition-transform duration-500 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatBot;
