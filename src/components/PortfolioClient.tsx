'use client';

import { ArrowUp, Mic, RotateCcw, Settings, ShieldCheck, X } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDeployedAnalytics } from '../hooks/useDeployedAnalytics';
import { useLenis } from '../hooks/useLenis';
import { useMinWidth } from '../hooks/useMinWidth';
import { useOnline } from '../hooks/useOnline';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { queryPortfolio } from '../services/chat';
import { ChatErrorBoundary } from './ChatErrorBoundary';
import { Header } from './Header';
import { StartTabPlaceholder } from './StartTabPlaceholder';
import EducationPanel from './portfolio-tabs/EducationPanel';
import { TabPanelSkeleton } from './portfolio-tabs/TabPanelSkeleton';
import { TabPanelLayout } from './TabPanelLayout';

const ThreeScene = dynamic(
  () => import('./ThreeScene').then((m) => ({ default: m.ThreeScene })),
  { ssr: false, loading: () => null }
);
const Snowfall = dynamic(
  () => import('./Snowfall').then((m) => ({ default: m.Snowfall })),
  { ssr: false, loading: () => null }
);
const Analytics = dynamic(() => import('@vercel/analytics/react').then((m) => m.Analytics), {
  ssr: false,
});
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/react').then((m) => m.SpeedInsights),
  { ssr: false }
);

const SearchTerminal = dynamic(
  () => import('./SearchTerminal').then((m) => ({ default: m.SearchTerminal })),
  { ssr: false, loading: () => <StartTabPlaceholder /> }
);

const AboutPanel = dynamic(() => import('./portfolio-tabs/AboutPanel'), {
  loading: () => <TabPanelSkeleton />,
});
const ProjectsPanel = dynamic(() => import('./portfolio-tabs/ProjectsPanel'), {
  loading: () => <TabPanelSkeleton />,
});
const ExperiencePanel = dynamic(() => import('./portfolio-tabs/ExperiencePanel'), {
  loading: () => <TabPanelSkeleton />,
});
const FaqPanel = dynamic(() => import('./portfolio-tabs/FaqPanel'), {
  loading: () => <TabPanelSkeleton />,
});
const ContactPanel = dynamic(() => import('./portfolio-tabs/ContactPanel'), {
  loading: () => <TabPanelSkeleton />,
});
const FunBuildsPanel = dynamic(() => import('./portfolio-tabs/FunBuildsPanel'), {
  loading: () => <TabPanelSkeleton />,
});

const TAB_IDS = ['start', 'about', 'projects', 'fun', 'experience', 'education', 'faq', 'contact'];

