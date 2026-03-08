import { ChevronLeft, FileDown, Moon, Settings, Snowflake, Sun } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
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
    ? 'fixed inset-y-0 left-0 w-64 max-w-[85vw] z-50 flex flex-col border-r border-border overflow-y-auto bg-background shadow-xl animate-slide-in-left'
    : `${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out flex flex-col border-r border-border overflow-hidden z-20 bg-background`;
  return (
    <aside className={asideClass}>
      <div className="p-5 flex flex-col items-center text-center border-b border-border relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3"
          onClick={() => setSidebarOpen(false)}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
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
            <Button
              key={link.label}
              variant="ghost"
              size="icon"
              asChild
              className="h-auto w-auto p-1.5"
            >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={link.label}
            >
              {React.cloneElement(link.icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
            </a>
            </Button>
          ))}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] text-muted-foreground tracking-wide px-3 mb-2 uppercase">Workspace</div>
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-2.5 px-3 py-1.5 h-auto text-xs font-normal ${
              activeTab === item.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="opacity-70">
              {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="mt-auto p-3 space-y-1 border-t border-border">
        <Button
          variant={isSnowing ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-2.5 text-[11px] px-3 py-1.5 h-auto font-normal ${
            isSnowing ? 'bg-primary/20 text-primary border border-primary/40' : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setIsSnowing(!isSnowing)}
        >
          <Snowflake className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{isSnowing ? 'Stop Snow' : 'Let It Snow'}</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-xs px-3 py-1.5 h-auto font-normal text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="whitespace-nowrap">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-xs px-3 py-1.5 h-auto font-normal text-muted-foreground hover:text-foreground"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Settings</span>
        </Button>
      </div>
    </aside>
  );
};
