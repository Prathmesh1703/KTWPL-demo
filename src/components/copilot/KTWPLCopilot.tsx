import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { queryRag } from '../../data/ragKnowledge';
import { ChatMessage } from '../../types';
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight,
  HelpCircle
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

  // Demo questions from sampleQuestions.md
  const investorPrompts = [
    'When is my next interest payout for Agreement #AG-8912?',
    'How much interest have I earned so far?',
    'What will I receive if I invest ₹10 lakh for 12 months?',
    'Can I withdraw 50% of my principal before the lock-in ends?',
    'Is my investment agreement approved?',
    'Why is my credited interest lower than expected?',
  ];

  const adminPrompts = [
    'Show all pending withdrawal requests above ₹10 lakh.',
    'Summarize liquidity outflows for next week.',
    'How much new capital came in today?',
    'Which investors have incomplete KYC?',
    'Why is a withdrawal request pending?',
    'Which agreements mature in the next 30 days?',
  ];

  const compliancePrompts = [
    'Which investors have incomplete KYC?',
    'Summarize liquidity outflows for next week.',
    'Show all pending withdrawal requests above ₹10 lakh.',
    'Which agreements mature in the next 30 days?',
  ];

  const samplePrompts = role === 'admin' 
    ? adminPrompts 
    : role === 'compliance' 
    ? compliancePrompts 
    : investorPrompts;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Welcome to the KTWPL Institutional Assistant.\n\nI am pre-loaded with your active mandates, General Ledger records, SEBI compliance circulars, and treasury forecasts. Select any demo query above or ask a custom question:`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }, 400);
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
    <div 
      className="fixed bottom-20 right-3 sm:right-7 z-50 w-[calc(100vw-1.5rem)] sm:w-[480px] h-[640px] max-h-[calc(100vh-6.5rem)] bg-card border border-card rounded-2xl shadow-dropdown flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      {/* Solid Header */}
      <div 
        className="p-3.5 sm:p-4 border-b border-subtle bg-surface flex items-center justify-between shrink-0"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-500 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink-primary flex items-center gap-2">
              <span>KTWPL Copilot</span>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded font-medium border border-emerald-500/20">
                RAG Active
              </span>
            </h3>
            <p className="text-[10px] text-ink-muted">
              Institutional Context: {role.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-elevated transition-colors"
          title="Close Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Demo Prompts Bar */}
      <div 
        className="p-2.5 border-b border-subtle bg-canvas shrink-0"
        style={{ backgroundColor: 'var(--bg-canvas)' }}
      >
        <div className="flex items-center justify-between gap-1.5 mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted uppercase tracking-wider font-semibold">
            <HelpCircle className="w-3 h-3 text-gold-500" />
            <span>Demo Questions ({role}):</span>
          </div>
          <span className="text-[10px] text-ink-muted font-mono">{samplePrompts.length} Ready</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-elevated hover:bg-gold-500/10 border border-subtle hover:border-gold-500/40 text-ink-secondary hover:text-ink-primary transition-all shrink-0 font-medium cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area with Solid Background */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-card"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
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
                className={`max-w-[92%] p-3.5 rounded-xl text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-elevated text-ink-primary border border-subtle'
                    : 'bg-surface border border-card text-ink-primary'
                }`}
                style={{
                  backgroundColor: isUser ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                }}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Quick Action / Follow-up Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2.5 pt-2 flex flex-wrap gap-1.5">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(qa)}
                        className="text-[11px] px-2.5 py-1 rounded bg-elevated hover:bg-gold-500/10 border border-subtle hover:border-gold-500/40 text-gold-500 font-medium flex items-center gap-1 transition-colors cursor-pointer text-left"
                      >
                        <span className="line-clamp-1">{qa.label}</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
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
      <div 
        className="p-3 border-t border-subtle bg-surface shrink-0"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
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
            placeholder="Ask about payouts, lock-in, tax, outflows..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-canvas border border-subtle text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-gold-500/50"
            style={{ backgroundColor: 'var(--bg-canvas)' }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-[#080B12] disabled:opacity-40 transition-colors shadow-sm shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
