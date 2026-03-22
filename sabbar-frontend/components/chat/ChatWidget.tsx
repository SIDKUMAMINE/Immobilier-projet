'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Salam! 👋 Je suis l\'Assistant SABBAR. Comment puis-je vous aider à qualifier vos prospects immobiliers aujourd\'hui?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Merci pour votre message. Cette fonctionnalité sera bientôt intégrée avec notre API backend. Pour l\'instant, vous pouvez explorer la plateforme.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group z-40"
          aria-label="Open chat"
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-black border-2 border-amber-600 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 border-b-2 border-amber-600 p-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">SABBAR</h3>
              <p className="text-sm text-amber-500">Assistant IA</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-amber-500 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl transition-all ${
                    message.role === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none shadow-lg'
                      : 'bg-gray-800 text-gray-100 border border-amber-600/30 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-amber-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-amber-600/30 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t-2 border-amber-600 p-4 bg-black space-y-3"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Votre message..."
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all placeholder-gray-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              <span>Envoyer</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}