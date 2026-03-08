import { ArrowUp, Mic, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  aiResponse,
  isTyping,
  chatError,
  chatErrorMessage,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col min-h-full max-w-3xl mx-auto w-full min-w-0 px-3 sm:px-4 py-5 sm:py-8 box-border relative">
      {/* Subtle dotted grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:radial-gradient(circle,_currentColor_1px,_transparent_1px)] [background-size:20px_20px]" aria-hidden />

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {/* Welcome message */}
        <h1 className="text-center text-2xl sm:text-3xl font-medium text-foreground mb-8 sm:mb-10 opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
          What can I help you with?
        </h1>

        {/* Suggestion cards - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-lg mx-auto w-full">
          {CAPABILITIES.map((cap, i) => (
            <button
              key={i}
              onClick={() => { setQuery(cap.prompt); handleSearch(cap.prompt); }}
              className="rounded-xl border border-border bg-card/80 hover:bg-muted/50 hover:border-primary/40 transition-all duration-200 p-4 sm:p-5 text-left opacity-0 animate-fade-in-up [animation-fill-mode:forwards] min-h-[88px] sm:min-h-[100px] touch-manipulation"
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-0.5">{cap.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">{cap.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Response area (when active) */}
      {(aiResponse || isTyping) && (
        <Card className="mb-4 animate-fade-in-down shadow-xl relative z-10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 shrink-0 bg-primary rounded flex items-center justify-center text-[8px] font-bold text-primary-foreground">✓</div>
              <div className="flex-1 min-w-0" aria-live="polite" aria-atomic="true">
                {isTyping ? (
                  <div className="flex gap-1.5 items-center h-6">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot [animation-delay:200ms]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing-dot [animation-delay:400ms]" />
                  </div>
                ) : (
                  <>
                    <p className="text-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                    {chatError && (
                      <div className="mt-2">
                        {chatErrorMessage && <p className="text-muted-foreground text-[10px] mb-1">({chatErrorMessage})</p>}
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => handleSearch(query)}>
                          Retry
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom input area */}
      <div className="relative z-10 mt-auto pt-4">
        <div className="rounded-xl border border-border bg-muted/30 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" aria-label="Add">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Input
            ref={inputRef}
            placeholder="Ask anything"
            className="flex-1 min-w-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 text-sm sm:text-base placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Ask a question"
          />
          <Button variant="ghost" size="icon" disabled className="opacity-50 shrink-0" aria-label="Voice (coming soon)">
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full"
            onClick={() => handleSearch()}
            disabled={isTyping}
            aria-label="Send"
          >
            {isTyping ? (
              <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-2 px-2">
          Usama AI can provide info about my projects, stack, and experience.
        </p>
      </div>
    </div>
  );
};
