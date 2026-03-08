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
    <div className="flex h-screen overflow-hidden select-none relative text-[14px] font-mono bg-[var(--brand-bg)]">
      <React.Suspense fallback={null}>
        <ThreeScene />
        {showSnow && <Snowfall />}
      </React.Suspense>

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" role="presentation">
          <div ref={settingsModalRef} className="rounded-xl w-full max-w-sm shadow-2xl animate-scale-in overflow-hidden bg-[var(--brand-bg)] border border-[#5d707f]/40" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="p-4 border-b border-[#5d707f]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#f97316]" />
                <h3 id="settings-title" className="font-mono text-sm font-medium text-[#ecebf3] tracking-wide">System parameters</h3>
              </div>
              <button onClick={closeSettings} className="p-1 hover:bg-[#5d707f]/30 rounded transition-all hover:scale-105 active:scale-95" aria-label="Close"><X className="w-4 h-4 text-[var(--brand-slate-light)]" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[11px] font-medium text-[#ecebf3]">AI Reasoning Core</div>
                  <div className="font-mono text-[12px] text-[var(--brand-slate-light)]">Simulated Processing Delay</div>
                </div>
                <button onClick={() => setThinkerMode(!thinkerMode)} className={`w-8 h-4 rounded-full relative transition-colors ${thinkerMode ? 'bg-[#f97316]' : 'bg-[#5d707f]/30'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${thinkerMode ? 'left-4.5' : 'left-0.5'}`} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[11px] font-medium text-[#ecebf3]">Global Atmosphere</div>
                  <div className="font-mono text-[12px] text-[var(--brand-slate-light)]">Seasonal Particle Effects</div>
                </div>
                <button onClick={() => setIsSnowing(!isSnowing)} className={`w-8 h-4 rounded-full relative transition-colors ${isSnowing ? 'bg-[#f97316]' : 'bg-[#5d707f]/30'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isSnowing ? 'left-4.5' : 'left-0.5'}`} /></button>
              </div>
            </div>
            <div className="p-3 bg-[#5d707f]/10 rounded-b-xl flex justify-end">
              <button onClick={closeSettings} className="font-mono px-5 py-1.5 bg-[#f97316] text-white text-[11px] font-medium rounded-lg hover:bg-[#ea580c] transition-colors">Execute</button>
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
            <button onClick={() => setSidebarOpen(true)} className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-[var(--brand-bg)]/95 border border-[#5d707f]/50 rounded-lg hover:bg-[#5d707f]/20 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg touch-manipulation" aria-label="Open menu">
              <Menu className="w-5 h-5 text-[#f97316]" />
            </button>
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
                  <h2 className="font-mono text-lg sm:text-xl font-medium text-[#ecebf3] mb-0.5 sm:mb-1 tracking-wide">Build pipeline</h2>
                  <p className="font-mono text-[10px] sm:text-[12px] text-[var(--brand-slate-light)] break-words-mobile">Technical Prototypes And Production-Grade Applications</p>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-[var(--brand-slate-light)] bg-[#5d707f]/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#5d707f]/40 w-fit shrink-0">
                  Version: Latest
                </div>
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
                 <h2 className="font-mono text-xl font-medium text-[#ecebf3] tracking-wide">Protocol trace</h2>
                 <p className="font-mono text-[12px] text-[var(--brand-slate-light)] mt-1">System Event Log</p>
              </div>

              <div className="relative">
                <div className="absolute left-[32px] sm:left-[48px] top-[20px] bottom-4 w-[1px] border-l border-dashed border-[#5d707f]/50 hidden md:block"></div>
                <div className="relative grid grid-cols-1 gap-5 sm:gap-6 md:gap-12">
                  {EXPERIENCE.map((exp, idx) => (
                    <div key={idx} className="relative flex flex-col md:flex-row md:items-start gap-3 sm:gap-4 md:gap-8">
                      <div className="md:mt-1 z-10 shrink-0 w-20 sm:w-24 flex justify-center md:justify-center">
                        <SignalNode />
                      </div>
                      <div className="flex-1 min-w-0 bg-[#5d707f]/10 border border-[#5d707f]/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:border-[#f97316]/50 hover:shadow-xl hover:shadow-[#f97316]/10 transition-all duration-300 group shadow-xl">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex gap-3 sm:gap-4 min-w-0">
                            <div className="p-2 sm:p-2.5 bg-[#5d707f]/20 rounded-lg sm:rounded-xl border border-[#5d707f]/40 group-hover:border-[#f97316]/50 transition-colors shrink-0">
                              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f97316]" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-mono text-sm font-medium text-[#ecebf3] tracking-tight break-words-mobile">{exp.role}</h3>
                              <p className="font-mono text-[#f97316] text-[10px] sm:text-[11px] break-words-mobile">{exp.company}</p>
                            </div>
                          </div>
                          <div className="font-mono inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-[#f97316] bg-[#f97316]/20 px-3 sm:px-4 py-1.5 rounded-full border border-[#f97316]/30 shrink-0">
                            <Activity className="w-3 h-3 animate-pulse shrink-0" />
                            <span className="whitespace-nowrap">{exp.period}</span>
                          </div>
                        </div>
                        <ul className="space-y-2 sm:space-y-3 pl-1">
                          {exp.highlights.map((bullet, i) => (
                            <li key={i} className="font-mono text-[var(--brand-slate-light)] text-[11px] flex gap-2 sm:gap-3 leading-relaxed break-words-mobile">
                              <span className="text-[#f97316] opacity-80">::</span>{bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] max-w-2xl mx-auto w-full px-1 sm:px-0">
              <h2 className="font-mono text-xl font-medium text-[#ecebf3] mb-5 sm:mb-10 tracking-tight text-center">Academic logs</h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-5">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#5d707f]/10 border border-[#5d707f]/40 hover:border-[#f97316]/50 hover:shadow-xl hover:shadow-[#f97316]/10 transition-all duration-300 group relative opacity-0 animate-fade-in-up [animation-fill-mode:forwards] min-w-0" style={{ animationDelay: `${(idx + 1) * 80}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
                        <h3 className="font-mono text-sm font-medium text-[#ecebf3] group-hover:text-[#f97316] transition-colors tracking-tight break-words-mobile">{edu.degree}</h3>
                        <span className={`font-mono inline-block w-fit max-w-full px-4 sm:px-5 py-1 sm:py-1.5 rounded-full border text-[9px] sm:text-[10px] break-words-mobile ${edu.badge ? 'text-[#f97316] bg-[#f97316]/20 border-[#f97316]/30' : 'text-[var(--brand-slate-light)] bg-[#5d707f]/20 border-[#5d707f]/40'}`}>{edu.institution}</span>
                      </div>
                      {edu.badge && (
                        <span className="font-mono text-[9px] sm:text-[10px] text-[#f97316] bg-[#f97316]/15 border border-[#f97316]/40 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md whitespace-nowrap shrink-0 self-start">{edu.badge}</span>
                      )}
                    </div>
                    <p className="font-mono text-[var(--brand-slate-light)] text-[11px]">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] max-w-2xl mx-auto w-full px-1 sm:px-0">
              <h2 className="font-mono text-xl font-medium text-[#ecebf3] mb-5 sm:mb-8 tracking-tight text-center">Terminal FAQ</h2>
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {FAQ_ITEMS.map((faq, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#5d707f]/10 border border-[#5d707f]/40 hover:border-[#f97316]/50 transition-all duration-300 group opacity-0 animate-fade-in-up [animation-fill-mode:forwards] cursor-default min-w-0" style={{ animationDelay: `${(i + 1) * 60}ms` }}>
                    <div className="flex items-start gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                       <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f97316]/80 mt-0.5 shrink-0" />
                       <h3 className="font-mono text-[13px] sm:text-[14px] font-medium text-[#ecebf3] group-hover:text-[#f97316] transition-colors break-words-mobile">{faq.question}</h3>
                    </div>
                    <p className="font-mono text-[var(--brand-slate-light)] leading-relaxed text-[11px] pl-6 sm:pl-7 break-words-mobile">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards] flex-1 flex flex-col justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-2 sm:px-0">
              <div className="max-w-lg mx-auto w-full min-w-0">
                <form onSubmit={handleContactSubmit} className="relative">
                  <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--brand-bg)]/95 border border-[#5d707f]/25 shadow-xl shadow-black/10">
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#f97316]/5 pointer-events-none" aria-hidden />
                    <div className="relative p-5 sm:p-8 md:p-12 pb-5 sm:pb-6">
                      {CONTACT_STEPS.map((step, i) => {
                        const isActive = contactStep === i + 1;
                        if (!isActive) return null;
                        const isTextarea = step.id === 'message';
                        return (
                          <div key={step.id} className="space-y-6 animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                            <label htmlFor={`contact-${step.id}`} className="block font-mono text-sm text-[#ecebf3] tracking-wide">
                              {step.label}
                            </label>
                            {isTextarea ? (
                              <textarea
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
                                className="font-mono w-full bg-[#5d707f]/10 border border-[#5d707f]/40 rounded-xl px-4 py-3 text-[16px] sm:text-[14px] text-[#ecebf3] placeholder:text-[var(--brand-slate-light)] focus:border-[#f97316]/60 focus:ring-2 focus:ring-[#f97316]/30 outline-none resize-none min-h-[120px] sm:min-h-[140px] transition-all leading-relaxed"
                              />
                            ) : (
                              <input
                                id={`contact-${step.id}`}
                                type={step.id === 'email' ? 'email' : 'text'}
                                placeholder={step.placeholder}
                                value={step.value}
                                onChange={(e) => step.setValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleContactNext()}
                                className="font-mono w-full bg-[#5d707f]/10 border border-[#5d707f]/40 rounded-xl h-12 min-h-[44px] px-4 text-[16px] sm:text-[14px] text-[#ecebf3] placeholder:text-[var(--brand-slate-light)] focus:border-[#f97316]/60 focus:ring-2 focus:ring-[#f97316]/30 outline-none transition-all"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="relative px-4 sm:px-8 md:px-12 py-5 sm:py-6 pb-6 sm:pb-8 flex items-center justify-between gap-3 sm:gap-4 border-t border-[#5d707f]/20">
                      <button type="button" onClick={handleContactBack} className={`font-mono text-[12px] text-[var(--brand-slate-light)] hover:text-[#ecebf3] transition-colors min-h-[44px] flex items-center touch-manipulation ${contactStep === 1 ? 'invisible' : ''}`}>
                        Back
                      </button>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((n) => (
                          <span key={n} className={`w-1.5 h-1.5 rounded-full transition-colors ${contactStep >= n ? 'bg-[#f97316]' : 'bg-[#5d707f]/50'}`} />
                        ))}
                      </div>
                      {contactStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleContactNext}
                          disabled={(contactStep === 1 && !canProceedName) || (contactStep === 2 && !canProceedEmail)}
                          className="font-mono bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] min-h-[44px] px-6 rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
                        >
                          Next
                        </button>
                      ) : (
                        <button type="submit" disabled={!canSubmit} className="font-mono bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] min-h-[44px] px-6 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] touch-manipulation" aria-label="Send message">
                          Send <Send className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
                <p className="mt-4 sm:mt-5 pt-4 sm:pt-5 text-center font-mono text-[11px] sm:text-[12px] text-[var(--brand-slate-light)] break-words-mobile px-1">
                  <span className="opacity-90">Opens Your Email Client</span>
                  <span className="mx-2 opacity-50">·</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#f97316] hover:text-[#fbbf24] transition-colors">{CONTACT_EMAIL}</a>
                </p>
              </div>
            </div>
          )}
        </div>

          {/* Global Footer Status Bar - compact on mobile */}
          <div className="footer-status-bar p-2.5 sm:p-3 border-t border-[#5d707f]/40 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2 text-[10px] sm:text-[12px] text-[var(--brand-slate-light)] bg-[var(--brand-bg)]/95 backdrop-blur-xl sticky bottom-0 z-20 font-mono">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-5 flex-wrap">
            <span className="text-[#ecebf3]/80">© 2025 Usama_Studio</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#f97316]/70" /> System_Stable</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-5 flex-wrap">
            <span className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-[#f97316] animate-pulse' : 'bg-[#5d707f]/60'}`}></div>
               {isTyping ? 'AI_Core_Active' : 'Idle_Wait'}
            </span>
            <span className="bg-[#5d707f]/20 px-2.5 py-0.5 rounded-lg border border-[#5d707f]/40 text-[#f97316] text-[9px]">
              {online ? 'Connection: Encrypted' : 'Offline'}
            </span>
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
