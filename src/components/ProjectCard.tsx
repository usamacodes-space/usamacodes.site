import { Cpu, Layout, MessageSquare, QrCode, Ticket } from 'lucide-react';
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const getIcon = (iconName?: string) => {
  const iconProps = { className: "w-5 h-5 text-[#f97316]" };
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare {...iconProps} />;
    case 'QrCode': return <QrCode {...iconProps} />;
    case 'Ticket': return <Ticket {...iconProps} />;
    case 'Layout': return <Layout {...iconProps} />;
    default: return <Cpu {...iconProps} />;
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#5d707f]/40 hover:border-[#f97316]/50 hover:shadow-2xl hover:shadow-[#f97316]/10 active:scale-[0.99] sm:hover:-translate-y-1.5 transition-all duration-300 ease-out group flex flex-col min-h-0 h-full overflow-hidden font-mono bg-[var(--brand-bg)] touch-manipulation min-w-0">
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        <div className="p-2.5 sm:p-3 bg-[#5d707f]/20 rounded-lg sm:rounded-xl border border-[#5d707f]/40 group-hover:bg-[#f97316]/20 group-hover:scale-105 transition-all duration-300 shrink-0">
          {getIcon(project.icon)}
        </div>
        <div className="flex gap-1 sm:gap-1.5 flex-wrap justify-end min-w-0 max-w-[70%] sm:max-w-[60%]">
          {project.tags.map((tag, j) => (
            <span key={j} className="font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-[#5d707f]/20 border border-[#5d707f]/40 rounded-md text-[var(--brand-slate-light)] group-hover:text-[#f97316] group-hover:border-[#f97316]/50 transition-all duration-200 tracking-tight">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h3 className="font-mono text-sm sm:text-base font-medium mb-1.5 sm:mb-2 text-[#ecebf3] group-hover:text-[#f97316] transition-colors tracking-tight leading-tight">
        {project.title}
      </h3>

      <p className="font-mono text-[var(--brand-slate-light)] text-[11px] sm:text-[12px] mb-4 sm:mb-6 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex items-center gap-3 mt-auto pt-3 sm:pt-4 border-t border-[#5d707f]/40">
        <span className="font-mono text-[10px] text-[var(--brand-slate-light)] italic">
          Project demos will be live soon.
        </span>
      </div>
    </div>
  );
};
