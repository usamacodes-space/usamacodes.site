import { ArrowUp, Mic } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { CAPABILITIES } from '../constants';
import { BentoCard } from './BentoCard';

interface SearchTerminalProps {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: (forcedQuery?: string) => void;
  onClear: () => void;
  aiResponse: string | null;
  isTyping: boolean;
  chatError?: boolean;
  chatErrorMessage?: string | null;
}

export const SearchTerminal: React.FC<SearchTerminalProps> = ({
  query,
  setQuery,
  handleSearch,
  aiResponse,
  isTyping,
  chatError,
  chatErrorMessage,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex flex-col flex-1 min-h-[calc(100vh-8rem)]">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4">
        <h1
          className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: 'forwards', color: 'var(--brand-light)' }}
        >
          What can I help you with?
        </h1>
        <p
          className="text-center text-sm mb-8 sm:mb-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '80ms', animationFillMode: 'forwards', color: 'var(--brand-slate-light)' }}
        >
          Ask me about my projects, stack, and experience
        </p>

        {/* Capability bento cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
          {CAPABILITIES.map((cap, i) => (
            <BentoCard
              key={i}
              component="button"
              onClick={() => { setQuery(cap.prompt); handleSearch(cap.prompt); }}
              className="opacity-0 animate-fade-in-up text-left"
              sx={{
                animationFillMode: 'forwards',
                animationDelay: `${120 + i * 70}ms`,
                minHeight: { xs: 88, sm: 100 },
                p: { xs: 2, sm: 2.5 },
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <div className="mb-1.5">
                {React.cloneElement(cap.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
              </div>
              <div className="font-semibold text-sm" style={{ color: 'var(--brand-light)' }}>
                {cap.title}
              </div>
              <div className="text-xs" style={{ color: 'var(--brand-slate-light)' }}>
                {cap.description}
              </div>
            </BentoCard>
          ))}
        </div>
      </div>

      {/* AI response */}
      {(aiResponse || isTyping) && (
        <BentoCard
          className="mb-4 animate-fade-in-up"
          sx={{
            animationFillMode: 'forwards',
            maxWidth: 560,
            mx: 'auto',
            width: '100%',
          }}
          hover={false}
        >
          <div className="flex gap-3">
            <div
              className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: '#f97316', color: '#fff' }}
            >
              AI
            </div>
            <div className="flex-1 min-w-0" aria-live="polite" aria-atomic="true">
              {isTyping ? (
                <div className="flex gap-1.5 items-center h-6">
                  <span className="w-1.5 h-1.5 rounded-full animate-typing-dot" style={{ backgroundColor: '#f97316', animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-typing-dot" style={{ backgroundColor: '#f97316', animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-typing-dot" style={{ backgroundColor: '#f97316', animationDelay: '400ms' }} />
                </div>
              ) : (
                <>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--brand-light)' }}>
                    {aiResponse}
                  </p>
                  {chatError && (
                    <div className="mt-2">
                      {chatErrorMessage && (
                        <p className="text-[10px] mb-1" style={{ color: 'var(--brand-slate-light)' }}>({chatErrorMessage})</p>
                      )}
                      <button
                        onClick={() => handleSearch(query)}
                        className="text-xs font-medium"
                        style={{ color: '#f97316' }}
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </BentoCard>
      )}

      {/* Input bar */}
      <div className="w-full max-w-xl mx-auto pt-2 pb-2">
        <div
          className="rounded-2xl flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 transition-all"
          style={{
            border: '1px solid rgba(93, 112, 127, 0.25)',
            backgroundColor: 'rgba(93, 112, 127, 0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <input
            ref={inputRef}
            placeholder="Ask anything..."
            className="flex-1 min-w-0 bg-transparent border-0 outline-none px-1 py-2 text-sm"
            style={{ color: 'var(--brand-light)' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Ask a question"
          />
          <IconButton disabled size="small" sx={{ opacity: 0.4 }} aria-label="Voice (coming soon)">
            <Mic size={16} />
          </IconButton>
          <IconButton
            onClick={() => handleSearch()}
            disabled={isTyping || !query.trim()}
            size="small"
            aria-label="Send"
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              width: 34,
              height: 34,
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': { bgcolor: 'rgba(93,112,127,0.2)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {isTyping ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
          </IconButton>
        </div>
        <p className="text-center text-[10px] sm:text-xs mt-2.5 px-2" style={{ color: 'var(--brand-slate-light)' }}>
          AI-powered — ask about my projects, stack, and experience
        </p>
      </div>
    </div>
  );
};
