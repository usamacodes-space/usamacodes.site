import { FileDown, Moon, Sun } from 'lucide-react';
import React from 'react';
import { NAV_ITEMS, RESUME_URL } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SHORT_LABELS: Record<string, string> = {
  start: 'Start',
  projects: 'Projects',
  experience: 'Exp',
  education: 'Edu',
  faq: 'FAQ',
  contact: 'Contact',
};

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItemClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center gap-1 flex-1 min-w-0 min-h-[48px] py-2.5 px-2 rounded-xl transition-all duration-200 active:scale-95 touch-manipulation ${
      isActive
        ? 'text-[#f97316] bg-[#f97316]/10'
        : 'text-[var(--brand-slate-light)] hover:bg-[#5d707f]/10'
    }`;

  const row1Items = NAV_ITEMS.slice(0, 4);
  const row2Items = NAV_ITEMS.slice(4);

  const renderNavButton = (item: (typeof NAV_ITEMS)[0]) => (
    <button
      key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={navItemClass(activeTab === item.id)}
      aria-current={activeTab === item.id ? 'page' : undefined}
      aria-label={item.label}
    >
      <span className="shrink-0">{React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}</span>
      <span className="font-mono text-[10px] font-medium truncate w-full text-center max-w-[64px]">{SHORT_LABELS[item.id] ?? item.label}</span>
    </button>
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--brand-bg)]/95 backdrop-blur-xl border-t border-[#5d707f]/30 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)] flex flex-col gap-1 py-3 px-3 min-h-[108px]"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-label="Mobile navigation"
    >
      <div className="flex w-full gap-1 shrink-0">
        {row1Items.map(renderNavButton)}
      </div>
      <div className="flex w-full gap-1 shrink-0">
        {row2Items.map(renderNavButton)}
        <a
          href={RESUME_URL}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={`${navItemClass(false)} hover:text-[#f97316] hover:bg-[#5d707f]/10`}
          aria-label="Download Resume"
        >
          <FileDown className="w-5 h-5 shrink-0" />
          <span className="font-mono text-[10px] truncate w-full text-center max-w-[64px]">Resume</span>
        </a>
        <button
          onClick={toggleTheme}
          className={`${navItemClass(false)} hover:text-[#f97316] hover:bg-[#5d707f]/10`}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
          <span className="font-mono text-[10px] truncate w-full text-center max-w-[64px]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
};
