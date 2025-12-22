
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AndoryaNas assistant. I can help you set up shared folders, troubleshoot network drive letters, or optimize your storage pool. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are an expert IT and Network Storage engineer for AndoryaNas. 
          The user is interacting with their NAS dashboard.
          Provide clear, technical yet accessible advice about:
          - Mapping network drive letters (using "net use" on Windows, or SMB on macOS).
          - Setting up SMB/NFS protocols.
          - Troubleshooting why a network drive might not connect (firewall, credentials, network isolation).
          - Storage management and RAID configurations.
          Keep responses concise and formatted with markdown.`,
        }
      });

      const assistantMessage = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the brain center. Please check your network connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Bot className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100">AI Support Engineer</h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Powered by Gemini
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Reset Session
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-zinc-300 rounded-tl-none border border-zinc-700'
              }`}>
                {msg.content.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Bot size={16} className="text-purple-400 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-500 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Processing request...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Ask anything (e.g., 'How do I map a network drive on Windows 11?')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full pl-6 pr-14 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-white transition-all shadow-lg shadow-purple-600/20"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <Sparkles size={12} className="text-purple-500" />
            Instant Support
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <Sparkles size={12} className="text-purple-500" />
            Configuration Guide
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;