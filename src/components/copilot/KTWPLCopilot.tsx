import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { queryRag } from '../../data/ragKnowledge';
import { ChatMessage } from '../../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  ShieldCheck, 
  ArrowRight,
  User
} from 'lucide-react';

interface KTWPLCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeSimulatorAmount?: number;
  onNavigateAction?: (target: string, payload?: any) => void;
  pendingPrompt?: string | null;
  onClearPendingPrompt?: () => void;
}

export const KTWPLCopilot: React.FC<KTWPLCopilotProps> = ({
  isOpen,
  onClose,
  activeSimulatorAmount,
  onNavigateAction,
  pendingPrompt,
  onClearPendingPrompt,
}) => {
  const { role } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Welcome to the KTWPL Institutional Assistant.\n\nI have indexed your active mandates (#AG-8912, #AG-9204, #AG-7840), our double-entry ledger records, and current SEBI regulatory circulars. How may I assist with your mandate or operations?`,
      citations: [
        {
          label: 'Master Mandate Repository',
          source: 'KTWPL Digitized Escrow Ledger',
        },
      ],
      quickActions: [
        { label: 'When is my next interest payout for Agreement #AG-8912?', actionType: 'PROMPT' },
        { label: 'What is the tax implication on my quarterly payouts?', actionType: 'PROMPT' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips based on active role
  const samplePrompts = role === 'admin'
    ? [
        'Show me all pending withdrawal requests over ₹10 Lakhs',
        'Summarize liquidity outflows for next week.',
        'What is our current escrow coverage ratio?',
      ]
    : role === 'compliance'
    ? [
        'Are there any pending CKYC or PAN-Aadhaar mismatch flags?',
        'Verify compliance with SEBI client fund segregation mandate',
        'Show latest audit hash seals for October payouts',
      ]
    : [
        'When is my next interest payout for Agreement #AG-8912?',
        'What is the tax implication on my quarterly payouts?',
        'Can I withdraw 50% of my principal before the 6-month lock-in?',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Handle auto-executing pending prompts when opened externally
  useEffect(() => {
    if (pendingPrompt && isOpen) {
      handleSend(pendingPrompt);
      if (onClearPendingPrompt) onClearPendingPrompt();
    }
  }, [pendingPrompt, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const ragResponse = queryRag(query, role, activeSimulatorAmount);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: ragResponse.answer,
        citations: ragResponse.citations,
        quickActions: ragResponse.quickActions,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'PROMPT' || !action.actionType) {
      // Execute directly in chat
      handleSend(action.label);
    } else {
      if (onNavigateAction) {
        onNavigateAction(action.actionType, action.payload);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-card border-l border-subtle shadow-dropdown flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-subtle bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink-primary flex items-center gap-2">
              <span>KTWPL Assistant</span>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                RAG Active
              </span>
            </h3>
            <p className="text-[10px] text-ink-muted">
              Context: {role.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-ink-muted hover:text-ink-primary hover:bg-elevated transition-colors"
          title="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2.5 border-b border-subtle bg-canvas overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-elevated hover:brightness-110 border border-subtle text-ink-secondary hover:text-ink-primary transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-ink-muted font-mono">
                <span>{isUser ? 'You' : 'KTWPL AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] p-3.5 rounded-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-elevated text-ink-primary border border-subtle'
                    : 'bg-surface border border-card text-ink-secondary'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-subtle space-y-1">
                    <div className="text-[10px] uppercase font-mono text-ink-muted flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Verified Citations</span>
                    </div>
                    {msg.citations.map((c, i) => (
                      <div
                        key={i}
                        className="text-[10px] p-1.5 rounded bg-canvas border border-subtle font-mono text-ink-muted"
                      >
                        <strong className="text-ink-primary block">{c.clause || c.label}:</strong>
                        <span>{c.source}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action / Follow-up Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2.5 pt-2 flex flex-wrap gap-1.5">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(qa)}
                        className="text-[11px] px-2.5 py-1 rounded bg-elevated hover:brightness-110 border border-subtle text-gold-500 font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>{qa.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-xs text-ink-muted p-2 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span>Formulating response from agreement vault...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-3 border-t border-subtle bg-surface">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about payouts, lock-in, tax..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-canvas border border-subtle text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-gold-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] disabled:opacity-40 transition-colors shadow-sm"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
