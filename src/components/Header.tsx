import {
  FileDown,
  Menu,
  Moon,
  Settings,
  Snowflake,
  Sun,
  X,
} from 'lucide-react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { NAV_ITEMS, RESUME_URL, SOCIAL_LINKS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSnowing: boolean;
  setIsSnowing: (snowing: boolean) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSnowing,
  setIsSnowing,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          backgroundColor: theme === 'dark' ? 'rgba(15, 17, 23, 0.55)' : 'rgba(244, 246, 249, 0.55)',
          borderBottom: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(93, 112, 127, 0.15)' : 'rgba(93, 112, 127, 0.12)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              sx={{ color: 'text.secondary', display: { xs: 'inline-flex', md: 'none' } }}
            >
              <Menu size={20} />
            </IconButton>
            <button
              onClick={() => handleNav('about')}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-transparent group-hover:border-[#f97316]/50 transition-colors">
                <img
                  src="/avatar.jpg"
                  alt="Usama Shafique"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (!t.src.includes('ui-avatars.com'))
                      t.src = 'https://ui-avatars.com/api/?name=Usama+Shafique&size=64&background=0f1117&color=f97316';
                  }}
                />
              </div>
              <span
                className="font-semibold text-sm tracking-tight hidden sm:inline"
                style={{ color: theme === 'dark' ? '#ecebf3' : '#1a1d24' }}
              >
                Usama Shafique
              </span>
            </button>
          </div>

          {/* Center: nav tabs (desktop) */}
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }} aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors"
                  style={{
                    color: isActive
                      ? '#f97316'
                      : theme === 'dark' ? '#b5c1d2' : '#6b7c8d',
                    backgroundColor: isActive
                      ? (theme === 'dark' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(234, 88, 12, 0.08)')
                      : 'transparent',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </Box>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <IconButton
              onClick={toggleTheme}
              size="small"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              sx={{ color: 'text.secondary' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            <IconButton
              onClick={onOpenSettings}
              size="small"
              aria-label="Settings"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <Settings size={18} />
            </IconButton>
            <Box
              component="a"
              href={RESUME_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                alignItems: 'center',
                gap: '6px',
                px: 1.5,
                py: 0.75,
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#f97316',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(249, 115, 22, 0.06)' },
              }}
            >
              <FileDown size={14} /> Resume
            </Box>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: theme === 'dark' ? '#0f1117' : '#f4f6f9',
            borderRight: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer header */}
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${theme === 'dark' ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.15)'}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="/avatar.jpg"
                  alt="Usama Shafique"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (!t.src.includes('ui-avatars.com'))
                      t.src = 'https://ui-avatars.com/api/?name=Usama+Shafique&size=80&background=0f1117&color=f97316';
                  }}
                />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme === 'dark' ? '#ecebf3' : '#1a1d24' }}>
                  Usama Shafique
                </div>
                <div className="text-[11px]" style={{ color: theme === 'dark' ? '#b5c1d2' : '#6b7c8d' }}>
                  Software Engineer
                </div>
              </div>
            </div>
            <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
              <X size={18} />
            </IconButton>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-0.5" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
                  style={{
                    color: isActive ? '#f97316' : (theme === 'dark' ? '#b5c1d2' : '#4a5568'),
                    backgroundColor: isActive ? (theme === 'dark' ? 'rgba(249,115,22,0.1)' : 'rgba(234,88,12,0.08)') : 'transparent',
                    minHeight: 44,
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="opacity-70">
                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-3 space-y-1" style={{ borderTop: `1px solid ${theme === 'dark' ? 'rgba(93,112,127,0.2)' : 'rgba(93,112,127,0.15)'}` }}>
            <button
              onClick={() => { setIsSnowing(!isSnowing); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{
                color: isSnowing ? '#f97316' : (theme === 'dark' ? '#b5c1d2' : '#4a5568'),
                backgroundColor: isSnowing ? (theme === 'dark' ? 'rgba(249,115,22,0.1)' : 'rgba(234,88,12,0.08)') : 'transparent',
                minHeight: 44,
              }}
            >
              <Snowflake size={16} className="opacity-70" />
              {isSnowing ? 'Stop Snow' : 'Let It Snow'}
            </button>
            <button
              onClick={() => { toggleTheme(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: theme === 'dark' ? '#b5c1d2' : '#4a5568', minHeight: 44 }}
            >
              {theme === 'dark' ? <Sun size={16} className="opacity-70" /> : <Moon size={16} className="opacity-70" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={() => { onOpenSettings(); setDrawerOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: theme === 'dark' ? '#b5c1d2' : '#4a5568', minHeight: 44 }}
            >
              <Settings size={16} className="opacity-70" />
              Settings
            </button>
            <a
              href={RESUME_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: '#f97316', minHeight: 44 }}
            >
              <FileDown size={16} /> Download Resume
            </a>
            <div className="flex items-center gap-2 pt-3 px-1">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: theme === 'dark' ? '#b5c1d2' : '#4a5568' }}
                >
                  {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                </a>
              ))}
            </div>
          </div>
        </Box>
      </Drawer>
    </>
  );
};
