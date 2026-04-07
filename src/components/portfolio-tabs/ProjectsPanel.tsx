'use client';

import React from 'react';
import { PROJECTS } from '@/constants';
import { ProjectCard } from '@/components/ProjectCard';

export default function ProjectsPanel() {
  return (
    <div className="flex-1 flex flex-col">
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
  );
}
