import { ChevronLeft, FileDown, Moon, Settings, Snowflake, Sun } from 'lucide-react';
import React from 'react';
import Button from '@mui/material/Button';
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
  overlay?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  isSnowing,
  setIsSnowing,
  onOpenSettings,
  overlay = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const asideClass = overlay
    ? 'fixed inset-y-0 left-0 w-64 max-w-[85vw] z-50 flex flex-col border-r overflow-y-auto shadow-xl animate-slide-in-left'
    : `${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out flex flex-col border-r border-border overflow-hidden z-20 bg-background`;
  return (
    <aside className={asideClass} style={{ backgroundColor: '#0f1117', borderColor: 'rgba(93,112,127,0.4)' }}>
      <div className="p-5 flex flex-col items-center text-center border-b relative" style={{ borderColor: 'rgba(93,112,127,0.4)' }}>
        <Button
          variant="text"
          size="small"
          className="absolute top-3 right-3"
          onClick={() => setSidebarOpen(false)}
          aria-label="Collapse sidebar"
          sx={{ minWidth: 36, minHeight: 36 }}
        >
          <ChevronLeft className="w-4 h-4" style={{ color: '#b5c1d2' }} />
        </Button>

        <div className="relative mb-3 group mt-2">
          <div className="w-16 h-16 rounded-full border border-border overflow-hidden bg-muted shadow-md relative z-10 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
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
            className="absolute top-1 left-1 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full z-20 animate-live-pulse cursor-default group-hover:scale-125 group-hover:animate-none group-hover:ring-2 group-hover:ring-primary/60 transition-transform duration-300"
            title="Available"
          />
          <div className="absolute inset-0 rounded-full bg-[#f97316]/5 blur-lg group-hover:bg-[#f97316]/10 transition-all"></div>
        </div>

        <h2 className="text-base font-medium text-foreground mb-0.5 tracking-tight">Usama Shafique</h2>
        <p className="text-muted-foreground text-[11px] mb-2">Software Engineer</p>

        <p className="text-muted-foreground text-[11px] leading-relaxed px-1 mb-3">
          I Build AI-Integrated Systems And Scalable Backends. Focused On RAG Pipelines And Automation.
        </p>

        <a href={RESUME_URL} download target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:text-primary/90 flex items-center gap-1.5 mb-3 transition-colors" aria-label="Download Resume">
          <FileDown className="w-3.5 h-3.5" /> Download Resume
        </a>
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: '#b5c1d2' }}
            >
              {React.cloneElement(link.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
            </a>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] text-muted-foreground tracking-wide px-3 mb-2 uppercase">Workspace</div>
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant="text"
            className="w-full justify-start gap-2.5 px-3 py-1.5 h-auto text-xs font-normal"
            onClick={() => setActiveTab(item.id)}
            sx={{
              justifyContent: 'flex-start',
              color: activeTab === item.id ? '#f97316' : '#b5c1d2',
              bgcolor: activeTab === item.id ? 'rgba(249,115,22,0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(93,112,127,0.2)', color: activeTab === item.id ? '#f97316' : '#ecebf3' },
            }}
          >
            <span className="opacity-70">
              {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="mt-auto p-3 space-y-1 border-t" style={{ borderColor: 'rgba(93,112,127,0.4)' }}>
        <Button
          variant="text"
          className="w-full justify-start gap-2.5 text-[11px] px-3 py-1.5 h-auto font-normal"
          onClick={() => setIsSnowing(!isSnowing)}
          sx={{
            justifyContent: 'flex-start',
            color: isSnowing ? '#f97316' : '#b5c1d2',
            bgcolor: isSnowing ? 'rgba(249,115,22,0.2)' : 'transparent',
            border: isSnowing ? '1px solid rgba(249,115,22,0.4)' : 'none',
            '&:hover': { bgcolor: 'rgba(93,112,127,0.2)', color: isSnowing ? '#f97316' : '#ecebf3' },
          }}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{isSnowing ? 'Stop Snow' : 'Let It Snow'}</span>
        </Button>
        <Button
          variant="text"
          className="w-full justify-start gap-2.5 text-xs px-3 py-1.5 h-auto font-normal"
          onClick={toggleTheme}
          sx={{ justifyContent: 'flex-start', color: '#b5c1d2', '&:hover': { bgcolor: 'rgba(93,112,127,0.2)', color: '#ecebf3' } }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="whitespace-nowrap">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>
        <Button
          variant="text"
          className="w-full justify-start gap-2.5 text-xs px-3 py-1.5 h-auto font-normal"
          onClick={onOpenSettings}
          sx={{ justifyContent: 'flex-start', color: '#b5c1d2', '&:hover': { bgcolor: 'rgba(93,112,127,0.2)', color: '#ecebf3' } }}
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Settings</span>
        </Button>
      </div>
    </aside>
  );
};