export default function PortfolioClient() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('start');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [chatError, setChatError] = useState(false);
  const [chatErrorMessage, setChatErrorMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
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
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const online = useOnline();
  const reducedMotion = useReducedMotion();
  /** Skip WebGL / heavy particles on narrow viewports (major mobile LCP & TBT win). */
  const allowHeavyVisuals = useMinWidth(768);
  const showVercelInsights = useDeployedAnalytics();
  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis(scrollRef);

  useEffect(() => {
    requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      lenisRef.current?.resize();
    });
  }, [activeTab, lenisRef]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || contactSending) return;
    setContactSending(true);
    setContactError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactStep(1);
      } else {
        setContactError(data?.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setContactError('Network error. Please check your connection and try again.');
    } finally {
      setContactSending(false);
    }
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

  // GSAP only on desktop — keeps ~50kb+ off the mobile critical path (TBT / parse time).
  useEffect(() => {
    if (!allowHeavyVisuals || !sectionRef.current) return;
    let cancelled = false;
    const run = async () => {
      const { default: gsap } = await import('gsap');
      if (cancelled || !sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.bento-animate');
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
      );
    };
    const id = requestAnimationFrame(() => {
      void run();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [activeTab, allowHeavyVisuals]);

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
      if (e.key === '/') { e.preventDefault(); setActiveTab('start'); return; }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= TAB_IDS.length) { e.preventDefault(); setActiveTab(TAB_IDS[num - 1]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /** Snow is CSS-only; do not tie to desktop-only `allowHeavyVisuals` (was blocking tablets/phones). */
  const showSnow = isSnowing && !reducedMotion;
  const isDark = theme === 'dark';

  return (
    <div
      className="flex flex-col h-dvh min-h-0 overflow-hidden relative selection:bg-[rgba(249,115,22,0.2)] selection:text-inherit"
      style={{ backgroundColor: isDark ? '#0f1117' : '#f4f6f9', color: isDark ? '#ecebf3' : '#1a1d24' }}
    >
      {allowHeavyVisuals && !reducedMotion ? <ThreeScene /> : null}
      {showSnow && <Snowfall theme={theme} />}

      {/* Settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          role="presentation"
          onClick={closeSettings}
        >
          <div
            ref={settingsModalRef}
            className="rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in overflow-hidden"
            style={{
              backgroundColor: isDark ? '#161b22' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(93,112,127,0.25)' : 'rgba(93,112,127,0.15)'}`,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            aria-describedby="settings-description"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${isDark ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.12)'}` }}>
              <div className="flex items-center gap-2">
                <Settings size={16} style={{ color: '#f97316' }} />
                <h3 id="settings-title" className="text-sm font-semibold">Settings</h3>
              </div>
              <Button variant="text" size="small" onClick={closeSettings} aria-label="Close" sx={{ minWidth: 36, minHeight: 36, color: 'text.secondary' }}>
                <X size={16} />
              </Button>
            </div>
            <div className="p-5 space-y-5">
              <p id="settings-description" className="text-xs leading-relaxed -mt-1 mb-1" style={{ color: isDark ? '#b5c1d2' : '#6b7c8d' }}>
                Tune assistant behavior and optional effects. Changes apply immediately.
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium">AI Reasoning Delay</div>
                  <div className="text-xs" style={{ color: isDark ? '#b5c1d2' : '#6b7c8d' }}>Simulated processing time</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={thinkerMode}
                  aria-label="Toggle AI reasoning delay"
                  onClick={() => setThinkerMode(!thinkerMode)}
                  className="w-9 h-5 shrink-0 rounded-full relative transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316]/55 focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{
                    backgroundColor: thinkerMode ? '#f97316' : (isDark ? 'rgba(93,112,127,0.3)' : 'rgba(93,112,127,0.2)'),
                    ...(isDark ? {} : { boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)' }),
                  }}
                >
                  <span className="sr-only">{thinkerMode ? 'On' : 'Off'}</span>
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${thinkerMode ? 'left-[18px]' : 'left-0.5'}`}
                    aria-hidden
                  />
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium">Snow Effect</div>
                  <div className="text-xs" style={{ color: isDark ? '#b5c1d2' : '#6b7c8d' }}>Seasonal particle overlay</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isSnowing}
                  aria-label="Toggle snow effect"
                  onClick={() => setIsSnowing(!isSnowing)}
                  className="w-9 h-5 shrink-0 rounded-full relative transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316]/55 focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{
                    backgroundColor: isSnowing ? '#f97316' : (isDark ? 'rgba(93,112,127,0.3)' : 'rgba(93,112,127,0.2)'),
                    ...(isDark ? {} : { boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.06)' }),
                  }}
                >
                  <span className="sr-only">{isSnowing ? 'On' : 'Off'}</span>
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isSnowing ? 'left-[18px]' : 'left-0.5'}`}
                    aria-hidden
                  />
                </button>
              </div>
            </div>
            <div className="p-3 flex justify-end" style={{ backgroundColor: isDark ? 'rgba(93,112,127,0.08)' : 'rgba(93,112,127,0.05)' }}>
              <Button onClick={closeSettings} variant="contained" size="small">Done</Button>
            </div>
          </div>
        </div>
      )}

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSnowing={isSnowing}
        setIsSnowing={setIsSnowing}
        onOpenSettings={openSettings}
      />

      <main
        id="main-content"
        data-active-tab={activeTab}
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 overflow-hidden z-10 flex flex-col outline-none"
        aria-label="Main content"
      >
        {/* Scrollable content with Lenis smooth scroll */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto lenis lenis-smooth"
          style={{ outline: 'none' }}
        >
          <div
            ref={contentRef}
            className="lenis-content min-h-full flex flex-col justify-start"
            tabIndex={-1}
            style={{ outline: 'none', justifyContent: 'flex-start', alignItems: 'stretch' }}
          >
          <div
            ref={sectionRef}
            className="portfolio-main-column max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col flex-1 justify-start min-h-0"
            style={{ justifyContent: 'flex-start', alignItems: 'stretch' }}
          >

            {/* === START TAB === */}
            {activeTab === 'start' && (
              <TabPanelLayout>
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
              </TabPanelLayout>
            )}

            {activeTab === 'about' && (
              <TabPanelLayout>
                <AboutPanel />
              </TabPanelLayout>
            )}

            {activeTab === 'projects' && (
              <TabPanelLayout>
                <ProjectsPanel />
              </TabPanelLayout>
            )}

            {activeTab === 'fun' && (
              <TabPanelLayout>
                <FunBuildsPanel />
              </TabPanelLayout>
            )}

            {activeTab === 'experience' && (
              <TabPanelLayout>
                <ExperiencePanel />
              </TabPanelLayout>
            )}

            {activeTab === 'education' && (
              <TabPanelLayout>
                <EducationPanel />
              </TabPanelLayout>
            )}

            {activeTab === 'faq' && (
              <TabPanelLayout>
                <FaqPanel />
              </TabPanelLayout>
            )}

            {activeTab === 'contact' && (
              <TabPanelLayout>
                <ContactPanel
                  contactSuccess={contactSuccess}
                  setContactSuccess={setContactSuccess}
                  contactName={contactName}
                  setContactName={setContactName}
                  contactEmail={contactEmail}
                  setContactEmail={setContactEmail}
                  contactMessage={contactMessage}
                  setContactMessage={setContactMessage}
                  contactStep={contactStep}
                  contactSending={contactSending}
                  contactError={contactError}
                  canProceedName={canProceedName}
                  canProceedEmail={canProceedEmail}
                  canSubmit={canSubmit}
                  handleContactSubmit={handleContactSubmit}
                  handleContactNext={handleContactNext}
                  handleContactBack={handleContactBack}
                />
              </TabPanelLayout>
            )}
          </div>
          </div>
        </div>

        {/* Chat input bar — pinned at bottom, outside scroll area */}
        {activeTab === 'start' && (
          <div
            className="shrink-0 px-4 sm:px-6 py-2.5"
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <div className="max-w-xl mx-auto">
              <div
                className="chat-input-wrap rounded-2xl flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 transition-all"
                style={{
                  border: '1px solid var(--input-well-border)',
                  backgroundColor: 'var(--input-well-bg)',
                  backdropFilter: isDark ? 'blur(12px)' : 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.06)',
                }}
              >
                <input
                  placeholder="Ask anything… (Enter)"
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none px-1 py-2 text-sm"
                  style={{ color: 'var(--brand-light)' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  aria-label="Ask a question"
                />
                {(aiResponse || isTyping) && !isTyping && (
                  <IconButton
                    onClick={() => { setQuery(''); setAiResponse(null); setChatError(false); setChatErrorMessage(null); }}
                    size="small"
                    aria-label="Reset chat"
                    sx={{ color: 'text.secondary', '&:hover': { color: '#f97316' } }}
                  >
                    <RotateCcw size={15} />
                  </IconButton>
                )}
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
              <p className="text-center text-[10px] sm:text-xs mt-2 px-2 font-mono tracking-wide opacity-90" style={{ color: 'var(--brand-slate-light)' }}>
                Local + API · rule-based fallback when Groq is offline
              </p>
            </div>
          </div>
        )}

        {/* Footer — pinned at bottom with glass effect */}
        <footer
          className="shrink-0 px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px]"
          style={{
            borderTop: `1px solid ${isDark ? 'rgba(93,112,127,0.15)' : 'rgba(93,112,127,0.1)'}`,
            color: 'var(--brand-slate-light)',
            backgroundColor: isDark ? 'rgba(15,17,23,0.45)' : 'rgba(244,246,249,0.45)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center sm:justify-start">
            <span style={{ color: 'var(--brand-light)', opacity: 0.75 }}>© 2026 Usama Shafique</span>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9px] tracking-wide uppercase opacity-80" style={{ color: 'var(--brand-slate-light)' }}>
              <ShieldCheck size={11} style={{ color: '#f97316', opacity: 0.85 }} />
              system_stable
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center sm:justify-end font-mono text-[9px] sm:text-[10px] tracking-wide">
            <span className="flex items-center gap-1.5 uppercase opacity-90" style={{ color: 'var(--brand-slate-light)' }}>
              <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'animate-pulse' : ''}`} style={{ backgroundColor: isTyping ? '#f97316' : 'rgba(93,112,127,0.55)' }} />
              {isTyping ? 'ai_core_active' : 'idle_wait'}
            </span>
            <span className="flex items-center gap-1.5 uppercase opacity-90" style={{ color: 'var(--brand-slate-light)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: online ? '#22c55e' : '#ef4444' }} />
              {online ? 'online' : 'offline'}
            </span>
            <span className="opacity-50 hidden md:inline" style={{ color: 'var(--brand-slate-light)' }}>
              tls · encrypted
            </span>
          </div>
        </footer>
      </main>

      {showVercelInsights ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </div>
  );
}
