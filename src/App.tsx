import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Activity,
  Briefcase,
  HelpCircle,
  Menu,
  Send,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ChatErrorBoundary } from './components/ChatErrorBoundary';
import { ProjectCard } from './components/ProjectCard';
import { SearchTerminal } from './components/SearchTerminal';
import { Sidebar } from './components/Sidebar';
import { CONTACT_EMAIL, EDUCATION, EXPERIENCE, FAQ_ITEMS, PROJECTS } from './constants';
import { useLenis } from './hooks/useLenis';
import { useOnline } from './hooks/useOnline';
import { useReducedMotion } from './hooks/useReducedMotion';
import { queryPortfolio } from './services/chat';

const ThreeScene = React.lazy(() => import('./components/ThreeScene').then((m) => ({ default: m.ThreeScene })));
const Snowfall = React.lazy(() => import('./components/Snowfall').then((m) => ({ default: m.Snowfall })));

gsap.registerPlugin(useGSAP);

const SignalNode: React.FC = () => (
  <div className="relative flex items-center justify-center w-8 h-8">
    <div className="absolute w-full h-full border border-[#5d707f]/30 rounded-full border-t-[#f97316]/60 animate-[spin_8s_linear_infinite]"></div>
    <div className="absolute w-[70%] h-[70%] border border-[#5d707f]/40 rounded-full border-b-[#f97316]/50 animate-[spin_4s_linear_infinite_reverse]"></div>
    <div className="absolute w-[40%] h-[40%] border border-[#f97316]/30 rounded-full animate-pulse"></div>
    <div className="relative w-1.5 h-1.5 bg-[#f97316] rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)] z-10">
      <div className="absolute inset-0 bg-[#f97316] rounded-full animate-ping opacity-30"></div>
    </div>
  </div>
);

const TAB_IDS = ['start', 'projects', 'experience', 'education', 'faq', 'contact'];

const MOBILE_BREAKPOINT = 768;

