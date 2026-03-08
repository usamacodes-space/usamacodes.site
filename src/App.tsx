import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Activity,
  ArrowUp,
  Briefcase,
  ChevronRight,
  Code2,
  GraduationCap,
  HelpCircle,
  MapPin,
  Mic,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { BentoCard } from './components/BentoCard';
import { ChatErrorBoundary } from './components/ChatErrorBoundary';
import { Header } from './components/Header';
import { ProjectCard } from './components/ProjectCard';
import { SearchTerminal } from './components/SearchTerminal';
import { CONTACT_EMAIL, EDUCATION, EXPERIENCE, FAQ_ITEMS, PROJECTS, SOCIAL_LINKS } from './constants';
import { useTheme } from './contexts/ThemeContext';
import { useLenis } from './hooks/useLenis';
import { useOnline } from './hooks/useOnline';
import { useReducedMotion } from './hooks/useReducedMotion';
import { queryPortfolio } from './services/chat';

const ThreeScene = React.lazy(() => import('./components/ThreeScene').then((m) => ({ default: m.ThreeScene })));
const Snowfall = React.lazy(() => import('./components/Snowfall').then((m) => ({ default: m.Snowfall })));

gsap.registerPlugin(useGSAP);

const TAB_IDS = ['start', 'about', 'projects', 'experience', 'education', 'faq', 'contact'];

