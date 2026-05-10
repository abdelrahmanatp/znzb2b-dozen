'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Loader2, MessageCircle, Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi! I'm Rehema from Dozen Hotel Supplies. I can help you find the right linen, towels, or amenities for your property — what are you looking for?",
};

const SESSION_KEY = 'rehema_session';
const HISTORY_KEY = 'rehema_history';
const HISTORY_CAP = 40;

function generateSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const id = generateSessionId();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [sessionId] = useState<string>(getSessionId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore conversation history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // silently ignore parse errors
    }
  }, []);

  // Persist history to localStorage on messages change (cap at 40)
  useEffect(() => {
    try {
      const capped = messages.slice(-HISTORY_CAP);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(capped));
    } catch {
      // silently ignore storage errors
    }
  }, [messages]);

  // Scroll to bottom on messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMessage: Message = { role: 'user', content: text };
    const assistantPlaceholder: Message = { role: 'assistant', content: '' };

    setInput('');
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;

          try {
            const parsed: { text?: string; lead_captured?: boolean; sheets_ok?: boolean } =
              JSON.parse(raw);

            if (typeof parsed.text === 'string') {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                }
                return updated;
              });
            }

            if (parsed.lead_captured === true) {
              setLeadCaptured(true);
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'assistant') {
          updated[updated.length - 1] = {
            ...last,
            content:
              "Sorry, I'm having trouble connecting right now. Please try again or email us at info@dozensupplies.com.",
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isLastAssistantStreaming =
    streaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    messages[messages.length - 1].content === '';

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl bg-white overflow-hidden"
            style={{ width: '22rem', height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-700 shrink-0">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm select-none">
                R
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Rehema</p>
                <p className="text-amber-200 text-xs leading-tight">Dozen Hotel Supplies</p>
              </div>
            </div>

            {/* Lead captured banner */}
            <AnimatePresence>
              {leadCaptured && (
                <motion.div
                  key="lead-banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 border-b border-green-100 shrink-0"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-green-700 text-xs">
                    Your details have been saved — our team will follow up.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                const isSpinning =
                  !isUser &&
                  i === messages.length - 1 &&
                  isLastAssistantStreaming;

                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {isSpinning ? (
                      <div className="flex items-center justify-center w-8 h-8">
                        <Loader2 className="w-5 h-5 text-amber-700 animate-spin" />
                      </div>
                    ) : (
                      <div
                        className={`max-w-[82%] px-3 py-2 text-sm leading-relaxed ${
                          isUser
                            ? 'bg-amber-700 text-white rounded-2xl rounded-br-sm'
                            : 'bg-stone-100 text-stone-800 rounded-2xl rounded-bl-sm'
                        }`}
                      >
                        {isUser ? (
                          msg.content
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              ul: ({ children }) => <ul className="mt-1 mb-1.5 space-y-0.5 pl-4 list-disc">{children}</ul>,
                              ol: ({ children }) => <ol className="mt-1 mb-1.5 space-y-0.5 pl-4 list-decimal">{children}</ol>,
                              li: ({ children }) => <li className="leading-snug">{children}</li>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div className="px-3 py-2 border-t border-stone-200 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={streaming}
                placeholder="Type a message…"
                className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-sm text-stone-800 placeholder-stone-400 outline-none disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={streaming || input.trim() === ''}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center text-white shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-800 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy micro-copy */}
            <p className="text-center px-4 pb-2 text-[10px] text-stone-400">
              By sharing your details you agree to our{' '}
              <a href="/privacy" className="underline hover:text-stone-600">
                privacy policy
              </a>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Green dot badge — shown when lead captured and panel is closed */}
        {leadCaptured && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close chat' : 'Open chat'}
          className="w-14 h-14 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-lg hover:bg-amber-800 transition-colors"
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
