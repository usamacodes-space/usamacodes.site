'use client';

import { Activity, Briefcase, ChevronRight } from 'lucide-react';
import Chip from '@mui/material/Chip';
import React from 'react';
import { EXPERIENCE } from '@/constants';
import { BentoCard } from '@/components/BentoCard';

export default function ExperiencePanel() {
  return (
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
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ backgroundColor: 'var(--icon-well-bg)', border: '1px solid var(--icon-well-border)' }}
                >
                  <Briefcase size={16} style={{ color: '#f97316' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--brand-light)' }}>
                    {exp.role}
                  </h3>
                  <p className="text-xs font-medium" style={{ color: '#f97316' }}>
                    {exp.company}
                  </p>
                </div>
              </div>
              <Chip
                icon={<Activity size={10} className="animate-pulse" />}
                label={exp.period}
                size="small"
                sx={{
                  fontSize: '0.65rem',
                  height: 24,
                  bgcolor: 'rgba(249,115,22,0.1)',
                  color: '#f97316',
                  border: '1px solid rgba(249,115,22,0.2)',
                }}
              />
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
  );
}
