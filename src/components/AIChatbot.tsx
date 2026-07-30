import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Terminal, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am David's virtual assistant. Ask me anything about his technical projects (like Mob Deals, PokeGuru and DKMA Monster), his skills, or his professional background.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [a11yMsg, setA11yMsg] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMsg: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || "I didn't receive a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'System error: Failed to connect to secure API chat gateway.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setA11yMsg('');
      setTimeout(() => setA11yMsg('AI assistant response received.'), 50);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hello! I am David's virtual assistant. Ask me anything about his technical projects (like Mob Deals, PokeGuru and DKMA Monster), his skills, or his professional background.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleQuickPrompt = async (promptText: string) => {
    if (isLoading) return;
    const newMsg: Message = {
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          history: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || "I didn't receive a response. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'System error: Failed to connect to secure API chat gateway.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Screen-reader live region â€” always in DOM, invisible */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {a11yMsg}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 sm:bottom-6 right-6 z-40 p-3.5 min-w-11 min-h-11 bg-amber-color text-[#030c14] rounded-full hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-color focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center justify-center cursor-pointer select-none"
        style={{ boxShadow: 'var(--linacre-glow-strong)' }}
        aria-label="Toggle AI Assistant"
        id="btn-chatbot-toggle"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5 animate-pulse" />}
      </button>

      {/* Chat Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="fixed bottom-22 inset-x-3 z-40 sm:inset-x-auto sm:right-6 sm:w-[360px] h-[65vh] max-h-[85vh] sm:h-[450px] bg-[#030c14] border border-border-color rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs"
            id="chatbot-window"
          >
            {/* Terminal Header */}
            <div className="bg-[#061520] px-4 py-3 flex items-center justify-between border-b border-border-color/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-color" />
                <span className="text-foreground font-bold text-[11px]">linacre-assistant.sh</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Clear Conversation Logs"
                  className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 focus:outline-none flex items-center justify-center"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-color animate-ping" />
                  <span className="text-[9px] text-muted-foreground/80">Online</span>
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/40"
              id="chatbot-messages"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-color/10 border border-amber-color/25 text-amber-color rounded-tr-none'
                        : 'bg-muted/30 border border-border-color/50 text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="space-y-2 pt-2.5 border-t border-border-color/20 mt-3.5">
                  <span className="text-[9px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                    Suggested Prompts:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "What are David's primary technical skills?",
                      "Tell me about David's open-source projects",
                      'How do I request access to his private code?',
                      'Is David currently open for freelance work?',
                    ].map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-left px-2.5 py-1.8 border border-border-color/40 hover:border-amber-color/60 hover:bg-amber-color/5 text-[10px] text-muted-foreground hover:text-amber-color rounded transition-all cursor-pointer font-mono"
                      >
                        &gt; {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-color" />
                  <span>Processing query...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-[#061520] border-t border-border-color/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about David's projects..."
                className="flex-1 bg-background border border-border-color/60 rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-amber-color"
                disabled={isLoading}
                id="chatbot-input"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-amber-color hover:bg-amber-color/90 disabled:opacity-40 text-black rounded transition-colors cursor-pointer"
                id="btn-chatbot-send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