const App: React.FC = () => {
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

  const online = useOnline();
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenisRef = useLenis(scrollRef);

  useEffect(() => {
    requestAnimationFrame(() => {
      lenisRef.current?.scrollTo(0, { immediate: true });
      lenisRef.current?.resize();
    });
  }, [activeTab, lenisRef]);

  const CONTACT_STEPS = [
    { id: 'name', label: "What's your name?", value: contactName, setValue: setContactName, placeholder: "Your name..." },
    { id: 'email', label: "What's your email?", value: contactEmail, setValue: setContactEmail, placeholder: "you@email.com" },
    { id: 'message', label: "Tell me about your project", value: contactMessage, setValue: setContactMessage, placeholder: "I'd like to discuss..." },
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

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const cards = sectionRef.current.querySelectorAll('.bento-animate');
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }
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
      if (num >= 1 && num <= 7) { e.preventDefault(); setActiveTab(TAB_IDS[num - 1]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showSnow = isSnowing && !reducedMotion;
  const isDark = theme === 'dark';

  return (
    <div
      className="flex flex-col h-screen overflow-hidden select-none relative"
      style={{ backgroundColor: isDark ? '#0f1117' : '#f4f6f9', color: isDark ? '#ecebf3' : '#1a1d24' }}
    >
      <React.Suspense fallback={null}>
        <ThreeScene />
        {showSnow && <Snowfall />}
      </React.Suspense>

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" role="presentation">
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium">AI Reasoning Delay</div>
                  <div className="text-xs" style={{ color: isDark ? '#b5c1d2' : '#6b7c8d' }}>Simulated processing time</div>
                </div>
                <button
                  onClick={() => setThinkerMode(!thinkerMode)}
                  className="w-9 h-5 rounded-full relative transition-colors"
                  style={{ backgroundColor: thinkerMode ? '#f97316' : (isDark ? 'rgba(93,112,127,0.3)' : 'rgba(93,112,127,0.2)') }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${thinkerMode ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium">Snow Effect</div>
                  <div className="text-xs" style={{ color: isDark ? '#b5c1d2' : '#6b7c8d' }}>Seasonal particle overlay</div>
                </div>
                <button
                  onClick={() => setIsSnowing(!isSnowing)}
                  className="w-9 h-5 rounded-full relative transition-colors"
                  style={{ backgroundColor: isSnowing ? '#f97316' : (isDark ? 'rgba(93,112,127,0.3)' : 'rgba(93,112,127,0.2)') }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isSnowing ? 'left-[18px]' : 'left-0.5'}`} />
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
          <div ref={contentRef} className="lenis-content" tabIndex={-1} style={{ outline: 'none' }}>
          <div ref={sectionRef} className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col min-h-full">

            {/* === START TAB === */}
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

            {/* === ABOUT TAB === */}
            {activeTab === 'about' && (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                    About Me
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                    Get to know me and what I do
                  </p>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-min">
                  {/* Profile card */}
                  <BentoCard className="bento-animate md:col-span-2" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2" style={{ borderColor: 'rgba(249, 115, 22, 0.3)' }}>
                        <img
                          src="/avatar.jpg"
                          alt="Usama Shafique"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (!t.src.includes('ui-avatars.com'))
                              t.src = 'https://ui-avatars.com/api/?name=Usama+Shafique&size=128&background=0f1117&color=f97316';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                          Usama Shafique
                        </h3>
                        <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: '#f97316' }}>
                          Backend & AI-Integrated Software Engineer
                        </p>
                        <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--brand-slate-light)' }}>
                          Backend Software Engineer experienced in building AI-integrated Node.js systems using NestJS, PostgreSQL, and Docker. Skilled in developing scalable REST APIs, authentication systems, and real-time features with Socket.io.
                        </p>
                      </div>
                    </div>
                  </BentoCard>

                  {/* Location + Email card */}
                  <BentoCard className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
                        <MapPin size={14} style={{ color: '#f97316' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>Location</h4>
                        <p className="text-[11px]" style={{ color: 'var(--brand-slate-light)' }}>Stoke-on-Trent, UK</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
                        <Send size={14} style={{ color: '#f97316' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>Email</h4>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[11px] hover:underline" style={{ color: '#f97316' }}>{CONTACT_EMAIL}</a>
                      </div>
                    </div>
                  </BentoCard>

                  {/* Skills card */}
                  <BentoCard className="bento-animate md:col-span-2" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
                        <Code2 size={14} style={{ color: '#f97316' }} />
                      </div>
                      <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>Tech Stack</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['NestJS', 'Node.js', 'PostgreSQL', 'Docker', 'Socket.io', 'LangChain', 'FastAPI', 'Ollama', 'Prisma', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Python', 'REST API', 'JWT/RBAC', 'Redis', 'Git'].map((skill) => (
                        <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.65rem', height: 24, bgcolor: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)', color: isDark ? '#e0cfc2' : '#6b4c30', border: '1px solid', borderColor: isDark ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.15)' }} />
                      ))}
                    </div>
                  </BentoCard>

                  {/* Connect card */}
                  <BentoCard className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <h4 className="font-semibold text-xs mb-2.5" style={{ color: 'var(--brand-light)' }}>Connect</h4>
                    <div className="space-y-1.5">
                      {SOCIAL_LINKS.map((link) => (
                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors" style={{ color: isDark ? '#b5c1d2' : '#4a5568', backgroundColor: isDark ? 'rgba(93,112,127,0.06)' : 'rgba(93,112,127,0.04)', border: `1px solid ${isDark ? 'rgba(93,112,127,0.12)' : 'rgba(93,112,127,0.08)'}` }}>
                          <span style={{ color: '#f97316' }}>{React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: 'w-3.5 h-3.5' })}</span>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </BentoCard>

                  {/* Quick facts */}
                  <BentoCard className="bento-animate md:col-span-3" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Experience', value: '2+ Years' },
                        { label: 'Degree', value: 'MSc AI & DS' },
                        { label: 'Focus', value: 'Backend & AI' },
                        { label: 'Availability', value: 'Remote / Hybrid' },
                      ].map((fact) => (
                        <div key={fact.label} className="text-center">
                          <div className="text-sm sm:text-base font-bold" style={{ color: '#f97316' }}>{fact.value}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--brand-slate-light)' }}>{fact.label}</div>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </div>
              </div>
            )}

            {/* === PROJECTS TAB === */}
            {activeTab === 'projects' && (
              <div ref={projectsRef} className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                    Projects
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                    Technical prototypes and production-grade applications
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 auto-rows-min">
                  {PROJECTS.map((p, i) => (
                    <div key={i} className="bento-animate project-card-wrap">
                      <ProjectCard project={p} featured={i === 0} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === EXPERIENCE TAB === */}
            {activeTab === 'experience' && (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                    Experience
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                    Professional journey and key contributions
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-3 sm:gap-4 max-w-3xl auto-rows-min">
                  {EXPERIENCE.map((exp, idx) => (
                    <BentoCard key={idx} className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
                            <Briefcase size={16} style={{ color: '#f97316' }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--brand-light)' }}>{exp.role}</h3>
                            <p className="text-xs font-medium" style={{ color: '#f97316' }}>{exp.company}</p>
                          </div>
                        </div>
                        <Chip icon={<Activity size={10} className="animate-pulse" />} label={exp.period} size="small" sx={{ fontSize: '0.65rem', height: 24, bgcolor: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }} />
                      </div>
                      <ul className="space-y-1.5 pl-1">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex gap-2 text-[11px] sm:text-xs leading-relaxed" style={{ color: 'var(--brand-slate-light)' }}>
                            <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color: '#f97316', opacity: 0.6 }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </BentoCard>
                  ))}
                </div>
              </div>
            )}

            {/* === EDUCATION TAB === */}
            {activeTab === 'education' && (
              <div className="flex-1 flex flex-col items-start justify-center">
                <div className="mb-4 w-full">
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                    Education
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                    Academic background and qualifications
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl w-full">
                  {EDUCATION.map((edu, idx) => (
                    <BentoCard key={idx} className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                      <div className="flex items-start gap-2.5 mb-2.5">
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
                          <GraduationCap size={16} style={{ color: '#f97316' }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm break-words-mobile" style={{ color: 'var(--brand-light)' }}>{edu.degree}</h3>
                          <p className="text-[11px] mt-0.5" style={{ color: '#f97316' }}>{edu.institution}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Chip label={edu.period} size="small" sx={{ fontSize: '0.6rem', height: 22, bgcolor: 'rgba(93,112,127,0.1)', color: 'text.secondary' }} />
                        {edu.badge && (
                          <Chip label={edu.badge} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 22, borderColor: 'rgba(249,115,22,0.3)', color: '#f97316' }} />
                        )}
                      </div>
                    </BentoCard>
                  ))}
                </div>
              </div>
            )}

            {/* === FAQ TAB === */}
            {activeTab === 'faq' && (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                    FAQ
                  </h2>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                    Common questions answered
                  </p>
                </div>
                <div className="flex-1 max-w-3xl space-y-2.5">
                  {FAQ_ITEMS.map((faq, i) => (
                    <Accordion
                      key={i}
                      className="bento-animate"
                      sx={{
                        borderRadius: '12px !important',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(93,112,127,0.18)' : 'rgba(93,112,127,0.12)',
                        backdropFilter: 'blur(16px) saturate(1.4)',
                        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                        bgcolor: 'rgba(93, 112, 127, 0.06)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                        '&:before': { display: 'none' },
                        '&.Mui-expanded': { m: 0 },
                      }}
                      disableGutters
                    >
                      <AccordionSummary
                        expandIcon={<ChevronRight size={14} style={{ color: '#f97316', transition: 'transform 0.2s' }} />}
                        sx={{
                          px: { xs: 2, sm: 2.5 },
                          minHeight: '40px !important',
                          '& .MuiAccordionSummary-content': { my: '8px !important' },
                          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(90deg)' },
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle size={14} style={{ color: '#f97316', flexShrink: 0 }} />
                          <span className="text-xs sm:text-[13px] font-medium">{faq.question}</span>
                        </span>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pb: 2 }}>
                        <p className="text-[11px] sm:text-xs leading-relaxed pl-6" style={{ color: 'var(--brand-slate-light)' }}>
                          {faq.answer}
                        </p>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            )}

            {/* === CONTACT TAB === */}
            {activeTab === 'contact' && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-lg">
                  <div className="mb-4 text-center">
                    <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
                      Get in touch
                    </h2>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
                      Let's discuss your next project
                    </p>
                  </div>

                  <BentoCard hover={false} className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                    <form onSubmit={handleContactSubmit}>
                      {CONTACT_STEPS.map((step, i) => {
                        if (contactStep !== i + 1) return null;
                        const isTextarea = step.id === 'message';
                        return (
                          <div key={step.id} className="space-y-4 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                            <label htmlFor={`contact-${step.id}`} className="block text-sm font-medium" style={{ color: 'var(--brand-light)' }}>
                              {step.label}
                            </label>
                            {isTextarea ? (
                              <TextField
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
                                multiline
                                minRows={3}
                                fullWidth
                                variant="outlined"
                                size="small"
                              />
                            ) : (
                              <TextField
                                id={`contact-${step.id}`}
                                type={step.id === 'email' ? 'email' : 'text'}
                                placeholder={step.placeholder}
                                value={step.value}
                                onChange={(e) => step.setValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleContactNext()}
                                fullWidth
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between gap-3 mt-5 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.12)'}` }}>
                        <Button variant="text" size="small" onClick={handleContactBack} sx={{ visibility: contactStep === 1 ? 'hidden' : 'visible', minHeight: 36 }}>Back</Button>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3].map((n) => (
                            <span key={n} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: contactStep >= n ? '#f97316' : (isDark ? 'rgba(93,112,127,0.4)' : 'rgba(93,112,127,0.25)') }} />
                          ))}
                        </div>
                        {contactStep < 3 ? (
                          <Button variant="contained" size="small" onClick={handleContactNext} disabled={(contactStep === 1 && !canProceedName) || (contactStep === 2 && !canProceedEmail)} sx={{ minHeight: 36 }}>Next</Button>
                        ) : (
                          <Button type="submit" variant="contained" size="small" disabled={!canSubmit} sx={{ minHeight: 36 }}>
                            Send <Send size={14} style={{ marginLeft: 6 }} />
                          </Button>
                        )}
                      </div>
                    </form>
                  </BentoCard>

                  <p className="mt-3 text-center text-[10px] sm:text-xs" style={{ color: 'var(--brand-slate-light)' }}>
                    Opens your email client
                    <span className="mx-2 opacity-40">·</span>
                    <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#f97316' }}>{CONTACT_EMAIL}</a>
                  </p>
                </div>
              </div>
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
                className="rounded-2xl flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 transition-all"
                style={{
                  border: '1px solid rgba(93, 112, 127, 0.25)',
                  backgroundColor: 'rgba(93, 112, 127, 0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <input
                  placeholder="Ask anything..."
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
              <p className="text-center text-[10px] sm:text-xs mt-2 px-2" style={{ color: 'var(--brand-slate-light)' }}>
                AI-powered — ask about my projects, stack, and experience
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
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--brand-light)', opacity: 0.7 }}>© 2025 Usama Shafique</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={11} style={{ color: '#f97316', opacity: 0.7 }} /> Stable
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'animate-pulse' : ''}`} style={{ backgroundColor: isTyping ? '#f97316' : 'rgba(93,112,127,0.5)' }} />
              {isTyping ? 'AI Active' : 'Ready'}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: online ? '#22c55e' : '#ef4444' }} />
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
        </footer>
      </main>

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