function getInitialSidebarOpen(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= MOBILE_BREAKPOINT;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('start');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [chatError, setChatError] = useState(false);
  const [chatErrorMessage, setChatErrorMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarOpen);
  const [isSnowing, setIsSnowing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const settingsModalRef = useRef<HTMLDivElement | null>(null);
  const [thinkerMode, setThinkerMode] = useState(false);

  const openSettings = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setShowSettings(true);
  }, []);
  const closeSettings = useCallback(() => {
    setShowSettings(false);
    requestAnimationFrame(() => { previousFocusRef.current?.focus({ preventScroll: true }); });
  }, []);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStep, setContactStep] = useState(1);

  const online = useOnline();
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  const CONTACT_STEPS = [
    { id: 'name', label: "What's Your Name?", value: contactName, setValue: setContactName, placeholder: "Type Your Name..." },
    { id: 'email', label: "What's Your Email?", value: contactEmail, setValue: setContactEmail, placeholder: "Your@Email.com" },
    { id: 'message', label: "What Would You Like To Tell Me?", value: contactMessage, setValue: setContactMessage, placeholder: "Tell Me About Your Project..." },
  ] as const;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${contactName || 'Visitor'}`);
    const body = encodeURIComponent(
      `${contactMessage}\n\n---\nFrom: ${contactName || 'Unknown'} (${contactEmail || 'No email'})`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const canProceedName = contactName.trim().length >= 2;
  const canProceedEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
  const canSubmit = canProceedName && canProceedEmail && contactMessage.trim().length >= 10;

  const handleContactNext = () => {
    if (contactStep === 1 && !canProceedName) return;
    if (contactStep === 2 && !canProceedEmail) return;
    if (contactStep < 3) setContactStep((s) => s + 1);
  };
  const handleContactBack = () => {
    if (contactStep > 1) setContactStep((s) => s - 1);
  };

  const mainRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis(mainRef);
  useEffect(() => {
    requestAnimationFrame(() => lenisRef.current?.resize());
  }, [activeTab, lenisRef]);

  useGSAP(
    () => {
      if (activeTab !== 'projects' || !projectsRef.current) return;
      const cards = projectsRef.current.querySelectorAll('.project-card-wrap');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    },
    { dependencies: [activeTab] }
  );

  const handleSearch = useCallback(async (forcedQuery?: string) => {
    const finalQuery = forcedQuery || query;
    if (!finalQuery.trim()) return;
    setIsTyping(true);
    setAiResponse(null);
    setChatError(false);
    setChatErrorMessage(null);
    if (thinkerMode) await new Promise(r => setTimeout(r, 1000));
    try {
      const result = await queryPortfolio(finalQuery, online);
      setAiResponse(result.text);
      setChatError(result.error ?? false);
      setChatErrorMessage(result.errorMessage ?? null);
    } catch {
      setAiResponse("Something went wrong. Please try again.");
      setChatError(true);
      setChatErrorMessage("Request failed.");
    } finally {
      setIsTyping(false);
    }
  }, [query, thinkerMode, online]);

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
  }, [activeTab]);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSetActiveTab = useCallback((id: string) => {
    setActiveTab(id);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobile, sidebarOpen]);

  useEffect(() => {
    if (!showSettings || !settingsModalRef.current) return;
    const modal = settingsModalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeSettings(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showSettings, closeSettings]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '/') {
        e.preventDefault();
        setActiveTab('start');
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        e.preventDefault();
        setActiveTab(TAB_IDS[num - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showSnow = isSnowing && !reducedMotion;

  return (
    <div className="flex h-screen overflow-hidden select-none relative text-sm bg-background">
      <React.Suspense fallback={null}>
        <ThreeScene />
        {showSnow && <Snowfall />}
      </React.Suspense>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" role="presentation">
          <div ref={settingsModalRef} className="rounded-xl w-full max-w-sm shadow-2xl animate-scale-in overflow-hidden bg-card border border-border" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                <h3 id="settings-title" className="text-sm font-medium text-foreground tracking-wide">System parameters</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={closeSettings} aria-label="Close"><X className="w-4 h-4 text-muted-foreground" /></Button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-foreground">AI Reasoning Core</div>
                  <div className="text-xs text-muted-foreground">Simulated Processing Delay</div>
                </div>
                <button onClick={() => setThinkerMode(!thinkerMode)} className={`w-8 h-4 rounded-full relative transition-colors ${thinkerMode ? 'bg-[#f97316]' : 'bg-[#5d707f]/30'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${thinkerMode ? 'left-4.5' : 'left-0.5'}`} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-foreground">Global Atmosphere</div>
                  <div className="text-xs text-muted-foreground">Seasonal Particle Effects</div>
                </div>
                <button onClick={() => setIsSnowing(!isSnowing)} className={`w-8 h-4 rounded-full relative transition-colors ${isSnowing ? 'bg-[#f97316]' : 'bg-[#5d707f]/30'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isSnowing ? 'left-4.5' : 'left-0.5'}`} /></button>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-b-xl flex justify-end">
              <Button onClick={closeSettings} size="sm">Execute</Button>
            </div>
          </div>
        </div>
      )}

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            isSnowing={isSnowing}
            setIsSnowing={setIsSnowing}
            onOpenSettings={openSettings}
            overlay
          />
        </div>
      )}
      {!isMobile && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSnowing={isSnowing}
          setIsSnowing={setIsSnowing}
          onOpenSettings={openSettings}
        />
      )}

      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 flex flex-col relative overflow-x-hidden overflow-y-auto md:overflow-hidden z-10 lenis lenis-smooth pb-8 md:pb-0" aria-label="Main content">
        <div ref={contentRef} className="lenis-content flex flex-col min-h-full h-max flex-shrink-0" tabIndex={-1}>
          {!sidebarOpen && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 bg-background/95 border-border shadow-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-primary" />
            </Button>
          )}

          <div className={`max-w-4xl mx-auto w-full py-5 sm:py-10 flex flex-col items-center min-h-[calc(100vh-5rem)] md:min-h-full flex-1 ${!sidebarOpen ? 'pl-14 pr-4 sm:pl-16 sm:pr-6 md:pl-8 md:pr-8' : 'px-4 sm:px-6 md:px-8'}`}>
          {activeTab === 'start' && (
            <ChatErrorBoundary onRetry={() => handleSearch(query)}>
              <SearchTerminal
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                onClear={() => { setQuery(''); setAiResponse(null); setChatError(false); setChatErrorMessage(null); }}
                aiResponse={aiResponse}
                isTyping={isTyping}
                chatError={chatError}
                chatErrorMessage={chatErrorMessage}
              />
            </ChatErrorBoundary>
          )}

          {activeTab === 'projects' && (
            <div className="projects-panel w-full min-w-0 px-1 sm:px-0" ref={projectsRef}>
              <div className="grid grid-cols-1 sm:flex sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-10">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-medium text-foreground mb-0.5 sm:mb-1 tracking-wide">Build pipeline</h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground break-words-mobile">Technical Prototypes And Production-Grade Applications</p>
                </div>
                <Badge variant="secondary" className="text-[9px] sm:text-[10px] shrink-0">
                  Version: Latest
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 auto-rows-fr">
                {PROJECTS.map((p, i) => (
                  <div key={i} className="project-card-wrap">
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] max-w-2xl mx-auto w-full px-1 sm:px-0">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                 <h2 className="text-xl font-medium text-foreground tracking-wide">Protocol trace</h2>
                 <p className="text-xs text-muted-foreground mt-1">System Event Log</p>
              </div>

              <div className="relative">
                <div className="absolute left-[32px] sm:left-[48px] top-[20px] bottom-4 w-[1px] border-l border-dashed border-[#5d707f]/50 hidden md:block"></div>
                <div className="relative grid grid-cols-1 gap-5 sm:gap-6 md:gap-12">
                  {EXPERIENCE.map((exp, idx) => (
                    <div key={idx} className="relative flex flex-col md:flex-row md:items-start gap-3 sm:gap-4 md:gap-8">
                      <div className="md:mt-1 z-10 shrink-0 w-20 sm:w-24 flex justify-center md:justify-center">
                        <SignalNode />
                      </div>
                      <Card className="flex-1 min-w-0 p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 group">
                        <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex gap-3 sm:gap-4 min-w-0">
                            <div className="p-2 sm:p-2.5 bg-muted rounded-lg border border-border group-hover:border-primary/50 transition-colors shrink-0">
                              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-medium text-foreground tracking-tight break-words-mobile">{exp.role}</h3>
                              <p className="text-primary text-[10px] sm:text-[11px] break-words-mobile">{exp.company}</p>
                            </div>
                          </div>
                          <Badge variant="accent" className="shrink-0 text-[10px] sm:text-[11px]">
                            <Activity className="w-3 h-3 animate-pulse shrink-0" />
                            <span className="whitespace-nowrap">{exp.period}</span>
                          </Badge>
                        </div>
                        <ul className="space-y-2 sm:space-y-3 pl-1">
                          {exp.highlights.map((bullet, i) => (
                            <li key={i} className="text-muted-foreground text-[11px] flex gap-2 sm:gap-3 leading-relaxed break-words-mobile">
                              <span className="text-primary opacity-80">::</span>{bullet}
                            </li>
                          ))}
                        </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] max-w-2xl mx-auto w-full px-1 sm:px-0">
              <h2 className="text-xl font-medium text-foreground mb-5 sm:mb-10 tracking-tight text-center">Academic logs</h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-5">
                {EDUCATION.map((edu, idx) => (
                  <Card key={idx} className="p-4 sm:p-6 hover:border-primary/50 transition-all duration-300 group opacity-0 animate-fade-in-up [animation-fill-mode:forwards] min-w-0" style={{ animationDelay: `${(idx + 1) * 80}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight break-words-mobile">{edu.degree}</h3>
                        <Badge variant={edu.badge ? 'accent' : 'secondary'} className="w-fit text-[9px] sm:text-[10px]">
                          {edu.institution}
                        </Badge>
                      </div>
                      {edu.badge && (
                        <Badge variant="outline" className="text-[9px] sm:text-[10px] text-primary shrink-0 self-start">
                          {edu.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-[11px]">{edu.period}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] max-w-2xl mx-auto w-full px-1 sm:px-0">
              <h2 className="text-xl font-medium text-foreground mb-5 sm:mb-8 tracking-tight text-center">Terminal FAQ</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQ_ITEMS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 bg-card data-[state=open]:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-[13px] sm:text-sm font-medium">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed pl-6 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] flex-1 flex flex-col justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-2 sm:px-0">
              <div className="max-w-lg mx-auto w-full min-w-0">
                <form onSubmit={handleContactSubmit} className="relative">
                  <Card className="overflow-hidden shadow-xl">
                    <CardContent className="relative p-5 sm:p-8 md:p-12 pb-5 sm:pb-6">
                      {CONTACT_STEPS.map((step, i) => {
                        const isActive = contactStep === i + 1;
                        if (!isActive) return null;
                        const isTextarea = step.id === 'message';
                        return (
                          <div key={step.id} className="space-y-6 animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                            <label htmlFor={`contact-${step.id}`} className="block text-sm text-foreground tracking-wide">
                              {step.label}
                            </label>
                            {isTextarea ? (
                              <Textarea
                                id={`contact-${step.id}`}
                                placeholder={step.placeholder}
                                value={step.value}
                                onChange={(e) => step.setValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (contactStep < 3) handleContactNext();
                                    else (e.target as HTMLElement).closest('form')?.requestSubmit();
                                  }
                                }}
                                className="min-h-[120px] sm:min-h-[140px] text-base sm:text-sm"
                              />
                            ) : (
                              <Input
                                id={`contact-${step.id}`}
                                type={step.id === 'email' ? 'email' : 'text'}
                                placeholder={step.placeholder}
                                value={step.value}
                                onChange={(e) => step.setValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleContactNext()}
                                className="h-12 min-h-[44px] text-base sm:text-sm"
                              />
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                    <div className="relative px-4 sm:px-8 md:px-12 py-5 sm:py-6 pb-6 sm:pb-8 flex items-center justify-between gap-3 sm:gap-4 border-t border-border">
                      <Button variant="ghost" size="sm" onClick={handleContactBack} className={`min-h-[44px] ${contactStep === 1 ? 'invisible' : ''}`}>
                        Back
                      </Button>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((n) => (
                          <span key={n} className={`w-1.5 h-1.5 rounded-full transition-colors ${contactStep >= n ? 'bg-primary' : 'bg-muted-foreground/50'}`} />
                        ))}
                      </div>
                      {contactStep < 3 ? (
                        <Button
                          type="button"
                          onClick={handleContactNext}
                          disabled={(contactStep === 1 && !canProceedName) || (contactStep === 2 && !canProceedEmail)}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" disabled={!canSubmit} aria-label="Send message">
                          Send <Send className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </form>
                <p className="mt-4 sm:mt-5 pt-4 sm:pt-5 text-center text-[11px] sm:text-xs text-muted-foreground break-words-mobile px-1">
                  <span className="opacity-90">Opens Your Email Client</span>
                  <span className="mx-2 opacity-50">·</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-primary/90 transition-colors">{CONTACT_EMAIL}</a>
                </p>
              </div>
            </div>
          )}
        </div>

          {/* Global Footer Status Bar - compact on mobile */}
          <div className="footer-status-bar p-2.5 sm:p-3 border-t border-border flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground bg-background/95 backdrop-blur-xl sticky bottom-0 z-20">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-5 flex-wrap">
            <span className="text-foreground/80">© 2025 Usama_Studio</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary/70" /> System_Stable</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-5 flex-wrap">
            <span className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-primary animate-pulse' : 'bg-muted-foreground/60'}`}></div>
               {isTyping ? 'AI_Core_Active' : 'Idle_Wait'}
            </span>
            <Badge variant="outline" className="text-[9px] px-2.5 py-0">
              {online ? 'Connection: Encrypted' : 'Offline'}
            </Badge>
          </div>
          </div>
        </div>
      </main>

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
