import React, { useState, useEffect, useRef } from 'react';
import { aiCoachService, QUICK_PROMPTS } from '../../services/aiCoachService';
import type { ChatMessage, QuickPrompt } from '../../types/chat';
import { Bot, X, Send, Sparkles, User, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({ isOpen, onClose, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastHandledPromptRef = useRef<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const init = await aiCoachService.getInitialMessages();
      setMessages(init);
    };
    load();
  }, []);

  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt !== lastHandledPromptRef.current) {
      lastHandledPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await aiCoachService.sendMessage(text);
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-coach-title"
          className="relative w-full max-w-lg h-full bg-stone-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-surya-500 to-amber-600 p-0.5 shadow-glow-surya flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-obsidian-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-surya-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="ai-coach-title" className="font-bold text-slate-900 dark:text-white text-base">Saathi AI Coach</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-prana-500/20 text-prana-700 dark:text-prana-400 border border-prana-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Indian Metabolic & Diet Intelligence</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close AI Coach"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-surya-500/20 border border-surya-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-surya-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-prana-600 to-emerald-600 text-white font-medium shadow-glow-prana'
                        : 'glass-panel border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sugg, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sugg)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white dark:bg-obsidian-950/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-surya-700 dark:text-surya-400 border border-surya-500/30 transition-colors text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
                          >
                            + {sugg}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-prana-500/20 border border-prana-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-prana-400" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-surya-500/20 border border-surya-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-surya-400 animate-spin" />
                </div>
                <div className="glass-panel p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-surya-400 animate-pulse" />
                  <span>Saathi AI is formulating Indian health advice...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-5 py-2.5 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-obsidian-900/60">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Suggested Topics:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => handleSend(qp.prompt)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-stone-100 hover:bg-stone-200 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 whitespace-nowrap shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
                >
                  {qp.title}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-950">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ghar ka khana, blood sugar, workouts..."
                aria-label="Message Saathi AI Coach"
                className="w-full bg-stone-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-2xl py-3 pl-4 pr-12 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-prana-500 focus:border-prana-500 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="absolute right-2 p-2 rounded-xl bg-prana-500 text-obsidian-950 font-bold disabled:opacity-40 disabled:hover:bg-prana-500 hover:bg-prana-400 transition-all shadow-glow-prana"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
