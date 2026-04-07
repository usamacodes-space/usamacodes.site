'use client';

import { RotateCcw, Sparkles } from 'lucide-react';
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
      {/* Hero — Vite-era “AI Studio” terminal panel */}
      <div className="flex-1 flex flex-col items-center justify-start pt-2 sm:pt-3 pb-2 px-1">
        <div
          className="w-full max-w-lg rounded-2xl opacity-0 animate-fade-in-up border"
          style={{
            animationFillMode: 'forwards',
            borderColor: 'var(--panel-border)',
            backgroundColor: 'var(--panel-surface)',
            backdropFilter: 'var(--panel-backdrop)',
            WebkitBackdropFilter: 'var(--panel-backdrop)',
            boxShadow: 'var(--panel-shell-shadow)',
          }}
        >
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 border-b rounded-t-2xl overflow-hidden"
            style={{
              borderColor: 'var(--panel-border)',
              backgroundColor: 'var(--panel-header-bg)',
            }}
          >
            <span className="flex gap-1.5" aria-hidden>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#5d707f]/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#5d707f]/35" />
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--brand-slate-light)' }}
            >
              Portfolio Assistant
            </span>
            <Sparkles className="w-3.5 h-3.5 ml-auto shrink-0 text-[#f97316]" aria-hidden />
          </div>
          <div className="px-4 sm:px-5 pt-5 pb-5 sm:pb-6 rounded-b-2xl">
            <h1
              className="text-center text-lg sm:text-xl md:text-2xl font-semibold mb-2 flex flex-wrap items-center justify-center gap-2 opacity-0 animate-fade-in-up"
              style={{ animationFillMode: 'forwards', animationDelay: '60ms', color: 'var(--brand-light)' }}
            >
              <span>Ask me anything</span>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#f97316] shrink-0" aria-hidden />
            </h1>
            <p
              className="text-center text-[11px] sm:text-xs mb-5 sm:mb-6 leading-relaxed opacity-0 animate-fade-in-up max-w-md mx-auto"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards', color: 'var(--brand-slate-light)' }}
            >
              Instant answers about my work, projects, and experience — type below or pick a prompt.
            </p>

            {/* Capability bento cards — padded icon wells avoid stroke clipping + overflow cut-off */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full pt-0.5">
              {CAPABILITIES.map((cap, i) => (
                <BentoCard
                  key={i}
                  component="button"
                  type="button"
                  hover={false}
                  ariaLabel={`Ask about ${cap.title}: ${cap.description}`}
                  onClick={() => { setQuery(cap.prompt); handleSearch(cap.prompt); }}
                  className="opacity-0 animate-fade-in-up text-left"
                  sx={{
                    animationFillMode: 'forwards',
                    animationDelay: `${120 + i * 70}ms`,
                    minHeight: { xs: 110, sm: 120 },
                    padding: '12px !important',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1.25,
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 'var(--bento-shadow-hover)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <div
                    className="flex shrink-0 box-border items-center justify-center rounded-xl border p-2 w-11 h-11 sm:w-12 sm:h-12"
                    style={{
                      borderColor: 'var(--icon-well-border)',
                      backgroundColor: 'var(--icon-well-bg)',
                    }}
                  >
                    {React.cloneElement(cap.icon as React.ReactElement<{ className?: string }>, {
                      className: 'w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] text-[var(--brand-accent)]',
                    })}
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="font-semibold text-sm leading-snug" style={{ color: 'var(--brand-light)' }}>
                      {cap.title}
                    </div>
                    <div className="text-[11px] sm:text-xs mt-0.5 leading-snug" style={{ color: 'var(--brand-slate-light)' }}>
                      {cap.description}
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
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
