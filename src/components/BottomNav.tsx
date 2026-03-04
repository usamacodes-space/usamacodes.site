import { FileDown, Moon, Sun } from 'lucide-react';
import React from 'react';
import { NAV_ITEMS, RESUME_URL } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--brand-bg)]/98 backdrop-blur-xl border-t border-[#5d707f]/40 flex items-stretch py-2 px-2 gap-0 min-h-[56px]"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 rounded-lg transition-all active:scale-95 touch-manipulation ${
            activeTab === item.id ? 'text-[#f97316]' : 'text-[var(--brand-slate-light)]'
          }`}
          aria-current={activeTab === item.id ? 'page' : undefined}
          aria-label={item.label}
        >
          <span className="shrink-0 opacity-80">{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}</span>
          <span className="font-mono text-[9px] sm:text-[10px] font-medium truncate w-full text-center max-w-[52px]">{item.label}</span>
        </button>
      ))}
      <a
        href={RESUME_URL}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 text-[var(--brand-slate-light)] rounded-lg hover:text-[#f97316] transition-all active:scale-95 touch-manipulation"
        aria-label="Download Resume"
      >
        <FileDown className="w-5 h-5 shrink-0 opacity-80" />
        <span className="font-mono text-[9px] sm:text-[10px] truncate w-full text-center max-w-[52px]">Resume</span>
      </a>
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 px-1 text-[var(--brand-slate-light)] rounded-lg hover:text-[#f97316] transition-all active:scale-95 touch-manipulation"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0 opacity-80" /> : <Moon className="w-5 h-5 shrink-0 opacity-80" />}
        <span className="font-mono text-[9px] sm:text-[10px] truncate w-full text-center max-w-[52px]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  );
};
