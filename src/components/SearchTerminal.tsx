import { ArrowRight, Mic, RotateCcw, Sparkles, Zap } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
  onClear,
  aiResponse,
  isTyping,
  chatError,
  chatErrorMessage,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full min-w-0 py-5 sm:py-8 px-3 sm:px-1 box-border">
      <div className="text-center mb-4 sm:mb-8 opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
        <h1 className="text-xl sm:text-3xl font-medium text-foreground mb-1.5 sm:mb-2 leading-tight px-1 flex items-center justify-center gap-2">
          Ask Me Anything <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </h1>
        <p className="text-muted-foreground text-xs sm:text-base px-2 sm:px-1">Instant Answers About My Work, Projects, And Experience</p>
      </div>

      <Card className="mb-6 sm:mb-10 border-border/60 shadow-xl focus-within:ring-2 focus-within:ring-primary/30 transition-all overflow-hidden">
        <CardContent className="p-0">
          <Input
            ref={inputRef}
            placeholder="Ask about my work, projects or experience..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-xl rounded-b-none px-4 py-3.5 sm:py-3 text-base sm:text-sm h-auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="Ask a question about Usama"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-t border-border/60">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Zap className="w-2.5 h-2.5 text-primary" />
              <span className="hidden sm:inline">Groq</span>
            </Badge>
            <div className="grid grid-cols-[auto_auto_1fr] sm:flex gap-2">
              <Button variant="ghost" size="icon" disabled className="opacity-60" aria-label="Voice (coming soon)">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button onClick={() => handleSearch()} disabled={isTyping} className="flex-1 sm:flex-initial">
                {isTyping ? (
                  <>
                    Processing
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    Run <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

        {(aiResponse || isTyping) && (
          <Card className="mt-4 animate-fade-in-down shadow-xl">
            <div className="p-4 pb-0">
              <span className="text-xs text-muted-foreground">Response Context</span>
            </div>
            <div className="flex gap-4 p-4 pt-2">
              <div className="w-7 h-7 shrink-0 bg-primary rounded flex items-center justify-center text-[9px] font-black text-primary-foreground shadow-lg">✓</div>
              <div className="flex-1 min-w-0" aria-live="polite" aria-atomic="true">
                {isTyping ? (
                  <div className="flex gap-1.5 items-center h-7">
                    <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot [animation-delay:200ms]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-typing-dot [animation-delay:400ms]" />
                  </div>
                ) : (
                  <>
                    <p className="text-foreground text-[13px] leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                    {chatError && (
                      <div className="mt-3">
                        {chatErrorMessage && <p className="text-muted-foreground text-[11px] mb-1">({chatErrorMessage})</p>}
                        <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => handleSearch(query)}>
                          Retry API
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

      <div className="opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:300ms]">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <h3 className="text-[10px] text-muted-foreground tracking-wide uppercase">Suggested Prompts</h3>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
          {CAPABILITIES.map((cap, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-auto min-h-[76px] sm:min-h-0 py-3 sm:py-2 flex flex-col items-start justify-start text-left gap-1 hover:border-primary/50 hover:bg-primary/5 transition-all opacity-0 animate-fade-in-up [animation-fill-mode:forwards]"
              style={{ animationDelay: `${400 + i * 80}ms` }}
              onClick={() => { setQuery(cap.prompt); handleSearch(cap.prompt); }}
            >
              <div className="opacity-80">
                {React.cloneElement(cap.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4 text-primary' })}
              </div>
              <span className="font-medium text-[9px] sm:text-[10px]">{cap.title}</span>
              <span className="text-muted-foreground text-[9px] sm:text-[10px] leading-snug line-clamp-2">{cap.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
