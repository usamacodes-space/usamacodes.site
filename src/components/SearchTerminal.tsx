import { RotateCcw } from 'lucide-react';
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
  onClear,
  aiResponse,
  isTyping,
  chatError,
  chatErrorMessage,
}) => {
  const hasConversation = !!(aiResponse || isTyping);

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-start pt-[12vh] sm:pt-[14vh] pb-2">
        <h1
          className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-3 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: 'forwards', color: 'var(--brand-light)' }}
        >
          What can I help you with?
        </h1>
        <p
          className="text-center text-xs sm:text-sm mb-6 sm:mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '80ms', animationFillMode: 'forwards', color: 'var(--brand-slate-light)' }}
        >
          Ask me about my projects, stack, and experience
        </p>

        {/* Capability bento cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-lg">
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
      {hasConversation && (
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
            {/* Reset button */}
            {!isTyping && (
              <IconButton
                onClick={onClear}
                size="small"
                aria-label="Reset chat"
                sx={{
                  alignSelf: 'flex-start',
                  color: 'text.secondary',
                  opacity: 0.6,
                  '&:hover': { opacity: 1, color: '#f97316' },
                }}
              >
                <RotateCcw size={14} />
              </IconButton>
            )}
          </div>
        </BentoCard>
      )}

    </div>
  );
};
