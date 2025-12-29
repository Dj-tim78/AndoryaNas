
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant AndoryaNas. Je peux vous aider à configurer vos partages, dépanner vos lettres réseau ou optimiser vos disques. Comment puis-je vous aider ?" }
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

    // IMPORTANT: La clé doit être nommée API_KEY dans votre environnement
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "⚠️ Erreur : Aucune clé API détectée. Assurez-vous d'avoir renommé votre variable d'environnement en 'API_KEY' (et non 'GEMINI_API_KEY')." 
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `Vous êtes un ingénieur expert en stockage réseau (NAS). 
          L'utilisateur utilise l'interface AndoryaNas.
          Conseillez sur :
          - Les commandes "net use" (Windows) ou montage SMB (Mac/Linux).
          - Les configurations RAID et le système de fichiers Btrfs.
          - Le dépannage des accès réseau et pare-feu.
          Répondez en Français, de manière concise.`,
        }
      });

      const assistantMessage = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      let errorMsg = "Une erreur est survenue lors de la connexion à l'IA.";
      if (error.message?.includes('403')) errorMsg = "Clé API invalide ou non autorisée.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
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
            <h3 className="font-bold text-zinc-100">Ingénieur Support IA</h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Propulsé par Gemini
            </p>
          </div>
        </div>
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
                {msg.content}
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
                Analyse de votre NAS...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        {!process.env.API_KEY && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-xs text-rose-400">
            <AlertCircle size={14} />
            <span>Variable 'API_KEY' manquante dans l'environnement.</span>
          </div>
        )}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Posez une question sur votre serveur (ex: Comment monter un disque sur Windows ?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full pl-6 pr-14 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 rounded-xl text-white transition-all shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
