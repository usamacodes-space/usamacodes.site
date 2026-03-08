import { Cpu, ExternalLink, Layout, MessageSquare, QrCode, Ticket } from 'lucide-react';
import Chip from '@mui/material/Chip';
import React from 'react';
import { Project } from '../types';
import { BentoCard } from './BentoCard';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const getIcon = (iconName?: string) => {
  const props = { size: 20, style: { color: '#f97316' } };
  switch (iconName) {
    case 'MessageSquare': return <MessageSquare {...props} />;
    case 'QrCode': return <QrCode {...props} />;
    case 'Ticket': return <Ticket {...props} />;
    case 'Layout': return <Layout {...props} />;
    default: return <Cpu {...props} />;
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured }) => (
  <BentoCard
    colSpan={featured ? 2 : undefined}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...(featured && { gridColumn: { xs: 'span 1', md: 'span 2' } }),
    }}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div
        className="p-2.5 rounded-xl shrink-0"
        style={{ backgroundColor: 'rgba(249, 115, 22, 0.08)', border: '1px solid rgba(249, 115, 22, 0.15)' }}
      >
        {getIcon(project.icon)}
      </div>
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--brand-slate-light)' }}
          aria-label={`Visit ${project.title}`}
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>

    <h3 className="font-semibold text-sm sm:text-base mb-1.5" style={{ color: 'var(--brand-light)' }}>
      {project.title}
    </h3>
    <p className="text-xs sm:text-[13px] leading-relaxed mb-4 flex-1" style={{ color: 'var(--brand-slate-light)' }}>
      {project.description}
    </p>

    <div className="flex gap-1.5 flex-wrap mt-auto">
      {project.tags.map((tag, j) => (
        <Chip
          key={j}
          label={tag}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.65rem',
            height: 22,
            borderColor: 'rgba(93,112,127,0.3)',
            color: 'text.secondary',
          }}
        />
      ))}
    </div>
  </BentoCard>
);
