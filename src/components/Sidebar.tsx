import { ChevronLeft, FileDown, Moon, Settings, Snowflake, Sun } from 'lucide-react';
import React from 'react';
import { NAV_ITEMS, RESUME_URL, SOCIAL_LINKS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSnowing: boolean;
  setIsSnowing: (snowing: boolean) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  isSnowing,
  setIsSnowing,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out flex flex-col border-r border-[#5d707f]/40 overflow-hidden z-20 font-mono bg-[var(--brand-bg)]`}>
      <div className="p-5 flex flex-col items-center text-center border-b border-[#5d707f]/40 relative">
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 p-1 hover:bg-[#5d707f]/30 hover:scale-110 active:scale-95 rounded transition-all duration-200"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--brand-slate-light)]" />
        </button>

        <div className="relative mb-3 group mt-2">
          <div className="w-16 h-16 rounded-full border border-[#5d707f]/50 overflow-hidden bg-[#5d707f]/20 shadow-md relative z-10 group-hover:border-[#f97316]/50 group-hover:shadow-lg group-hover:shadow-[#f97316]/10 transition-all duration-300">
            {/* Avatar: use public/avatar.jpg or fallback to generated initials (add avatar.jpg to public/ to override) */}
            <img
              src="/avatar.jpg"
              alt="Usama Shafique"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-90"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('ui-avatars.com')) {
                  target.src = "https://ui-avatars.com/api/?name=Usama+Shafique&size=128&background=0f1117&color=f97316";
                }
              }}
            />
          </div>
          <div
            className="absolute top-1 left-1 w-2.5 h-2.5 bg-[#f97316] border-2 border-[var(--brand-bg)] rounded-full z-20 animate-live-pulse cursor-default group-hover:scale-125 group-hover:animate-none group-hover:ring-2 group-hover:ring-[#f97316]/60 transition-transform duration-300"
            title="Available"
          />
          <div className="absolute inset-0 rounded-full bg-[#f97316]/5 blur-lg group-hover:bg-[#f97316]/10 transition-all"></div>
        </div>

        <h2 className="font-mono text-base font-medium text-[#ecebf3] mb-0.5 tracking-tight">Usama Shafique</h2>
        <p className="font-mono text-[var(--brand-slate-light)] text-[11px] mb-2">Software Engineer</p>

        <p className="font-mono text-[var(--brand-slate-light)] text-[11px] leading-relaxed px-1 mb-3">
          I Build AI-Integrated Systems And Scalable Backends. Focused On RAG Pipelines And Automation.
        </p>

        <a href={RESUME_URL} download target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[#f97316] hover:text-[#ea580c] flex items-center gap-1.5 mb-3" aria-label="Download Resume">
          <FileDown className="w-3.5 h-3.5" /> Download Resume
        </a>
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-[#5d707f]/30 text-[var(--brand-slate-light)] hover:text-[#f97316] hover:scale-110 active:scale-95 transition-all duration-200"
              aria-label={link.label}
            >
              {React.cloneElement(link.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
            </a>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <div className="font-mono text-[10px] text-[var(--brand-slate-light)] tracking-wide px-3 mb-2">Workspace</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-200 ${
              activeTab === item.id ? 'bg-[#f97316]/20 text-[#f97316] font-medium' : 'text-[var(--brand-slate-light)] hover:bg-[#5d707f]/20 hover:text-[#ecebf3] hover:translate-x-0.5'
            }`}
          >
            <span className="opacity-70">
              {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-3 space-y-1 border-t border-[#5d707f]/40">
        <button
          onClick={() => setIsSnowing(!isSnowing)}
          className={`w-full flex items-center gap-2.5 text-[11px] px-3 py-1.5 rounded-lg transition-all duration-200 ${
            isSnowing ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40' : 'text-[var(--brand-slate-light)] hover:bg-[#5d707f]/20 hover:translate-x-0.5'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{isSnowing ? 'Stop Snow' : 'Let It Snow'}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 text-[12px] text-[var(--brand-slate-light)] px-3 py-1.5 hover:bg-[#5d707f]/20 hover:translate-x-0.5 rounded-lg transition-all duration-200"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="whitespace-nowrap">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 text-[12px] text-[var(--brand-slate-light)] px-3 py-1.5 hover:bg-[#5d707f]/20 hover:translate-x-0.5 rounded-lg transition-all duration-200"
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Settings</span>
        </button>
      </div>
    </aside>
  );
};
