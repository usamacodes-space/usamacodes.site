'use client';

import { Code2, MapPin, Send } from 'lucide-react';
import Chip from '@mui/material/Chip';
import React from 'react';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { AvatarImage } from '@/components/AvatarImage';
import { BentoCard } from '@/components/BentoCard';

export default function AboutPanel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
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
        <BentoCard className="bento-animate md:col-span-2" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2"
              style={{ borderColor: 'rgba(249, 115, 22, 0.3)' }}
            >
              <AvatarImage
                size={80}
                className="w-full h-full object-cover"
                sizes="(max-width: 640px) 64px, 80px"
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
                Backend Software Engineer experienced in building AI-integrated Node.js systems using NestJS, PostgreSQL,
                and Docker. Skilled in developing scalable REST APIs, authentication systems, and real-time features with
                Socket.io.
              </p>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: 'var(--icon-well-bg)', border: '1px solid var(--icon-well-border)' }}
            >
              <MapPin size={14} style={{ color: '#f97316' }} />
            </div>
            <div>
              <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>
                Location
              </h4>
              <p className="text-[11px]" style={{ color: 'var(--brand-slate-light)' }}>
                Stoke-on-Trent, UK
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: 'var(--icon-well-bg)', border: '1px solid var(--icon-well-border)' }}
            >
              <Send size={14} style={{ color: '#f97316' }} />
            </div>
            <div>
              <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>
                Email
              </h4>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[11px] hover:underline" style={{ color: '#f97316' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="bento-animate md:col-span-2" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="p-2 rounded-lg shrink-0"
              style={{ backgroundColor: 'var(--icon-well-bg)', border: '1px solid var(--icon-well-border)' }}
            >
              <Code2 size={14} style={{ color: '#f97316' }} />
            </div>
            <h4 className="font-semibold text-xs" style={{ color: 'var(--brand-light)' }}>
              Tech Stack
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'NestJS',
              'Node.js',
              'PostgreSQL',
              'Docker',
              'Socket.io',
              'LangChain',
              'FastAPI',
              'Ollama',
              'Prisma',
              'React',
              'Next.js',
              'Tailwind CSS',
              'TypeScript',
              'Python',
              'REST API',
              'JWT/RBAC',
              'Redis',
              'Git',
            ].map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 24,
                  bgcolor: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)',
                  color: isDark ? '#e0cfc2' : '#6b4c30',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.15)',
                }}
              />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <h4 className="font-semibold text-xs mb-2.5" style={{ color: 'var(--brand-light)' }}>
            Connect
          </h4>
          <div className="space-y-1.5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#f97316]/50"
                style={{
                  color: 'var(--brand-slate-light)',
                  backgroundColor: 'var(--chip-muted-bg)',
                  border: '1px solid var(--bento-border)',
                }}
              >
                <span style={{ color: 'var(--brand-accent)' }}>
                  {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, {
                    className: 'w-3.5 h-3.5',
                  })}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="bento-animate md:col-span-3" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Experience', value: '2+ Years' },
              { label: 'Degree', value: 'MSc AI & DS' },
              { label: 'Focus', value: 'Backend & AI' },
              { label: 'Availability', value: 'Remote / Hybrid' },
            ].map((fact) => (
              <div key={fact.label} className="text-center">
                <div className="text-sm sm:text-base font-bold" style={{ color: '#f97316' }}>
                  {fact.value}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--brand-slate-light)' }}>
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
