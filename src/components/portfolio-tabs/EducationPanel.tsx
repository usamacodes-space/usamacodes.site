'use client';

import { GraduationCap } from 'lucide-react';
import Chip from '@mui/material/Chip';
import React from 'react';
import { EDUCATION } from '@/constants';
import { BentoCard } from '@/components/BentoCard';

export default function EducationPanel() {
  return (
    <div
      className="flex-1 flex flex-col"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0%',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        minHeight: 0,
      }}
    >
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-0.5" style={{ color: 'var(--brand-light)' }}>
          Education
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--brand-slate-light)' }}>
          Academic background and qualifications
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl w-full auto-rows-min content-start">
        {EDUCATION.map((edu, idx) => (
          <BentoCard key={idx} className="bento-animate" sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <div className="flex items-start gap-2.5 mb-2.5">
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: 'var(--icon-well-bg)', border: '1px solid var(--icon-well-border)' }}
              >
                <GraduationCap size={16} style={{ color: '#f97316' }} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm break-words-mobile" style={{ color: 'var(--brand-light)' }}>
                  {edu.degree}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#f97316' }}>
                  {edu.institution}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Chip
                label={edu.period}
                size="small"
                sx={{ fontSize: '0.6rem', height: 22, bgcolor: 'var(--chip-muted-bg)', color: 'text.secondary' }}
              />
              {edu.badge && (
                <Chip
                  label={edu.badge}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', height: 22, borderColor: 'rgba(249,115,22,0.3)', color: '#f97316' }}
                />
              )}
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
