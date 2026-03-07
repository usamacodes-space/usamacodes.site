import { ArrowRight, Mic, RotateCcw, Sparkles, Zap } from 'lucide-react';
import React from 'react';
import { CAPABILITIES } from '../constants';

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full py-6 sm:py-8 px-2 sm:px-1">
      <div className="text-center mb-5 sm:mb-8 opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
        <h1 className="font-mono text-2xl sm:text-3xl font-medium text-[#ecebf3] mb-2 leading-tight">
          Ask Me Anything <Sparkles className="inline-block w-5 h-5 sm:w-6 sm:h-6 text-[#f97316] ml-1" />
        </h1>
        <p className="font-mono text-[var(--brand-slate-light)] text-sm sm:text-base px-1">Instant Answers About My Work, Projects, And Experience</p>
      </div>

      <div className="relative group mb-6 sm:mb-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f97316]/20 to-[#5d707f]/10 rounded-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
        <div className="relative rounded-xl p-1.5 sm:p-1 shadow-2xl focus-within:border-[#f97316]/50 focus-within:shadow-[#f97316]/10 focus-within:shadow-2xl transition-all duration-300 bg-[var(--brand-bg)] border border-[#5d707f]/40">
          <div className="flex flex-col">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about my work, projects or experience..."
              className="font-mono bg-transparent border-none outline-none px-4 py-3.5 sm:py-3 text-[16px] sm:text-[14px] w-full min-w-0 text-[#ecebf3] placeholder:text-[var(--brand-slate-light)] placeholder:truncate transition-colors touch-manipulation"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Ask a question about Usama"
            />
            <div className="flex items-center justify-between gap-2 sm:gap-1 px-3 sm:px-2 pb-2 pt-2 sm:pb-1.5 sm:pt-1 border-t border-[#5d707f]/40 mt-1">
              <div className="flex items-center gap-1.5 bg-[#5d707f]/20 rounded-full px-2.5 py-1 border border-[#5d707f]/40 shrink-0">
                <Zap className="w-2.5 h-2.5 text-[#f97316]" />
                <span className="font-mono text-[10px] text-[var(--brand-slate-light)] tracking-wider hidden sm:inline">Groq</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-1">
                <button type="button" disabled title="Voice input coming soon" className="p-2 sm:p-1.5 rounded-lg min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 flex items-center justify-center text-[var(--brand-slate-light)] opacity-60 cursor-not-allowed" aria-label="Voice input (coming soon)">
                  <Mic className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button type="button" onClick={onClear} className="p-2 sm:p-1.5 hover:bg-[#5d707f]/30 rounded-lg min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 flex items-center justify-center text-[var(--brand-slate-light)] hover:text-[#f97316] transition-colors touch-manipulation" aria-label="Clear and start new question">
                  <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={() => handleSearch()}
                  disabled={isTyping}
                  className="font-mono bg-[#f97316] text-white px-5 py-3 sm:py-1.5 rounded-lg text-[12px] sm:text-[11px] min-h-[44px] min-w-[80px] sm:min-w-0 flex items-center justify-center gap-2 hover:bg-[#ea580c] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-[#f97316]/20 touch-manipulation"
                >
                  {isTyping ? "Processing" : "Run"}
                  {isTyping ? (
                    <span className="w-4 h-4 sm:w-3.5 sm:h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {(aiResponse || isTyping) && (
          <div className="mt-4 p-5 rounded-xl opacity-0 animate-fade-in-down [animation-fill-mode:forwards] shadow-xl relative bg-[var(--brand-bg)] border border-[#5d707f]/40">
            <div className="absolute top-2 right-4 font-mono text-[10px] text-[var(--brand-slate-light)]">Response Context</div>
            <div className="flex gap-4">
              <div className="w-7 h-7 shrink-0 bg-[#f97316] rounded flex items-center justify-center text-[9px] font-black text-white shadow-lg">✓</div>
              <div className="flex-1" aria-live="polite" aria-atomic="true">
                {isTyping ? (
                  <div className="flex gap-1.5 items-center h-7">
                    <span className="w-2 h-2 bg-[#f97316] rounded-full animate-typing-dot [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-[#f97316] rounded-full animate-typing-dot [animation-delay:200ms]" />
                    <span className="w-2 h-2 bg-[#f97316] rounded-full animate-typing-dot [animation-delay:400ms]" />
                  </div>
                ) : (
                  <>
                    <p className="font-mono text-[#ecebf3] text-[13px] leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                    {chatError && (
                      <div className="mt-3">
                        {chatErrorMessage && <p className="font-mono text-[11px] text-[var(--brand-slate-light)] mb-1">({chatErrorMessage})</p>}
                        <button
                          onClick={() => handleSearch(query)}
                          className="text-[12px] text-[#f97316] hover:text-[#ea580c] underline"
                        >
                          Retry API
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:300ms]">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-mono text-[10px] text-[var(--brand-slate-light)] tracking-wide">Suggested Prompts</h3>
          <div className="h-px flex-1 bg-[#5d707f]/40"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CAPABILITIES.map((cap, i) => (
            <button
              key={i}
              onClick={() => { setQuery(cap.prompt); handleSearch(cap.prompt); }}
              className="p-3 sm:p-3.5 rounded-xl bg-[#5d707f]/10 border border-[#5d707f]/40 hover:border-[#f97316]/50 hover:shadow-lg hover:shadow-[#f97316]/10 active:scale-[0.98] sm:hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group text-left opacity-0 animate-fade-in-up [animation-fill-mode:forwards] min-h-[72px] sm:min-h-0 touch-manipulation"
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <div className="mb-2 group-hover:scale-110 transition-transform opacity-80">
                {React.cloneElement(cap.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4 text-[#f97316]' })}
              </div>
              <h4 className="font-mono font-medium mb-1 text-[#ecebf3] text-[10px] tracking-wide">{cap.title}</h4>
              <p className="font-mono text-[10px] text-[var(--brand-slate-light)] leading-snug line-clamp-2">{cap.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
